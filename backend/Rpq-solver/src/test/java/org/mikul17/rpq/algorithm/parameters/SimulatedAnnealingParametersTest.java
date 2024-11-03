package org.mikul17.rpq.algorithm.parameters;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class SimulatedAnnealingParametersTest {

    private SimulatedAnnealingParameters parameters;

    @BeforeEach
    void setUp() {
        parameters = SimulatedAnnealingParameters.builder()
                .maxIterations(1000)
                .initialTemperature(100.0)
                .coolingRate(0.95)
                .build();
    }

    @Test
    void shouldInitializeFromMap() {
        Map<String, Object> map = Map.of(
                "maxIterations", 2000,
                "initialTemperature", 200.0,
                "coolingRate", 0.85
        );

        parameters.fromMap(map);

        assertEquals(2000, parameters.getMaxIterations());
        assertEquals(200.0, parameters.getInitialTemperature());
        assertEquals(0.85, parameters.getCoolingRate());
    }

    @Test
    void shouldUpdateFromMapWithPendingChanges() {
        Map<String, Object> map = Map.of("coolingRate", 0.75);

        parameters.updateFromMap(map);

        assertNotNull(parameters.getPendingChanges(), "Pending changes should not be null after update");
        assertEquals(0.75, parameters.getPendingChanges().getCoolingRate(), "Cooling rate in pending changes should be updated");
    }

    @Test
    void shouldApplyPendingChanges() {
        Map<String, Object> map = Map.of("coolingRate", 0.85);
        parameters.updateFromMap(map);

        parameters.applyPendingChanges();

        assertEquals(0.85, parameters.getCoolingRate(), "Cooling rate should be updated after applying pending changes");
        assertNull(parameters.getPendingChanges(), "Pending changes should be cleared after applying them");
    }

    @Test
    void shouldResetTemperatureFlag() {
        parameters.resetTemperature();
        assertTrue(parameters.isResetTemperatureFlag(), "Reset temperature flag should be true after resetTemperature is called");
    }

    @Test
    void shouldStopTemperatureChange() {
        parameters.stopTemperatureChange();
        assertTrue(parameters.isStopTemperatureChangeFlag(), "Stop temperature change flag should be true after stopTemperatureChange is called");
    }

    @Test
    void shouldResumeTemperatureChange() {
        parameters.stopTemperatureChange();
        assertTrue(parameters.isStopTemperatureChangeFlag(), "Stop temperature change flag should be true after stopTemperatureChange is called");
        parameters.resumeTemperatureChange();
        assertFalse(parameters.isStopTemperatureChangeFlag(), "Stop temperature change flag should be false after resumeTemperatureChange is called");
    }

    @Test
    void shouldHandleConcurrentUpdatesAndApplyChanges() {
        Map<String, Object> map1 = Map.of("coolingRate", 0.80);
        Map<String, Object> map2 = Map.of("coolingRate", 0.90);

        Thread thread1 = new Thread(() -> parameters.updateFromMap(map1));
        Thread thread2 = new Thread(() -> parameters.updateFromMap(map2));

        thread1.start();
        thread2.start();

        try {
            thread1.join();
            thread2.join();
        } catch (InterruptedException e) {
            fail("Threads interrupted");
        }

        parameters.applyPendingChanges();

        assertTrue(parameters.getCoolingRate() == 0.80 || parameters.getCoolingRate() == 0.90,
                "Cooling rate should be one of the updated values due to concurrency");
        assertNull(parameters.getPendingChanges(), "Pending changes should be null after applying");
    }
}

