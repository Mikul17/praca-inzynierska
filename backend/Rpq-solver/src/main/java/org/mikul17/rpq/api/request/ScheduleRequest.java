package org.mikul17.rpq.api.request;

import org.mikul17.rpq.algorithms.common.Task;
import org.mikul17.rpq.api.enums.AlgorithmName;

import java.util.List;
import java.util.Map;

public record ScheduleRequest(
        AlgorithmName algorithm,
        List<Task> tasks,
        int timeoutDuration,
        Map<String, Object> parameters
){}
