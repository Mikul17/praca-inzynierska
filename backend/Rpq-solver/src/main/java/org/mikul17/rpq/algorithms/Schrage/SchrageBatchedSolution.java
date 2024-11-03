package org.mikul17.rpq.algorithms.Schrage;

import lombok.Getter;
import lombok.Setter;
import org.mikul17.rpq.algorithms.common.BatchedSolution;
import org.mikul17.rpq.algorithms.common.Task;

import java.util.Comparator;
import java.util.PriorityQueue;

@Getter
@Setter
public class SchrageBatchedSolution extends BatchedSolution {
    private PriorityQueue<Integer> readyQueue =new PriorityQueue<>(Comparator.reverseOrder());
    private PriorityQueue<Integer> notReadyQueue = new PriorityQueue<>();

    public void setQueueFromModifiableTask (PriorityQueue<Schrage.ModifiableTask> queue) {
        queue.forEach(task -> this.readyQueue.add(task.getId()));
    }

    public void setQueueFromTask (PriorityQueue<Task> queue) {
        queue.forEach(task -> this.notReadyQueue.add(task.id()));
    }

}
