package org.mikul17.rpq.algorithms.SimulatedAnnealing;

import lombok.Getter;
import org.mikul17.rpq.algorithms.common.BatchedSolution;

import java.util.ArrayList;
import java.util.List;

@Getter
public class SimulatedAnnealingaBatchedSolution extends BatchedSolution {
    private final List<Double> probabilities = new ArrayList<>();
    private final List<Double> temperatures = new ArrayList<>();

    public void addProbability (double probability) {
        probabilities.add(probability);
    }

    public void addTemperature (double temp) {
        temperatures.add(temp);
    }
}
