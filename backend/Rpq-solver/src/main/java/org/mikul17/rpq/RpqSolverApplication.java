package org.mikul17.rpq;

import java.io.IOException;
import java.util.List;

import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealing;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingSolution;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearch;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearchParameters;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearchSolution;
import org.mikul17.rpq.common.Permutation;
import org.mikul17.rpq.common.Task;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RpqSolverApplication {

    public static void main (String[] args) throws IOException {
        SpringApplication.run(RpqSolverApplication.class, args);
    }
}
