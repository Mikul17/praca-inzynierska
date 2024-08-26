package org.mikul17.rpq.algorithm;


import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealing;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingSolution;

import static org.mikul17.rpq.algorithm.AlgorithmTestUtils.*;

public class SimulatedAnnealingTest {

    SimulatedAnnealing sa;

    @BeforeEach
    public void setUp () {
        sa = new SimulatedAnnealing();
    }

    @Test
    void firstTestCaseShouldReturnCorrectResult () {
        SimulatedAnnealingParameters p = SimulatedAnnealingParameters
                .builder()
                .initialTemperature(1000.0)
                .coolingRate(0.99995)
                .maxIterations(1_000_000)
                .tasks(firstTestCase)
                .build();
        SimulatedAnnealingSolution result = sa.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(firstTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(firstTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(firstTestCaseBestCmax);
    }

    @Test
    void secondDatasetShouldReturnCorrectResult () {
        SimulatedAnnealingParameters p = SimulatedAnnealingParameters
                .builder()
                .initialTemperature(1000.0)
                .coolingRate(0.99995)
                .maxIterations(1_000_000)
                .tasks(secondTestCase)
                .build();
        SimulatedAnnealingSolution result = sa.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(secondTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(secondTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(secondTestCaseBestCmax);
    }

    @Test
    void thirdDatasetShouldReturnCorrectResult () {
        SimulatedAnnealingParameters p = SimulatedAnnealingParameters
                .builder()
                .initialTemperature(1000.0)
                .coolingRate(0.99995)
                .maxIterations(1_000_000)
                .tasks(thirdTestCase)
                .build();
        SimulatedAnnealingSolution result = sa.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(thirdTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(thirdTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(thirdTestCaseBestCmax);
    }

    @Test
    void fourthDatasetShouldReturnCorrectResult () {
        SimulatedAnnealingParameters p = SimulatedAnnealingParameters
                .builder()
                .initialTemperature(1000.0)
                .coolingRate(0.99995)
                .maxIterations(1_000_000)
                .tasks(fourthTestCase)
                .build();
        SimulatedAnnealingSolution result = sa.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(fourthTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(fourthTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(fourthTestCaseBestCmax);
    }

    @Test
    void temperatureShouldDecrease () {
        SimulatedAnnealingParameters p = SimulatedAnnealingParameters
                .builder()
                .initialTemperature(1000.0)
                .coolingRate(0.99995)
                .maxIterations(100)
                .tasks(firstTestCase)
                .build();
        SimulatedAnnealingSolution result = sa.solve(p);

        Assertions.assertThat(result.getTemperature().getFirst()).isGreaterThan(result.getTemperature().getLast());
    }

    @Test
    void acceptanceProbabilityShouldDecrease () {
        SimulatedAnnealingParameters p = SimulatedAnnealingParameters
                .builder()
                .initialTemperature(1000.0)
                .coolingRate(0.99995)
                .maxIterations(100)
                .tasks(firstTestCase)
                .build();
        SimulatedAnnealingSolution result = sa.solve(p);

        Assertions.assertThat(result.getAcceptanceProbability().getFirst()).isGreaterThan(result.getAcceptanceProbability().getLast());
    }
}
