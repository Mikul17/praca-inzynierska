package org.mikul17.rpq.algorithms.SimulatedAnnealing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.experimental.SuperBuilder;
import org.mikul17.rpq.common.SolverParameters;


@SuperBuilder
@AllArgsConstructor
public class SimulatedAnnealingParameters extends SolverParameters {
    protected int maxIterations;
    protected double initialTemperature;
    protected double coolingRate;

}
