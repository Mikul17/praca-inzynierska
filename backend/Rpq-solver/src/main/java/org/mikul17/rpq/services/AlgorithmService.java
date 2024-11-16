package org.mikul17.rpq.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mikul17.rpq.algorithms.Carlier.CarlierParameters;
import org.mikul17.rpq.algorithms.Schrage.SchrageParameters;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearchParameters;
import org.mikul17.rpq.algorithms.common.Algorithm;
import org.mikul17.rpq.algorithms.common.AlgorithmParameters;
import org.mikul17.rpq.algorithms.common.AlgorithmRunner;
import org.mikul17.rpq.algorithms.common.BatchedSolution;
import org.mikul17.rpq.api.enums.AlgorithmName;
import org.mikul17.rpq.api.request.ScheduleRequest;
import org.mikul17.rpq.exceptions.UnableToStartConnectionException;
import org.mikul17.rpq.factories.AlgorithmFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.*;
import java.util.function.Consumer;

@Service
@Slf4j
@RequiredArgsConstructor
public class AlgorithmService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    public static final Map<String, AlgorithmRunner<?, ?>> algorithmRunners = new ConcurrentHashMap<>();
    final Map<String, CompletableFuture<Void>> connectionRegistry = new ConcurrentHashMap<>();
    private final int CONNECTION_TIMEOUT = 30;

    public void startAlgorithm(ScheduleRequest request, String sessionId) {

        AlgorithmName algorithmName = request.algorithm();
        Algorithm<AlgorithmParameters, BatchedSolution> algorithm = AlgorithmFactory.createAlgorithm(algorithmName);

        AlgorithmParameters parameters;
        try{
            parameters = createAlgorithmParameters(request);
        } catch (UnsupportedOperationException e) {
            log.error("Error creating algorithm parameters", e);
            throw new IllegalArgumentException("Error creating algorithm parameters");
        }

        Consumer<BatchedSolution> solutionConsumer = batchSolution -> simpMessagingTemplate.convertAndSend("/scheduler/solution/" + sessionId, batchSolution);

        AlgorithmRunner<?, ?> runner = new AlgorithmRunner<>(algorithm, parameters, solutionConsumer);
        algorithmRunners.put(sessionId, runner);


        CompletableFuture<Void> readinessFuture = new CompletableFuture<>();
        connectionRegistry.put(sessionId, readinessFuture);

        CompletableFuture.runAsync(() -> {
            try {
                readinessFuture.get(CONNECTION_TIMEOUT, TimeUnit.SECONDS);
                log.info("Starting scheduling for sessionId: {}", sessionId);
                runner.run();
                log.info("Scheduling finished for sessionId: {}", sessionId);
                simpMessagingTemplate.convertAndSend("/scheduler/solution/" + sessionId, "FINISHED");
                algorithmRunners.remove(sessionId);
                connectionRegistry.remove(sessionId);
            } catch (InterruptedException | ExecutionException e) {
                log.error("Error waiting for client readiness", e);
                throw new UnableToStartConnectionException("Error while obtaining client connection");
            } catch (TimeoutException e) {
                log.error("Timeout: Connection not established after {} seconds", CONNECTION_TIMEOUT, e);
                throw new UnableToStartConnectionException("Timeout: Connection not established after " + CONNECTION_TIMEOUT + " seconds");
            }
        });
    }

    public void updateParameters (String sessionId, Map<String, Object> parameters) {
        AlgorithmRunner<?, ?> runner = getCorrespondingAlgorithmRunner(sessionId);
        if (runner != null) {
            log.info("[UPDATE} Updating parameters for sessionId: {}", sessionId);
            runner.updateParameters(parameters);
        }
    }

    public void clientReady(String sessionId) {
        CompletableFuture<Void> readinessFuture = connectionRegistry.get(sessionId);
        if (readinessFuture != null) {
            readinessFuture.complete(null);
            log.info("Connection successfully obtained for session: {}", sessionId);
        }else{
            log.warn("No pending connection request found for session: {}", sessionId);
        }
    }

    protected AlgorithmParameters createAlgorithmParameters (ScheduleRequest request) {
        switch (request.algorithm()) {
            case SIMULATED_ANNEALING:
                SimulatedAnnealingParameters saParams = SimulatedAnnealingParameters.builder()
                        .tasks(request.tasks())
                        .timeoutDuration(request.timeoutDuration() * 1000)
                        .build();
                saParams.fromMap(request.parameters());
                return saParams;
            case TABU_SEARCH:
                TabuSearchParameters tsParams = TabuSearchParameters.builder()
                        .tasks(request.tasks())
                        .timeoutDuration(request.timeoutDuration() * 1000)
                        .build();
                tsParams.fromMap(request.parameters());
                return tsParams;
            case SCHRAGE:
                SchrageParameters schrageParams = SchrageParameters.builder()
                        .tasks(request.tasks())
                        .timeoutDuration(request.timeoutDuration() * 1000)
                        .build();
                schrageParams.fromMap(request.parameters());
                return schrageParams;
            case CARLIER:
                return CarlierParameters.builder()
                        .tasks(request.tasks())
                        .timeoutDuration(request.timeoutDuration() * 1000)
                        .build();
            default:
                throw new IllegalArgumentException("Unknown algorithm: " + request.algorithm());
        }
    }

    AlgorithmRunner<?,?> getCorrespondingAlgorithmRunner(String sessionId) {
        AlgorithmRunner<?, ?> runner = algorithmRunners.get(sessionId);
        if (runner != null) {
            return runner;
        } else {
            log.warn("No algorithm runner found for sessionId: {}", sessionId);
            return null;
        }
    }

    public void simulatedAnnealingResetTemperature(String sessionId) {
        AlgorithmRunner<?, ?> runner = getCorrespondingAlgorithmRunner(sessionId);
        if (runner != null) {
            log.info("[Simulated Annealing] Resetting temperature for sessionId: {}", sessionId);
            runner.resetTemperature();
        }
    }

    public void simulatedAnnealingStopTemperatureChange(String sessionId, boolean reset) {
        AlgorithmRunner<?, ?> runner = getCorrespondingAlgorithmRunner(sessionId);
        if (runner != null) {
            log.info("[Simulated Annealing] Stopping temperature change for sessionId: {}", sessionId);
            if (reset) {
                runner.stopTemperatureChange();
            } else {
                runner.resumeTemperatureChange();
            }
        }
    }

    public void tabuSearchClearTabuList(String sessionId) {
        AlgorithmRunner<?, ?> runner = getCorrespondingAlgorithmRunner(sessionId);
        if (runner != null) {
            log.info("[Tabu Search] Clearing tabu list for sessionId: {}", sessionId);
            runner.clearTabuList();
        }
    }
}
