package org.mikul17.rpq.algorithms.SimulatedAnnealing;

import org.mikul17.rpq.common.Permutation;
import org.mikul17.rpq.common.Solver;
import org.mikul17.rpq.common.Task;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class SimulatedAnnealing
        implements Solver<SimulatedAnnealingParameters, SimulatedAnnealingSolution> {
    private final Random random = new Random();

    @Override
    public SimulatedAnnealingSolution solve (SimulatedAnnealingParameters parameters) {
        SimulatedAnnealingSolution solution = new SimulatedAnnealingSolution();
        long startTime = System.nanoTime();

        /* Temporary variables used in algorithm */
        List<Task> copy = new ArrayList<>(parameters.getTasks());
        Permutation bestPermutation = Permutation.of(parameters.getTasks());
        int previousCmax = calculateCmax(parameters.getTasks());
        int bestCmax = Integer.MAX_VALUE;
        double currentTemperature = parameters.initialTemperature;
        solution.temperature.add(parameters.initialTemperature);

        /* main loop of algorithm */
        for (int i = 0; i < parameters.maxIterations; i++) {
            List<Task> candidate = new ArrayList<>(copy);
            swapTwoRandomElements(candidate);
            int newCmax = calculateCmax(candidate);
            double acceptanceProbability = acceptanceProbability(
                    previousCmax,
                    newCmax,
                    solution.temperature.get(i)
            );
            solution.addPermutation(candidate);
            solution.addProbability(acceptanceProbability);

            if (random.nextDouble(1.0) < acceptanceProbability) {
                previousCmax = newCmax;
                Collections.copy(copy, candidate);
                if (newCmax < bestCmax) {
                    bestPermutation = Permutation.of(candidate);
                    bestCmax = newCmax;
                }
            }
            currentTemperature *= parameters.coolingRate;
            solution.addTemperature(currentTemperature);
        }
        long endTime = System.nanoTime();
        long duration = endTime - startTime;

        solution.setBestCmax(bestCmax);
        solution.setBestPermutation(bestPermutation);
        solution.setDuration(duration);

        return solution;
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
