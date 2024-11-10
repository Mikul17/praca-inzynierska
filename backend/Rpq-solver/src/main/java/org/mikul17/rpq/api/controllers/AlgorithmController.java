package org.mikul17.rpq.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mikul17.rpq.api.request.ScheduleRequest;
import org.mikul17.rpq.exceptions.UnableToStartConnectionException;
import org.mikul17.rpq.services.AlgorithmService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;


@Slf4j
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AlgorithmController {

    private final AlgorithmService algorithmService;

    @PostMapping("/start_scheduling")
    public ResponseEntity<?> startScheduling (@RequestBody ScheduleRequest request) {
        String sessionId = UUID.randomUUID().toString();
        try {
            algorithmService.startAlgorithm(request, sessionId);
        } catch (UnableToStartConnectionException e) {
            log.error("Error starting algorithm: {}", e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }catch (UnsupportedOperationException | IllegalArgumentException e) {
            log.error("Error creating algorithm parameters: {}", e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
        catch (Exception e) {
            log.error("Error starting algorithm", e);
            return ResponseEntity.status(500).body("Error starting algorithm");
        }
        return ResponseEntity.ok(sessionId);
    }
}
