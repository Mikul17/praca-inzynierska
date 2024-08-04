package org.mikul17.rpq.common;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

public record Permutation(UUID id,List<Task> permutation, int cmax) {

    public static Permutation of(List<Task> permutation) {
        int cmax = 0;
        int time = 0;
        for (Task task : permutation) {
            time = Math.max(task.r(), time) + task.p();
            cmax = Math.max(cmax, time + task.q());
        }
        return new Permutation( UUID.randomUUID(),permutation, cmax);
    }

    public static Permutation of(List<Task> permutation, int cmax) {
        return new Permutation(UUID.randomUUID(),permutation, cmax);
    }

    public Permutation update(List<Task> permutation) {
        return of(permutation);
    }

    @Override
    public String toString() {
        return "Permutation{" +
                "id=" + id +
                '}';
    }
}
