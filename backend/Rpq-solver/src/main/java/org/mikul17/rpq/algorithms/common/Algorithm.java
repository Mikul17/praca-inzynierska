package org.mikul17.rpq.algorithms.common;

import java.util.List;
import java.util.function.Consumer;

public interface Algorithm<T extends AlgorithmParameters, S extends BatchedSolution> {
    Permutation solve (T parameters, Consumer<S> stream);

    default int calculateCmax (List<Task> tasks) {
        int cmax = 0;
        int time = 0;
        for (Task task : tasks) {
            time = Math.max(task.r(), time) + task.p();
            cmax = Math.max(cmax, time + task.q());
        }
        return cmax;
    }
}
