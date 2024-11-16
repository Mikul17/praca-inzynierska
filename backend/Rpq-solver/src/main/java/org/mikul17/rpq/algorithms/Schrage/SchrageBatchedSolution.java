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

    public void setQueueFromModifiableTask (PriorityQueue<Schrage.ModifiableTask> queue, boolean ready) {
        if(ready) {
            queue.forEach(task -> this.readyQueue.add(task.getId()));
        } else {
            queue.forEach(task -> this.notReadyQueue.add(task.getId()));
        }
    }

    public void setQueueFromTask (PriorityQueue<Task> queue, boolean ready) {
        if (ready) {
            queue.forEach(task -> this.readyQueue.add(task.id()));
        } else {
            queue.forEach(task -> this.notReadyQueue.add(task.id()));
        }
    }
}
