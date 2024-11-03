package org.mikul17.rpq.algorithms.common;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearchParameters;

import java.util.Map;
import java.util.function.Consumer;

@RequiredArgsConstructor
@Slf4j
public class AlgorithmRunner<T extends AlgorithmParameters, S extends BatchedSolution> {
    private final Algorithm<T, S> algorithm;
    private final T parameters;
    private final Consumer<BatchedSolution> solutionConsumer;

    public void run() {
        algorithm.solve(parameters, solutionConsumer::accept);
    }

    public void updateParameters(Map<String, Object> newParameters) {
        parameters.updateFromMap(newParameters);
    }

    public void resetTemperature () {
        if(parameters instanceof SimulatedAnnealingParameters) {
            ((SimulatedAnnealingParameters) parameters).resetTemperature();
        } else {
            log.error("Cannot reset parameters for algorithm: {}", algorithm.getClass().getSimpleName());
        }
    }

    public void stopTemperatureChange() {
        if(parameters instanceof SimulatedAnnealingParameters) {
            ((SimulatedAnnealingParameters) parameters).stopTemperatureChange();
        } else {
            log.error("Cannot stop temperature change for algorithm: {}", algorithm.getClass().getSimpleName());
        }
    }

    public void resumeTemperatureChange() {
        if(parameters instanceof SimulatedAnnealingParameters) {
            ((SimulatedAnnealingParameters) parameters).resumeTemperatureChange();
        } else {
            log.error("Cannot resume temperature change for algorithm: {}", algorithm.getClass().getSimpleName());
        }
    }

    public void clearTabuList() {
        if(parameters instanceof TabuSearchParameters) {
            ((TabuSearchParameters) parameters).clearTabuList();
        } else {
            log.error("Cannot clear tabu list for algorithm: {}", algorithm.getClass().getSimpleName());
        }
    }
}