package org.mikul17.rpq.algorithm;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.algorithms.Carlier.Carlier;
import org.mikul17.rpq.algorithms.Carlier.CarlierParameters;
import org.mikul17.rpq.algorithms.common.Permutation;

import static org.mikul17.rpq.algorithm.AlgorithmTestUtils.*;

public class CarlierTest {

    Carlier carlier;

    @BeforeEach
    public void setUp () {
        carlier = new Carlier();
    }

    @Test
    void firstDatasetShouldReturnCorrectResult () {
        CarlierParameters p = CarlierParameters
                .builder()
                .tasks(schrageTest1)
                .timeoutDuration(0)
                .build();
        Permutation result = carlier.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(1484);
    }

    @Test
    void secondDatasetShouldReturnCorrectResult() {
        CarlierParameters p = CarlierParameters
                .builder()
                .tasks(schrageTest2)
                .timeoutDuration(0)
                .build();
        Permutation result = carlier.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(3070);
    }

    @Test
    void thirdDatasetShouldReturnCorrectResult() {
        CarlierParameters p = CarlierParameters
                .builder()
                .tasks(schrageTest3)
                .timeoutDuration(0)
                .build();
        Permutation result = carlier.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(6398);
    }
}
