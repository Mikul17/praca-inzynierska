package org.mikul17.rpq.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mikul17.rpq.api.messages.ParameterUpdateMessage;
import org.mikul17.rpq.api.messages.StopTemperatureChangeMessage;
import org.mikul17.rpq.services.AlgorithmService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;


@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final AlgorithmService algorithmService;

    @MessageMapping("/scheduler/parameters")
    public void updateParameters (@Payload ParameterUpdateMessage message) {
        algorithmService.updateParameters(message.getSessionId(), message.getParameters());
    }

    @MessageMapping("/scheduler/ready")
    public void clientReady (@Payload String sessionId) {
        algorithmService.clientReady(sessionId);
    }

    @MessageMapping("/scheduler/sa/reset_temperature")
    public void resetTemperature (@Payload String sessionId) {
        algorithmService.simulatedAnnealingResetTemperature(sessionId);
    }

    @MessageMapping("/scheduler/sa/stop_temperature_change")
    public void stopTemperatureChange (@Payload StopTemperatureChangeMessage message) {
        algorithmService.simulatedAnnealingStopTemperatureChange(message.getSessionId(), message.isReset());
    }

    @MessageMapping("/scheduler/ts/clear_tabu_list")
    public void clearTabuList (@Payload String sessionId) {
        algorithmService.tabuSearchClearTabuList(sessionId);
    }

}
