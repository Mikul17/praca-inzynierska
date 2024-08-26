package org.mikul17.rpq.algorithms.SimulatedAnnealing;

import lombok.Getter;
import org.mikul17.rpq.common.Solution;

import java.util.ArrayList;
import java.util.List;

@Getter
public class SimulatedAnnealingSolution extends Solution {
    protected List<Double> temperature;
    protected List<Double> acceptanceProbability;

    public SimulatedAnnealingSolution () {
        super();
        temperature = new ArrayList<>();
        acceptanceProbability = new ArrayList<>();
    }

    public void addProbability (double probability) {
        acceptanceProbability.add(probability);
    }

    public void addTemperature (double temp) {
        temperature.add(temp);
    }
}
