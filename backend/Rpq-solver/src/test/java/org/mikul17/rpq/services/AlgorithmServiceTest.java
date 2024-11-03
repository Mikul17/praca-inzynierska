package org.mikul17.rpq.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearchParameters;
import org.mikul17.rpq.algorithms.common.*;
import org.mikul17.rpq.api.enums.AlgorithmName;
import org.mikul17.rpq.api.request.ScheduleRequest;
import org.mikul17.rpq.factories.AlgorithmFactory;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AlgorithmServiceTest {

    @Mock
    private SimpMessagingTemplate simpMessagingTemplate;

    @InjectMocks
    private AlgorithmService algorithmService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldSendMessageOnAlgorithmFinish() {
        String sessionId = "test-session";

        Map<String, Object> parameters = Map.of(
                "maxIterations", 10,
                "initialTemperature", 100.0,
                "coolingRate", 0.95
        );

        ScheduleRequest request = new ScheduleRequest(AlgorithmName.SIMULATED_ANNEALING, new ArrayList<>(), parameters);

        SimulatedAnnealingParameters saParams = SimulatedAnnealingParameters.builder()
                .tasks(request.tasks())
                .build();

        saParams.fromMap(parameters);

        Permutation mockPermutation = new Permutation(100, Arrays.asList(1, 2, 3));

        Algorithm<AlgorithmParameters, BatchedSolution> mockAlgorithm = mock(Algorithm.class);
        when(mockAlgorithm.solve(any(), any())).thenReturn(mockPermutation);

        try (MockedStatic<AlgorithmFactory> mockedFactory = mockStatic(AlgorithmFactory.class)) {
            mockedFactory.when(() -> AlgorithmFactory.createAlgorithm(AlgorithmName.SIMULATED_ANNEALING))
                    .thenReturn(mockAlgorithm);

            AlgorithmService spyAlgorithmService = spy(algorithmService);
            doReturn(saParams).when(spyAlgorithmService).createAlgorithmParameters(request);

            spyAlgorithmService.startAlgorithm(request, sessionId);
            spyAlgorithmService.clientReady(sessionId);

            await().atMost(5, TimeUnit.SECONDS).untilAsserted(() ->
                    verify(simpMessagingTemplate).convertAndSend("/scheduler/solution/" + sessionId, "FINISHED")
            );
        }
    }

    @Test
    void shouldStartAlgorithmSuccessfully() {
        String sessionId = "test-session";

        Map<String, Object> parameters = Map.of(
                "maxIterations", 1000,
                "initialTemperature", 100.0,
                "coolingRate", 0.95
        );

        ScheduleRequest request = new ScheduleRequest(AlgorithmName.SIMULATED_ANNEALING, null, parameters);

        SimulatedAnnealingParameters saParams = SimulatedAnnealingParameters.builder()
                .tasks(request.tasks())
                .build();

        saParams.fromMap(parameters);

        AlgorithmService spyAlgorithmService = spy(algorithmService);
        doReturn(saParams).when(spyAlgorithmService).createAlgorithmParameters(request);

        spyAlgorithmService.startAlgorithm(request, sessionId);

        assertNotNull(AlgorithmService.algorithmRunners.get(sessionId));
        assertNotNull(spyAlgorithmService.getCorrespondingAlgorithmRunner(sessionId));
        assertEquals(AlgorithmService.algorithmRunners.size(), 1);
        verify(spyAlgorithmService, times(1)).getCorrespondingAlgorithmRunner(sessionId);
    }

    @Test
    void shouldUpdateParametersForExistingSession() {
        String sessionId = "test-session";
        Map<String, Object> parameters = Map.of("param1", "value1");

        AlgorithmRunner<?, ?> mockRunner = mock(AlgorithmRunner.class);
        AlgorithmService.algorithmRunners.put(sessionId, mockRunner);

        algorithmService.updateParameters(sessionId, parameters);

        verify(mockRunner, times(1)).updateParameters(parameters);
    }

    @Test
    void shouldCompleteReadinessForClient() {
        String sessionId = "test-session";

        CompletableFuture<Void> readinessFuture = new CompletableFuture<>();
        algorithmService.connectionRegistry.put(sessionId, readinessFuture);

        algorithmService.clientReady(sessionId);

        assertTrue(readinessFuture.isDone());
    }

    @Test
    void shouldResetTemperatureForSimulatedAnnealing() {
        String sessionId = "test-session";

        AlgorithmRunner<?, ?> mockRunner = mock(AlgorithmRunner.class);
        AlgorithmService.algorithmRunners.put(sessionId, mockRunner);

        algorithmService.simulatedAnnealingResetTemperature(sessionId);

        verify(mockRunner, times(1)).resetTemperature();
    }

    @Test
    void shouldStopTemperatureChangeForSimulatedAnnealing() {
        String sessionId = "test-session";

        AlgorithmRunner<?, ?> mockRunner = mock(AlgorithmRunner.class);
        AlgorithmService.algorithmRunners.put(sessionId, mockRunner);

        algorithmService.simulatedAnnealingStopTemperatureChange(sessionId, true);

        verify(mockRunner, times(1)).stopTemperatureChange();

        algorithmService.simulatedAnnealingStopTemperatureChange(sessionId, false);

        verify(mockRunner, times(1)).resumeTemperatureChange();
    }

    @Test
    void shouldStartTwoRunners() {
        String sessionId1 = "test-session-1";
        String sessionId2 = "test-session-2";

        Map<String, Object> parameters1 = Map.of(
                "maxIterations", 1000,
                "initialTemperature", 100.0,
                "coolingRate", 0.95
        );
        Map<String, Object> parameters2 = Map.of(
                "maxIterations", 500,
                "tabuListSize", 10
        );

        ScheduleRequest request1 = new ScheduleRequest(AlgorithmName.SIMULATED_ANNEALING, null, parameters1);
        ScheduleRequest request2 = new ScheduleRequest(AlgorithmName.TABU_SEARCH, null, parameters2);

        SimulatedAnnealingParameters saParams = SimulatedAnnealingParameters.builder()
                .tasks(request1.tasks())
                .build();
        saParams.fromMap(parameters1);

        TabuSearchParameters tsParams = TabuSearchParameters.builder()
                .tasks(request2.tasks())
                .build();
        tsParams.fromMap(parameters2);

        AlgorithmService spyAlgorithmService = spy(algorithmService);
        doReturn(saParams).when(spyAlgorithmService).createAlgorithmParameters(request1);
        doReturn(tsParams).when(spyAlgorithmService).createAlgorithmParameters(request2);

        spyAlgorithmService.startAlgorithm(request1, sessionId1);
        spyAlgorithmService.startAlgorithm(request2, sessionId2);

        assertNotNull(AlgorithmService.algorithmRunners.get(sessionId1), "Runner for sessionId1 should not be null");
        assertNotNull(AlgorithmService.algorithmRunners.get(sessionId2), "Runner for sessionId2 should not be null");

        assertNotSame(
                AlgorithmService.algorithmRunners.get(sessionId1),
                AlgorithmService.algorithmRunners.get(sessionId2),
                "Each session should have a separate runner instance"
        );

        assertEquals(
                AlgorithmService.algorithmRunners.size(),
                2,
                "There should be two runners in the registry"
        );

        assertEquals(
                spyAlgorithmService.getCorrespondingAlgorithmRunner(sessionId1),
                AlgorithmService.algorithmRunners.get(sessionId1),
                "Corresponding runner for sessionId1 should be the same as the one in the registry"
        );

        assertEquals(
                spyAlgorithmService.getCorrespondingAlgorithmRunner(sessionId2),
                AlgorithmService.algorithmRunners.get(sessionId2),
                "Corresponding runner for sessionId2 should be the same as the one in the registry"
        );
    }
}
