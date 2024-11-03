package org.mikul17.rpq.algorithm;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.algorithms.Schrage.Schrage;
import org.mikul17.rpq.algorithms.Schrage.SchrageParameters;
import org.mikul17.rpq.algorithms.common.Permutation;


import static org.mikul17.rpq.algorithm.AlgorithmTestUtils.*;

public class SchrageTest {

    Schrage schrage;

    @BeforeEach
    public void setUp () {
        schrage = new Schrage();
    }

    @Test
    void firstDatasetShouldReturnCorrectResult () {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(schrageTest1)
                .preemptive(false)
                .build();
        Permutation result = schrage.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(schrageTest1Cmax);
    }

    @Test
    void secondDatasetShouldReturnCorrectResult() {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(schrageTest2)
                .preemptive(false)
                .build();
        Permutation result = schrage.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(schrageTest2Cmax);
    }

    @Test
    void thirdDatasetShouldReturnCorrectResult() {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(schrageTest3)
                .preemptive(false)
                .build();
        Permutation result = schrage.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(schrageTest3Cmax);
    }

    @Test
    void firstPreemptiveDatasetShouldReturnCorrectResult () {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(schrageTest1)
                .preemptive(true)
                .build();
        Permutation result = schrage.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(schragePreemptive1Cmax);
    }

    @Test
    void secondPreemptiveDatasetShouldReturnCorrectResult() {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(schrageTest2)
                .preemptive(true)
                .build();
        Permutation result = schrage.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(schragePreemptive2Cmax);
    }

    @Test
    void thirdPreemptiveDatasetShouldReturnCorrectResult() {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(schrageTest3)
                .preemptive(true)
                .build();
        Permutation result = schrage.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(schragePreemptive3Cmax);
    }
}
