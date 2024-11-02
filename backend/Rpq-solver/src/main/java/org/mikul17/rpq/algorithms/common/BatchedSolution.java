package org.mikul17.rpq.algorithms.common;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BatchedSolution{
    private List<Permutation> permutations = new ArrayList<>();
    private Solution bestSolution;

    public void addPermutation (List<Task> candidate, int cmax) {
        permutations.add(Permutation.fromTasks(cmax,candidate));
    }
}
