package org.mikul17.rpq.algorithms.TabuSearch;

import lombok.experimental.SuperBuilder;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.mikul17.rpq.algorithms.common.AlgorithmParameters;

import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Class representing parameters for TabuSearch algorithm
 *
 * @field maxIterations - number of iterations TabuSearch algorithm will perform
 * @field tabuListSize - size of tabu list containing forbidden moves
 * @see AlgorithmParameters
 */
@SuperBuilder
public class TabuSearchParameters extends AlgorithmParameters {
    protected int maxIterations;
    protected volatile int tabuListSize;
    protected volatile boolean clearTabuList = false;
    protected volatile boolean resizeTabuList = false;

    private final ReentrantLock lock = new ReentrantLock();
    private TabuSearchParameters pendingChanges;

    @Override
    public void fromMap (Map<String, Object> map) {
        maxIterations = (int) map.get("maxIterations");
        tabuListSize = (int) map.get("tabuListSize");
    }

    @Override
    public void updateFromMap (Map<String, Object> map) {
        lock.lock();
        try {
            if (pendingChanges == null) {
                pendingChanges = TabuSearchParameters.builder()
                        .maxIterations(maxIterations)
                        .tabuListSize(tabuListSize)
                        .build();
            }
            if (map.containsKey("tabuListSize")) {
                pendingChanges.tabuListSize = (int) map.get("tabuListSize");
            }
        } finally {
            lock.unlock();
        }
    }

    public void applyPendingChanges() {
        lock.lock();
        try {
            if (pendingChanges != null) {
                tabuListSize = pendingChanges.tabuListSize;
                resizeTabuList = true;
            }
            pendingChanges = null;
        } finally {
            lock.unlock();
        }
    }

    public void clearTabuList() {
        lock.lock();
        try {
            clearTabuList = true;
        } finally {
            lock.unlock();
        }
    }
}
