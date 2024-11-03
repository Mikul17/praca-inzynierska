package org.mikul17.rpq.algorithms.common;

import java.util.List;

public record Permutation(int cmax, List<Integer> permutation) {
    public static Permutation fromId(int cmax, List<Integer> permutation) {
        return new Permutation(cmax, permutation);
    }
    public static Permutation fromTasks(int cmax, List<Task> tasks) {
        return new Permutation(cmax, tasks.stream().map(Task::id).toList());
    }
}
