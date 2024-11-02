package org.mikul17.rpq.factories;

import org.mikul17.rpq.algorithms.Schrage.Schrage;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealing;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearch;
import org.mikul17.rpq.algorithms.common.Algorithm;

import org.mikul17.rpq.algorithms.common.AlgorithmParameters;
import org.mikul17.rpq.algorithms.common.BatchedSolution;
import org.mikul17.rpq.api.enums.AlgorithmName;

@SuppressWarnings("unchecked")
public class AlgorithmFactory {
    public static <T extends AlgorithmParameters, S extends BatchedSolution> Algorithm<T,S> createAlgorithm (AlgorithmName algorithmName) {
        return switch (algorithmName) {
            case SIMULATED_ANNEALING -> (Algorithm<T, S>) new SimulatedAnnealing();
            case TABU_SEARCH -> (Algorithm<T, S>) new TabuSearch();
            case SCHRAGE -> (Algorithm<T, S>) new Schrage();
            default -> throw new IllegalArgumentException("Unknown algorithm: " + algorithmName);
        };
    }
}