package org.mikul17.rpq.common;

import java.util.List;
import java.util.function.Consumer;

public interface Solver<T extends SolverParameters, S extends Solution> {
    S solve (T parameters, Consumer<S> callback);

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
