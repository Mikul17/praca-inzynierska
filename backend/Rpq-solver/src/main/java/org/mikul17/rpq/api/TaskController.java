package org.mikul17.rpq.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealing;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@Slf4j
@RequiredArgsConstructor
public class TaskController {

    private final SimulatedAnnealing simulatedAnnealing;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/start-scheduling")
    public ResponseEntity<String> startScheduling(@RequestBody TestRequest request) {
        CompletableFuture.runAsync(() -> {
            try {
                log.debug("Request body: {}", request);
                SimulatedAnnealingParameters parameters = SimulatedAnnealingParameters.builder()
                        .tasks(request.getTasks())
                        .coolingRate(request.getCoolingRate())
                        .maxIterations(request.getMaxIterations())
                        .initialTemperature(request.getInitialTemperature())
                        .build();

                simulatedAnnealing.solve(parameters, solution -> {
                    messagingTemplate.convertAndSend("/scheduler/solution/"+request.getId(), solution);
                });
            } catch (Exception e) {
                e.printStackTrace(); // Log the exception
            }
        });

        return ResponseEntity.ok("Scheduling started for id" + request.getId());
    }

}
