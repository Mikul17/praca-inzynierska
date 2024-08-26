package org.mikul17.rpq.algorithm;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearch;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearchParameters;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearchSolution;

import static org.mikul17.rpq.algorithm.AlgorithmTestUtils.*;

public class TabuSearchTest {

    TabuSearch ts;

    @BeforeEach
    public void setUp () {
        ts = new TabuSearch();
    }

    @Test
    void firstTestCaseShouldReturnCorrectResult () {
        TabuSearchParameters p = TabuSearchParameters
                .builder()
                .maxIterations(100_000)
                .tabuListSize(40)
                .tasks(firstTestCase)
                .build();
        TabuSearchSolution result = ts.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(firstTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(firstTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(firstTestCaseBestCmax);
    }

    @Test
    void secondDatasetShouldReturnCorrectResult () {
        TabuSearchParameters p = TabuSearchParameters
                .builder()
                .maxIterations(100_000)
                .tabuListSize(40)
                .tasks(secondTestCase)
                .build();
        TabuSearchSolution result = ts.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(secondTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(secondTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(secondTestCaseBestCmax);
    }

    @Test
    void thirdDatasetShouldReturnCorrectResult () {
        TabuSearchParameters p = TabuSearchParameters
                .builder()
                .maxIterations(100_000)
                .tabuListSize(40)
                .tasks(thirdTestCase)
                .build();
        TabuSearchSolution result = ts.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(thirdTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(thirdTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(thirdTestCaseBestCmax);
    }

    @Test
    void fourthDatasetShouldReturnCorrectResult () {
        TabuSearchParameters p = TabuSearchParameters
                .builder()
                .maxIterations(100_000)
                .tabuListSize(40)
                .tasks(fourthTestCase)
                .build();
        TabuSearchSolution result = ts.solve(p);

        Assertions.assertThat(result.getBestCmax()).isLessThan(fourthTestCaseWorstCmax);
        Assertions.assertThat(result.getBestCmax()).isLessThanOrEqualTo(fourthTestCaseAcceptableCmax);
        Assertions.assertThat(result.getBestCmax()).isGreaterThanOrEqualTo(fourthTestCaseBestCmax);
    }
}
