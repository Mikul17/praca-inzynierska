package org.mikul17.rpq.algorithm;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.algorithms.Schrage.Schrage;
import org.mikul17.rpq.algorithms.Schrage.SchrageParameters;
import org.mikul17.rpq.algorithms.common.Permutation;

import java.util.List;

import static org.mikul17.rpq.algorithm.AlgorithmTestUtils.*;

public class SchrageTest {

    Schrage schrage;

    @BeforeEach
    public void setUp () {
        schrage = new Schrage();
    }

    @Test
    void initTest() {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(testTasks)
                .build();
        Permutation result = schrage.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(11);
        Assertions.assertThat(result.permutation()).isEqualTo(List.of(3,2,1));
    }

    @Test
    void firstTestCaseShouldReturnCorrectResult () {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(firstTestCase)
                .build();
        Permutation result = schrage.solve(p, solution -> {});

//        Assertions.assertThat(result.cmax()).isLessThan(firstTestCaseWorstCmax);
//        Assertions.assertThat(result.cmax()).isLessThanOrEqualTo(firstTestCaseAcceptableCmax);
//        Assertions.assertThat(result.cmax()).isGreaterThanOrEqualTo(firstTestCaseBestCmax);
        Assertions.assertThat(result.cmax()).isEqualTo(13981);
    }

    @Test
    void secondDatasetShouldReturnCorrectResult () {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(secondTestCase)
                .build();
        Permutation result = schrage.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isLessThan(secondTestCaseWorstCmax);
        Assertions.assertThat(result.cmax()).isLessThanOrEqualTo(secondTestCaseAcceptableCmax);
        Assertions.assertThat(result.cmax()).isGreaterThanOrEqualTo(secondTestCaseBestCmax);
        Assertions.assertThat(result.cmax()).isEqualTo(21529);
    }

    @Test
    void thirdDatasetShouldReturnCorrectResult () {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(thirdTestCase)
                .build();
        Permutation result = schrage.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isLessThan(thirdTestCaseWorstCmax);
        Assertions.assertThat(result.cmax()).isLessThanOrEqualTo(thirdTestCaseAcceptableCmax);
        Assertions.assertThat(result.cmax()).isGreaterThanOrEqualTo(thirdTestCaseBestCmax);
        Assertions.assertThat(result.cmax()).isEqualTo(31683);
    }

    @Test
    void fourthDatasetShouldReturnCorrectResult () {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(fourthTestCase)
                .build();
        Permutation result = schrage.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isLessThan(fourthTestCaseWorstCmax);
        Assertions.assertThat(result.cmax()).isLessThanOrEqualTo(fourthTestCaseAcceptableCmax);
        Assertions.assertThat(result.cmax()).isGreaterThanOrEqualTo(fourthTestCaseBestCmax);
        Assertions.assertThat(result.cmax()).isEqualTo(34444);
    }
}
