package org.mikul17.rpq.algorithms.Carlier;

import lombok.Getter;
import lombok.Setter;
import org.mikul17.rpq.algorithms.common.BatchedSolution;
import org.mikul17.rpq.algorithms.common.Permutation;

@Getter
@Setter
public class CarlierBatchedSolution extends BatchedSolution {
    private final int ub;
    private final Carlier.SolutionNode node;

    public CarlierBatchedSolution(Permutation permutation,int ub, Carlier.SolutionNode node) {
        super();
        this.ub = ub;
        this.node = node;

    }
}
