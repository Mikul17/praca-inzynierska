package org.mikul17.rpq.algorithms.TabuSearch;

import lombok.experimental.SuperBuilder;
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
    protected int initialTenure;
    protected boolean isTenureDynamic;
    protected volatile boolean clearTabuListFlag = false;
    protected volatile boolean resizeTabuList = false;

    private final ReentrantLock lock = new ReentrantLock();
    private TabuSearchParameters pendingChanges;

    @Override
    public void fromMap (Map<String, Object> map) {
        maxIterations = (int) map.get("maxIterations");
        isTenureDynamic = (boolean) map.get("isTenureDynamic");
        if(isTenureDynamic) {
            initialTenure = (int) map.get("initialTenure");
            if(initialTenure <= 1){
                throw new IllegalArgumentException("Initial tenure must be greater than 1");
            }
        }else{
            tabuListSize = (int) map.get("tabuListSize");
        }
        if(tabuListSize >= tasks.size() - 1) {
            tabuListSize = tasks.size();
            throw new IllegalArgumentException("Tabu list size cannot be greater than number of tasks - 1");
        }
    }

    @Override
    public void updateFromMap (Map<String, Object> map) {
        lock.lock();
        try {
            if (pendingChanges == null) {
                pendingChanges = TabuSearchParameters.builder()
                        .maxIterations(maxIterations)
                        .build();
                if(isTenureDynamic){
                    pendingChanges.isTenureDynamic = true;
                    pendingChanges.initialTenure = initialTenure;
                }else{
                    pendingChanges.tabuListSize = tabuListSize;
                }
            }
            if (map.containsKey("tabuListSize")) {
                pendingChanges.tabuListSize = (int) map.get("tabuListSize");
            }
            if (map.containsKey("initialTenure")) {
                pendingChanges.initialTenure = (int) map.get("initialTenure");
            }
        } finally {
            lock.unlock();
        }
    }

    public void applyPendingChanges() {
        lock.lock();
        try {
            if (pendingChanges != null) {
                if(pendingChanges.isTenureDynamic){
                    initialTenure = pendingChanges.initialTenure;
                }else{
                    tabuListSize = pendingChanges.tabuListSize;
                    resizeTabuList = true;
                }
            }
            pendingChanges = null;
        } finally {
            lock.unlock();
        }
    }

    public void clearTabuList() {
        lock.lock();
        try {
            clearTabuListFlag = true;
        } finally {
            lock.unlock();
        }
    }
}
