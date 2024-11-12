package org.mikul17.rpq.algorithms.Carlier;

import lombok.Getter;
import lombok.Setter;
import org.mikul17.rpq.algorithms.common.BatchedSolution;

@Getter
@Setter
public class CarlierBatchedSolution extends BatchedSolution {
    private int ub;
    private int lb;
    private Carlier.SolutionNode node;
}
