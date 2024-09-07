package org.mikul17.rpq.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealing;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.mikul17.rpq.api.request.ScheduleRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController("/api")
@Slf4j
@RequiredArgsConstructor
public class WebSocketTestController {

    private final SimulatedAnnealing simulatedAnnealing;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/test")
    public ResponseEntity<?> startScheduling(@RequestBody ScheduleRequest request) {
        CompletableFuture.runAsync(() -> {
            log.info("Starting scheduling");
            SimulatedAnnealingParameters parameters = SimulatedAnnealingParameters.builder()
                            .tasks(request.tasks())
                                    .build();
            parameters.fromMap(request.parameters());
            simulatedAnnealing.solve(parameters, solution -> {
                simpMessagingTemplate.convertAndSend("/scheduler/solution", solution);
            });
            log.info("Scheduling finished");
        });
        return ResponseEntity.ok().build();
    }
}
