package org.mikul17.rpq.algorithms.Schrage;

import org.mikul17.rpq.common.Permutation;
import org.mikul17.rpq.common.Solver;
import org.mikul17.rpq.common.Task;

import java.util.Comparator;
import java.util.PriorityQueue;

public class Schrage implements Solver<SchrageParameters, SchrageSolution> {

    @Override
    public SchrageSolution solve (SchrageParameters parameters) {
        SchrageSolution solution = new SchrageSolution();

        PriorityQueue<Task> readyQueue = new PriorityQueue<>(
                Comparator.comparing(Task::q).reversed()
        );
        PriorityQueue<Task> notReadyQueue = new PriorityQueue<>(
                Comparator.comparing(Task::r)
        );

        notReadyQueue.addAll(parameters.getTasks());
        Permutation bestPermutation = new Permutation();
        int currentTime = 0;
        int cmax = 0;
        long startTime = System.nanoTime();

        while (!readyQueue.isEmpty() || !notReadyQueue.isEmpty()) {
            while (!notReadyQueue.isEmpty() && notReadyQueue.peek().r() <= currentTime) {
                readyQueue.add(notReadyQueue.poll());
            }
            if (readyQueue.isEmpty()) {
                currentTime = notReadyQueue.peek().r();
            } else {
                Task task = readyQueue.poll();
                currentTime += task.p();
                bestPermutation.add(task);
                int taskEnd = currentTime + task.q();
                cmax = Math.max(cmax, taskEnd);
            }
        }

        long endTime = System.nanoTime();
        long duration = (endTime - startTime);
        solution.setBestPermutation(Permutation.of(bestPermutation.getPermutation()));
        solution.setBestCmax(cmax);
        solution.setDuration(duration);

        return solution;
    }
}
