package org.mikul17.rpq.algorithms.Schrage;

import lombok.SneakyThrows;
import org.mikul17.rpq.algorithms.common.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.function.Consumer;

public class Schrage implements Algorithm<SchrageParameters, SchrageBatchedSolution> {

    @SneakyThrows
    @Override
    public Permutation solve(SchrageParameters parameters, Consumer<SchrageBatchedSolution> solutionConsumer) {
        Solution solution = new Solution();
        SchrageBatchedSolution batchedSolution = new SchrageBatchedSolution();
        List<Integer> permutation = new ArrayList<>();

        List<Task> sortedTasks = new ArrayList<>(parameters.getTasks());
        sortedTasks.sort(Comparator.comparing(Task::r));

        PriorityQueue<Task> readyQueue = new PriorityQueue<>(Comparator.comparing(Task::q).reversed());
        PriorityQueue<Task> notReadyQueue = new PriorityQueue<>(Comparator.comparing(Task::r));

        notReadyQueue.addAll(sortedTasks);
        int currentTime = 0;
        int cmax = 0;

        while (!readyQueue.isEmpty() || !notReadyQueue.isEmpty()) {
            while (!notReadyQueue.isEmpty() && notReadyQueue.peek().r() <= currentTime) {
                readyQueue.add(notReadyQueue.poll());
            }
            if (readyQueue.isEmpty()) {
                currentTime = Math.max(currentTime, notReadyQueue.peek().r());
            } else {
                Task task = readyQueue.poll();
                currentTime += task.p();
                permutation.add(task.id());
                int taskEnd = currentTime + task.q();
                cmax = Math.max(cmax, taskEnd);

                solution.setBestCmax(cmax);
                solution.setBestOrder(new ArrayList<>(permutation));
                batchedSolution.setBestSolution(solution);
                solutionConsumer.accept(batchedSolution);
            }
        }

        return Permutation.fromId(cmax, permutation);
    }

    //Wersja testowa z podzialem
//    @Override
//    public Permutation solve(SchrageParameters parameters, Consumer<SchrageBatchedSolution> solutionConsumer) {
//        List<Task> tasks = parameters.getTasks();
//
//        // Initialize the priority queues
//        PriorityQueue<Task> readyQueue = new PriorityQueue<>(
//                Comparator.comparing(Task::q).reversed()
//        );
//        PriorityQueue<Task> notReadyQueue = new PriorityQueue<>(
//                Comparator.comparing(Task::r)
//        );
//
//        notReadyQueue.addAll(tasks);
//
//        int currentTime = 0;
//        int cmax = 0;
//        Task currentTask = null; // The task currently being processed
//
//        while (!readyQueue.isEmpty() || !notReadyQueue.isEmpty()) {
//            // Move tasks that have become ready to the ready queue
//            while (!notReadyQueue.isEmpty() && notReadyQueue.peek().r() <= currentTime) {
//                Task task = notReadyQueue.poll();
//                readyQueue.add(task);
//
//                // Preemption condition
//                if (currentTask != null && task.q() > currentTask.q()) {
//                    // Update the remaining processing time of the current task
//                    currentTask.setP(currentTime - task.r());
//                    if (currentTask.p() > 0) {
//                        readyQueue.add(currentTask);
//                    }
//                    currentTask = task;
//                    currentTime = task.r();
//                }
//            }
//
//            if (readyQueue.isEmpty()) {
//                // No tasks are ready; advance time to the next task's release time
//                currentTime = notReadyQueue.peek().r();
//            } else {
//                // Process the task with the highest q value
//                Task task = readyQueue.poll();
//                currentTask = task;
//                currentTime += task.p();
//                cmax = Math.max(cmax, currentTime + task.q());
//            }
//        }
//
//        // Since the preemptive algorithm doesn't produce a permutation, we return only the Cmax
//        return new Permutation(cmax, Collections.emptyList());
//    }
}

