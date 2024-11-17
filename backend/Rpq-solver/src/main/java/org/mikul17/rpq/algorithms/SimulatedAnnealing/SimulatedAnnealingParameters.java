package org.mikul17.rpq.algorithms.SimulatedAnnealing;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.mikul17.rpq.algorithms.common.AlgorithmParameters;

import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

@SuperBuilder
@AllArgsConstructor
@Getter
@Setter
public class SimulatedAnnealingParameters extends AlgorithmParameters {
    protected int maxIterations;
    protected double initialTemperature;
    protected volatile double coolingRate;
    protected volatile boolean resetTemperatureFlag = false;
    protected volatile boolean stopTemperatureChangeFlag = false;

    private final ReentrantLock lock = new ReentrantLock();
    private SimulatedAnnealingParameters pendingChanges;

    private Double getDoubleValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        System.out.println("Value: " + value);
        if (value instanceof Integer) {
            return ((Integer) value).doubleValue();
        } else if (value instanceof Double) {
            return (Double) value;
        } else {
            throw new IllegalArgumentException("Invalid type for " + key + ": " + value);
        }
    }

    @Override
    public void fromMap (Map<String, Object> map) {
        maxIterations = (int) map.get("maxIterations");
        initialTemperature =  getDoubleValue(map, "initialTemperature");
        coolingRate = getDoubleValue(map, "coolingRate");
    }

    @Override
    public void updateFromMap (Map<String, Object> map) {
        lock.lock();
        try {
            if (pendingChanges == null) {
                pendingChanges = SimulatedAnnealingParameters.builder()
                        .maxIterations(maxIterations)
                        .initialTemperature(initialTemperature)
                        .coolingRate(coolingRate)
                        .build();
            }
            if (map.containsKey("coolingRate")) {
                pendingChanges.coolingRate = (double) map.get("coolingRate");
            }
        } finally {
            lock.unlock();
        }
    }

    public void resetTemperature() {
        lock.lock();
        try {
            resetTemperatureFlag = true;
        } finally {
            lock.unlock();
        }
    }

    public void stopTemperatureChange() {
        lock.lock();
        try {
            stopTemperatureChangeFlag = true;
        } finally {
            lock.unlock();
        }
    }

    public void resumeTemperatureChange() {
        lock.lock();
        try {
            stopTemperatureChangeFlag = false;
        } finally {
            lock.unlock();
        }
    }

    public void applyPendingChanges() {
        lock.lock();
        try {
            if (pendingChanges != null) {
                if (pendingChanges.getCoolingRate() != 0) {
                    this.coolingRate = pendingChanges.getCoolingRate();
                }
                pendingChanges = null;
            }
        } finally {
            lock.unlock();
        }
    }
}
