package org.mikul17.rpq.algorithm;


import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealing;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.mikul17.rpq.algorithms.common.Permutation;

import java.util.List;

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
                .initialTemperature(100.0)
                .coolingRate(0.99995)
                .maxIterations(5)
                .tasks(testTasks)
                .build();
        Permutation result = sa.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(11);
        Assertions.assertThat(result.permutation()).isEqualTo(List.of(3,2,1));
    }
}
