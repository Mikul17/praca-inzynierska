package org.mikul17.rpq.algorithm;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearch;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearchParameters;
import org.mikul17.rpq.algorithms.common.Permutation;


import java.util.List;

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
                .maxIterations(5)
                .tabuListSize(2)
                .isTenureDynamic(false)
                .timeoutDuration(0)
                .tasks(testTasks)
                .build();
        Permutation result = ts.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(11);
        Assertions.assertThat(result.permutation()).isEqualTo(List.of(3,2,1));
    }

    @Test
    void firstTestCaseShouldReturnCorrectResultDynamicTenure () {
        TabuSearchParameters p = TabuSearchParameters
                .builder()
                .maxIterations(5)
                .isTenureDynamic(true)
                .timeoutDuration(0)
                .initialTenure(3)
                .tasks(testTasks)
                .build();
        Permutation result = ts.solve(p, solution -> {});

        Assertions.assertThat(result.cmax()).isEqualTo(11);
        Assertions.assertThat(result.permutation()).isEqualTo(List.of(3,2,1));
    }

}
