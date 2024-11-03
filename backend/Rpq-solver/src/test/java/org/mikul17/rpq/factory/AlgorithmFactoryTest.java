package org.mikul17.rpq.factory;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.mikul17.rpq.algorithms.Carlier.Carlier;
import org.mikul17.rpq.algorithms.Schrage.Schrage;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealing;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearch;
import org.mikul17.rpq.api.enums.AlgorithmName;
import org.mikul17.rpq.factories.AlgorithmFactory;

class AlgorithmFactoryTest {

    @Test
    void shouldCreateSimulatedAnnealingAlgorithm() {
        var algorithm = AlgorithmFactory.createAlgorithm(AlgorithmName.SIMULATED_ANNEALING);
        assertNotNull(algorithm, "Algorithm should not be null");
        assertEquals(algorithm.getClass(), SimulatedAnnealing.class, "Expected class SimulatedAnnealing");
    }

    @Test
    void shouldCreateTabuSearchAlgorithm() {
        var algorithm = AlgorithmFactory.createAlgorithm(AlgorithmName.TABU_SEARCH);
        assertNotNull(algorithm, "Algorithm should not be null");
        assertEquals(algorithm.getClass(), TabuSearch.class, "Expected class TabuSearch");
    }

    @Test
    void shouldCreateSchrageAlgorithm() {
        var algorithm = AlgorithmFactory.createAlgorithm(AlgorithmName.SCHRAGE);
        assertNotNull(algorithm, "Algorithm should not be null");
        assertEquals(algorithm.getClass(), Schrage.class, "Expected instance of Schrage");
    }

    @Test
    void shouldCreateCarlierAlgorithm() {
        var algorithm = AlgorithmFactory.createAlgorithm(AlgorithmName.CARLIER);
        assertNotNull(algorithm, "Algorithm should not be null");
        assertEquals(algorithm.getClass(), Carlier.class, "Expected instance of Carlier");
    }

    @Test
    void shouldThrowExceptionForUnknownAlgorithm() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            AlgorithmFactory.createAlgorithm(AlgorithmName.valueOf("UNKNOWN"));
        });
        assertTrue(exception.getMessage().contains("No enum constant"), "Expected message to contain 'No enum constant'");
    }
}
