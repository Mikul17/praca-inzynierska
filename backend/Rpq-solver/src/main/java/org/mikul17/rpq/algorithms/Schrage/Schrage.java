package org.mikul17.rpq.algorithms.Schrage;

import lombok.Getter;
import lombok.SneakyThrows;
import org.mikul17.rpq.algorithms.common.*;

import java.util.*;
import java.util.function.Consumer;

public class Schrage implements Algorithm<SchrageParameters, SchrageBatchedSolution> {

    public Permutation solve(SchrageParameters parameters, Consumer<SchrageBatchedSolution> solutionConsumer) {
        if (parameters.isPreemptive()) {
            return solveWithPreemption(parameters, solutionConsumer);
        } else {
            return solveSchrage(parameters, solutionConsumer);
        }
    }

    @SneakyThrows
    private Permutation solveWithPreemption(SchrageParameters parameters, Consumer<SchrageBatchedSolution> solutionConsumer) {
        Solution solution = new Solution();
        SchrageBatchedSolution batchedSolution = new SchrageBatchedSolution();
        List<Integer> permutation = new ArrayList<>();
        List<Permutation> solutions = new ArrayList<>();

        List<ModifiableTask> modifiableTasks = parameters.getTasks().stream()
                .map(task -> new ModifiableTask(task.id(), task.r(), task.p(), task.q()))
                .toList();

        PriorityQueue<ModifiableTask> readyQueue = new PriorityQueue<>(Comparator.comparing(ModifiableTask::getQ).reversed());
        PriorityQueue<ModifiableTask> notReadyQueue = new PriorityQueue<>(Comparator.comparing(ModifiableTask::getR));

        notReadyQueue.addAll(modifiableTasks);
        int currentTime = 0;
        int cmax = 0;
        ModifiableTask currentTask = null;

        while (!readyQueue.isEmpty() || !notReadyQueue.isEmpty()) {
            while (!notReadyQueue.isEmpty() && notReadyQueue.peek().r <= currentTime) {
                ModifiableTask task = notReadyQueue.poll();
                readyQueue.add(task);
                solution.setBestCmax(cmax);
                solution.setBestOrder(new ArrayList<>(permutation));
                batchedSolution.setQueueFromModifiableTask(readyQueue, true);
                batchedSolution.setQueueFromModifiableTask(notReadyQueue, false);
                batchedSolution.setBestSolution(solution);
                solutionConsumer.accept(batchedSolution);
                batchedSolution = new SchrageBatchedSolution();
                Thread.sleep(parameters.getTimeoutDuration());

                if (currentTask != null && task.q > currentTask.q) {
                    currentTask.p = (currentTime - task.r);
                    currentTime = task.r;
                    if(currentTask.p > 0) {
                        readyQueue.add(currentTask);
                    }
                    break;
                }
            }

            if (readyQueue.isEmpty()) {
                currentTime = Math.max(currentTime, notReadyQueue.peek().r);
            } else {
                currentTask = readyQueue.poll();
                currentTime += currentTask.p;
                permutation.add(currentTask.getId());
                solutions.add(Permutation.fromId(currentTime + currentTask.q, new ArrayList<>(permutation)));
                cmax = Math.max(cmax, currentTime + currentTask.getQ());
            }
            solution.setBestCmax(cmax);
            solution.setBestOrder(new ArrayList<>(permutation));
            batchedSolution.setQueueFromModifiableTask(readyQueue, true);
            batchedSolution.setQueueFromModifiableTask(notReadyQueue, false);
            batchedSolution.setBestSolution(solution);
            batchedSolution.setPermutations(solutions);
            solutionConsumer.accept(batchedSolution);
            batchedSolution = new SchrageBatchedSolution();
            Thread.sleep(parameters.getTimeoutDuration());
        }

        return Permutation.fromId(cmax, permutation);
    }

    @SneakyThrows
    private Permutation solveSchrage(SchrageParameters parameters, Consumer<SchrageBatchedSolution> solutionConsumer){
        Solution solution = new Solution();
        SchrageBatchedSolution batchedSolution = new SchrageBatchedSolution();
        List<Integer> permutation = new ArrayList<>();
        List<Permutation> solutions = new ArrayList<>();

        List<Task> tasks = new ArrayList<>(parameters.getTasks());

        PriorityQueue<Task> readyQueue = new PriorityQueue<>(Comparator.comparing(Task::q).reversed());
        PriorityQueue<Task> notReadyQueue = new PriorityQueue<>(Comparator.comparing(Task::r));

        notReadyQueue.addAll(tasks);
        int currentTime = 0;
        int cmax = 0;

        while (!readyQueue.isEmpty() || !notReadyQueue.isEmpty()) {
            while (!notReadyQueue.isEmpty() && notReadyQueue.peek().r() <= currentTime) {
                readyQueue.add(notReadyQueue.poll());
                solution.setBestCmax(cmax);
                solution.setBestOrder(new ArrayList<>(permutation));
                batchedSolution.setQueueFromTask(readyQueue, true);
                batchedSolution.setQueueFromTask(notReadyQueue, false);
                batchedSolution.setBestSolution(solution);
                solutionConsumer.accept(batchedSolution);
                batchedSolution = new SchrageBatchedSolution();
                Thread.sleep(parameters.getTimeoutDuration());
            }
            if (readyQueue.isEmpty()) {
                assert notReadyQueue.peek() != null;
                currentTime = Math.max(currentTime, notReadyQueue.peek().r());
            } else {
                Task task = readyQueue.poll();
                currentTime += task.p();
                permutation.add(task.id());
                solutions.add(Permutation.fromId(currentTime + task.q(), new ArrayList<>(permutation)));
                int taskEnd = currentTime + task.q();
                cmax = Math.max(cmax, taskEnd);

                solution.setBestCmax(cmax);
                solution.setBestOrder(new ArrayList<>(permutation));
                batchedSolution.setQueueFromTask(readyQueue, true);
                batchedSolution.setQueueFromTask(notReadyQueue, false);
                batchedSolution.setBestSolution(solution);
                batchedSolution.setPermutations(solutions);
                solutionConsumer.accept(batchedSolution);
                batchedSolution = new SchrageBatchedSolution();
                Thread.sleep(parameters.getTimeoutDuration());
            }
        }

        return Permutation.fromId(cmax, permutation);
    }

    @Getter
    public class ModifiableTask {
        private final int id;
        private final int r;
        private int p;
        private final int q;

        public ModifiableTask (int id, int r, int p, int q) {
            this.id = id;
            this.r = r;
            this.p = p;
            this.q = q;
        }

    }
}

