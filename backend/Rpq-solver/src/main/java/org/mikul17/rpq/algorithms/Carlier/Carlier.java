package org.mikul17.rpq.algorithms.Carlier;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.SneakyThrows;
import org.mikul17.rpq.algorithms.common.Algorithm;
import org.mikul17.rpq.algorithms.common.Permutation;
import org.mikul17.rpq.algorithms.common.Solution;

import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.IntStream;


public class Carlier implements Algorithm<CarlierParameters, CarlierBatchedSolution> {

    private int ub = Integer.MAX_VALUE;
    private Permutation bestPermutation;
    private SolutionNode rootNode;

    @Override
    @SneakyThrows
    public Permutation solve(CarlierParameters parameters, Consumer<CarlierBatchedSolution> stream) {
        List<ModifiableTask> tasks = parameters.getTasks().stream()
                .map(t -> new ModifiableTask(t.id(), t.r(), t.p(), t.q()))
                .collect(Collectors.toList());
        List<Permutation> permutations = new ArrayList<>();
        ub = Integer.MAX_VALUE;
        bestPermutation = null;

        rootNode = new SolutionNode(null, null, Integer.MAX_VALUE, Integer.MAX_VALUE, false);
        carlier(tasks, stream, rootNode);
        CarlierBatchedSolution solution = new CarlierBatchedSolution();
        solution.setUb(ub);
        solution.setNode(rootNode);
        solution.setBestSolution(new Solution(bestPermutation.cmax(), bestPermutation.permutation()));
        permutations.add(bestPermutation);
        solution.setPermutations(permutations);
        stream.accept(solution);
        Thread.sleep(1000);
        return bestPermutation;
    }

    @SneakyThrows
    private void carlier(List<ModifiableTask> tasks, Consumer<CarlierBatchedSolution> stream, SolutionNode currentNode) {
        List<ScheduledTask> schedule = new ArrayList<>();
        List<Permutation> permutations = new ArrayList<>();
        Permutation perm = schrage(tasks, schedule);
        int u = perm.cmax();
        currentNode.setActive(true);

        currentNode.setPermutation(perm);
        currentNode.setUb(u);

        if (u < ub) {
            ub = u;
            bestPermutation = perm;
        }

        CarlierBatchedSolution solution = new CarlierBatchedSolution();
        solution.setUb(ub);
        solution.setNode(rootNode);
        solution.setBestSolution(new Solution(bestPermutation.cmax(), bestPermutation.permutation()));
        permutations.add(bestPermutation);
        solution.setPermutations(permutations);
        permutations = new ArrayList<>();
        stream.accept(solution);
        Thread.sleep(1000);

        List<ScheduledTask> criticalPath = findCriticalPath(schedule);
        if (criticalPath.isEmpty()) {
            currentNode.setActive(false);
            return;
        }

        ScheduledTask taskB = criticalPath.getLast();
        ScheduledTask taskC = IntStream.iterate(criticalPath.size() - 1, i -> i >= 0, i -> i - 1)
                .mapToObj(criticalPath::get)
                .filter(task -> task.getQ() < taskB.getQ())
                .findFirst()
                .orElse(null);

        if (taskC == null) {
            currentNode.setActive(false);
            return;
        }

        int rPrime = Integer.MAX_VALUE;
        int qPrime = Integer.MAX_VALUE;
        int pPrime = 0;

        int indexC = schedule.indexOf(taskC);
        int indexB = schedule.indexOf(taskB);

        for (int i = indexC + 1; i <= indexB; i++) {
            ScheduledTask task = schedule.get(i);
            rPrime = Math.min(rPrime, task.getR());
            qPrime = Math.min(qPrime, task.getQ());
            pPrime += task.getP();
        }

        ModifiableTask taskCOriginal = tasks.stream()
                .filter(t -> t.getId() == taskC.getId())
                .findFirst()
                .orElseThrow();

        int originalR = taskCOriginal.getR();
        taskCOriginal.setR(Math.max(taskCOriginal.getR(), rPrime + pPrime));

        List<ModifiableTask> tasksCopy = copyTasks(tasks);

        Permutation lbPerm = schrageWithPreemption(tasksCopy);
        int lb = lbPerm.cmax();

        // Left Child Node
        SolutionNode leftChild = new SolutionNode(currentNode, perm, ub, lb, true);
        currentNode.addChild(leftChild);

        currentNode.setActive(false);
        if (lb < ub) {
            carlier(tasksCopy, stream, leftChild);
        } else {
            leftChild.setPermutation(bestPermutation);
            leftChild.setUb(ub);
            leftChild.setPruned(true);
        }
        currentNode.setActive(true);

        taskCOriginal.setR(originalR);

        int originalQ = taskCOriginal.getQ();
        taskCOriginal.setQ(Math.max(taskCOriginal.getQ(), qPrime + pPrime));

        tasksCopy = copyTasks(tasks);

        lb = schrageWithPreemption(tasksCopy).cmax();

        // Right Child Node
        SolutionNode rightChild = new SolutionNode(currentNode, perm, ub, lb, false);
        currentNode.addChild(rightChild);

        solution = new CarlierBatchedSolution();
        solution.setUb(ub);
        solution.setNode(rootNode);
        permutations.add(bestPermutation);
        solution.setPermutations(permutations);
        solution.setBestSolution(new Solution(bestPermutation.cmax(), bestPermutation.permutation()));

        stream.accept(solution);
        Thread.sleep(1000);

        currentNode.setActive(false);
        if (lb < ub) {
            carlier(tasksCopy, stream, rightChild);
        } else {
            rightChild.setPermutation(bestPermutation);
            rightChild.setUb(ub);
            rightChild.setPruned(true);
        }
        taskCOriginal.setQ(originalQ);
    }

