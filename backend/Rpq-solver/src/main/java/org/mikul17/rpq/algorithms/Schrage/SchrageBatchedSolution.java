package org.mikul17.rpq.algorithms.Schrage;

import lombok.Getter;
import lombok.Setter;
import org.mikul17.rpq.algorithms.common.BatchedSolution;

import java.util.PriorityQueue;

@Getter
@Setter
public class SchrageBatchedSolution extends BatchedSolution {
    private PriorityQueue<Integer> readyQueue = new PriorityQueue<>();
    private PriorityQueue<Integer> notReadyQueue = new PriorityQueue<>();
}
