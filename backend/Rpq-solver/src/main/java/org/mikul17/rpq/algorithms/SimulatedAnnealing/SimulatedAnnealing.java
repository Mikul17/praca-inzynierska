package org.mikul17.rpq.algorithms.SimulatedAnnealing;

import lombok.SneakyThrows;
import org.mikul17.rpq.algorithms.common.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.function.Consumer;

@Component
public class SimulatedAnnealing implements Algorithm<SimulatedAnnealingParameters, SimulatedAnnealingaBatchedSolution> {
    private final Random random = new Random();

    @SneakyThrows
    @Override
    public Permutation solve (SimulatedAnnealingParameters parameters, Consumer<SimulatedAnnealingaBatchedSolution> solutionConsumer) {
        SimulatedAnnealingaBatchedSolution batchedSolution = new SimulatedAnnealingaBatchedSolution();
        Solution bestSolution = new Solution();
        /* Temporary variables used in algorithm */
        List<Task> copy = new ArrayList<>(parameters.getTasks());
        Permutation bestPermutation = null;
        int previousCmax = calculateCmax(parameters.getTasks());
        int bestCmax = Integer.MAX_VALUE;
        double currentTemperature = parameters.initialTemperature;

        /* main loop of algorithm */
        for (int i = 0; i < parameters.maxIterations; i++) {
            List<Task> candidate = new ArrayList<>(copy);
            swapTwoRandomElements(candidate);
            int newCmax = calculateCmax(candidate);

            double acceptanceProbability = acceptanceProbability(
                    previousCmax,
                    newCmax,
                    currentTemperature
            );

            batchedSolution.addPermutation(candidate, newCmax);
            batchedSolution.addProbability(acceptanceProbability);

            if (random.nextDouble(1.0) < acceptanceProbability) {
                previousCmax = newCmax;
                Collections.copy(copy, candidate);
                if (newCmax < bestCmax) {
                    bestCmax = newCmax;
                    bestPermutation = Permutation.fromTasks(bestCmax, candidate);
                }
            }
            if(!parameters.stopTemperatureChangeFlag) {
                currentTemperature *= parameters.coolingRate;
            }
            batchedSolution.addTemperature(currentTemperature);

            if(i % 100 == 99 || i == parameters.maxIterations - 1) {
                bestSolution.setBestCmax(bestCmax);
                bestSolution.setBestOrder(bestPermutation != null ? bestPermutation.permutation() : null);
                batchedSolution.setBestSolution(bestSolution);
                solutionConsumer.accept(batchedSolution);
                batchedSolution = new SimulatedAnnealingaBatchedSolution();
                Thread.sleep(1000);
            }

            if(parameters.resetTemperatureFlag) {
                currentTemperature = parameters.initialTemperature;
                parameters.resetTemperatureFlag = false;
            }

            parameters.applyPendingChanges();
        }
        return bestPermutation;
    }

    private double acceptanceProbability (int best, int current, double temperature) {
        if (current < best) {
            return 1.0;
        }
        return Math.max(Math.exp((best - current) / temperature), 0.05);
    }

    private void swapTwoRandomElements (List<Task> tasks) {
        int index1 = random.nextInt(tasks.size());
        int index2 = random.nextInt(tasks.size());

        while (index1 == index2) {
            index2 = random.nextInt(tasks.size());
        }

        Collections.swap(tasks, index1, index2);
    }
}
