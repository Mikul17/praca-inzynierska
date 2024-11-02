package org.mikul17.rpq.api.messages;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class ParameterUpdateMessage {
    private String sessionId;
    private Map<String, Object> parameters;
}

