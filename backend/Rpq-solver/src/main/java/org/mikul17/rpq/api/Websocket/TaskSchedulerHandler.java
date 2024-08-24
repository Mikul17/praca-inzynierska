package org.mikul17.rpq.api.Websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;


@Slf4j
@Component
public class TaskSchedulerHandler extends TextWebSocketHandler {

    private WebSocketSession session;

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws IOException {
        String receivedMessage = (String) message.getPayload();
        session.sendMessage(new TextMessage("Received: " + receivedMessage));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("New connection: " + session.getId());
        this.session = session;
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        log.info("Connection closed: " + session.getId());
        this.session = null;
    }

    public void sendMessage(String message) {
        try {
            if (session != null) {
                session.sendMessage(new TextMessage(message));
            }
        } catch (IOException e) {
            log.error("Error while sending message", e);
        }
    }

}