    private List<ModifiableTask> copyTasks (List<ModifiableTask> tasks) {
        return tasks.stream()
                .map(t -> new ModifiableTask(t.getId(), t.getR(), t.getP(), t.getQ()))
                .collect(Collectors.toList());
    }

    private Permutation schrage (List<ModifiableTask> tasks, List<ScheduledTask> schedule) {
        List<Integer> permutation = new ArrayList<>();

        PriorityQueue<ModifiableTask> readyQueue = new PriorityQueue<>(Comparator.comparing(ModifiableTask::getQ).reversed());
        PriorityQueue<ModifiableTask> notReadyQueue = new PriorityQueue<>(Comparator.comparing(ModifiableTask::getR));

        notReadyQueue.addAll(tasks);
        int currentTime = 0;
        int cmax = 0;

        while (!readyQueue.isEmpty() || !notReadyQueue.isEmpty()) {
            while (!notReadyQueue.isEmpty() && notReadyQueue.peek().getR() <= currentTime) {
                readyQueue.add(notReadyQueue.poll());
            }
            if (readyQueue.isEmpty()) {
                currentTime = notReadyQueue.peek().getR();
            } else {
                ModifiableTask task = readyQueue.poll();
                int startTime = currentTime;
                currentTime += task.getP();
                schedule.add(new ScheduledTask(task, startTime));
                permutation.add(task.getId());
                cmax = Math.max(cmax, currentTime + task.getQ());
            }
        }

        return new Permutation(cmax, permutation);
    }

    private Permutation schrageWithPreemption (List<ModifiableTask> tasks) {
        List<Integer> permutation = new ArrayList<>();
        PriorityQueue<ModifiableTask> readyQueue = new PriorityQueue<>(Comparator.comparing(ModifiableTask::getQ).reversed());
        PriorityQueue<ModifiableTask> notReadyQueue = new PriorityQueue<>(Comparator.comparing(ModifiableTask::getR));

        notReadyQueue.addAll(tasks);
        int currentTime = 0;
        int cmax = 0;
        ModifiableTask currentTask = null;

        while (!readyQueue.isEmpty() || !notReadyQueue.isEmpty()) {
            while (!notReadyQueue.isEmpty() && notReadyQueue.peek().getR() <= currentTime) {
                ModifiableTask task = notReadyQueue.poll();
                readyQueue.add(task);
                if (currentTask != null && task.getQ() > currentTask.getQ()) {
                    currentTask.setP(currentTime - task.getR());
                    currentTime = task.getR();
                    if (currentTask.getP() > 0) {
                        readyQueue.add(currentTask);
                    }
                }
            }
            if (readyQueue.isEmpty()) {
                currentTime = notReadyQueue.peek().getR();
            } else {
                currentTask = readyQueue.poll();
                currentTime += currentTask.getP();
                permutation.add(currentTask.getId());
                cmax = Math.max(cmax, currentTime + currentTask.getQ());
            }
        }

        return Permutation.fromId(cmax, permutation);
    }

    private List<ScheduledTask> findCriticalPath (List<ScheduledTask> schedule) {
        LinkedList<ScheduledTask> criticalPath = new LinkedList<>();
        int cmax = schedule.stream()
                .mapToInt(t -> t.getCompletionTime() + t.getQ())
                .max()
                .orElse(0);

        ScheduledTask lastTask = null;
        for (int i = schedule.size() - 1; i >= 0; i--) {
            ScheduledTask task = schedule.get(i);
            if (task.getCompletionTime() + task.getQ() == cmax) {
                lastTask = task;
                break;
            }
        }

        if (lastTask == null) {
            return criticalPath;
        }

        criticalPath.addFirst(lastTask);
        int completionTime = lastTask.getStartTime();

        for (int i = schedule.indexOf(lastTask) - 1; i >= 0; i--) {
            ScheduledTask task = schedule.get(i);
            if (task.getCompletionTime() == completionTime) {
                criticalPath.addFirst(task);
                completionTime = task.getStartTime();
            }
        }

        return criticalPath;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class ModifiableTask {
        private final int id;
        private int r;
        private int p;
        private int q;
    }

    @Getter
    public static class ScheduledTask {
        private final ModifiableTask task;
        private final int startTime;
        private final int completionTime;

        public ScheduledTask (ModifiableTask task, int startTime) {
            this.task = task;
            this.startTime = startTime;
            this.completionTime = startTime + task.getP();
        }

        public int getId () {
            return task.getId();
        }

        public int getR () {
            return task.getR();
        }

        public int getP () {
            return task.getP();
        }

        public int getQ () {
            return task.getQ();
        }
    }

    @Getter
    @Setter
    @JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property = "@id")
    public static class SolutionNode {
        private final SolutionNode parent;
        private final List<SolutionNode> children = new ArrayList<>();
        private Permutation permutation;
        private int ub;
        private int lb;
        private boolean pruned = false;
        private boolean isLeftChild;
        private boolean active;


        public SolutionNode(SolutionNode parent, Permutation permutation, int ub, int lb, boolean isLeftChild) {
            this.parent = parent;
            this.permutation = permutation;
            this.ub = ub;
            this.lb = lb;
            this.isLeftChild = isLeftChild;
            this.active = false;
        }

        public void addChild(SolutionNode child) {
            children.add(child);
        }
    }

}
