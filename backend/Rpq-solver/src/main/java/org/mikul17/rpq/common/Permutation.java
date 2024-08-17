package org.mikul17.rpq.common;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Permutation {
    private List<Task> permutation;
    private int cmax;

    public static Permutation of (List<Task> permutation) {
        int cmax = 0;
        int time = 0;
        for (Task task : permutation) {
            time = Math.max(task.r(), time) + task.p();
            cmax = Math.max(cmax, time + task.q());
        }
        return new Permutation(permutation, cmax);
    }

    public static Permutation of (List<Task> permutation, int cmax) {
        return new Permutation(permutation, cmax);
    }
}