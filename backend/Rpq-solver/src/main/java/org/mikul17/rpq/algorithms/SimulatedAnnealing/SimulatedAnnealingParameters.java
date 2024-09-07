package org.mikul17.rpq.algorithms.SimulatedAnnealing;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.mikul17.rpq.algorithms.common.SolverParameters;

import java.util.Map;

@SuperBuilder
@AllArgsConstructor
@Getter
public class SimulatedAnnealingParameters extends SolverParameters {
    protected int maxIterations;
    protected double initialTemperature;
    protected double coolingRate;

    @Override
    public void fromMap (Map<String, Object> map) {
        maxIterations = (int) map.get("maxIterations");
        initialTemperature = (double) map.get("initialTemperature");
        coolingRate = (double) map.get("coolingRate");
    }
}
