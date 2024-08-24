package org.mikul17.rpq.api;

import lombok.RequiredArgsConstructor;
import org.mikul17.rpq.api.Websocket.TaskSchedulerHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TaskController {

    private final TaskSchedulerHandler taskSchedulerHandler;

    @PostMapping("/start-scheduling")
    public String startScheduling() {
        // Logika przetwarzania pliku, uruchomienie algorytmu, itp.

        new Thread(() -> {
            try {
                // Przykład: wysyłanie danych do WebSocket co 1 sekundę
                for (int i = 0; i < 10; i++) {
                    String message = "Uszeregowanie zadań " + (i + 1);
                    taskSchedulerHandler.sendMessage(message);
                    Thread.sleep(1000); // Symulacja czasu przetwarzania
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();

        return "Scheduling started!";
    }

}
