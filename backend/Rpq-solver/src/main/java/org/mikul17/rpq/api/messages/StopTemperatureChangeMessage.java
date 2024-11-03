package org.mikul17.rpq.api.messages;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StopTemperatureChangeMessage {
    private String sessionId;
    private boolean reset;
}
