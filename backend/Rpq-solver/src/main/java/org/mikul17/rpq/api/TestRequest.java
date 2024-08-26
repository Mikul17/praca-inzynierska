package org.mikul17.rpq.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.mikul17.rpq.common.Task;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TestRequest {
    List<Task> tasks;
    double coolingRate;
    double initialTemperature;
    int maxIterations;
    int id;
}
