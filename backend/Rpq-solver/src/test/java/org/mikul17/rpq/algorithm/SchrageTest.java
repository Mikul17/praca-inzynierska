package org.mikul17.rpq.algorithm;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.algorithms.Schrage.Schrage;
import org.mikul17.rpq.algorithms.Schrage.SchrageParameters;
import org.mikul17.rpq.algorithms.Schrage.SchrageSolution;

import static org.mikul17.rpq.algorithm.AlgorithmTestUtils.*;

public class SchrageTest {

    Schrage schrage;

    @BeforeEach
    public void setUp () {
        schrage = new Schrage();
    }

    @Test
    void firstTestCaseShouldReturnCorrectResult () {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(firstTestCase)
                .build();
        SchrageSolution result = schrage.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(firstTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(firstTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(firstTestCaseBestCmax);
    }

    @Test
    void secondDatasetShouldReturnCorrectResult () {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(secondTestCase)
                .build();
        SchrageSolution result = schrage.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(secondTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(secondTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(secondTestCaseBestCmax);
    }

    @Test
    void thirdDatasetShouldReturnCorrectResult () {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(thirdTestCase)
                .build();
        SchrageSolution result = schrage.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(thirdTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(thirdTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(thirdTestCaseBestCmax);
    }

    @Test
    void fourthDatasetShouldReturnCorrectResult () {
        SchrageParameters p = SchrageParameters
                .builder()
                .tasks(fourthTestCase)
                .build();
        SchrageSolution result = schrage.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(fourthTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(fourthTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(fourthTestCaseBestCmax);
    }
}
