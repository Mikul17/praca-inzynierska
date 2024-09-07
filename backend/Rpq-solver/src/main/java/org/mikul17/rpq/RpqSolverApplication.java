package org.mikul17.rpq;

import org.mikul17.rpq.algorithms.Schrage.Schrage;
import org.mikul17.rpq.algorithms.Schrage.SchrageParameters;
import org.mikul17.rpq.algorithms.Schrage.SchrageSolution;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealing;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearch;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearchParameters;
import org.mikul17.rpq.algorithms.common.Permutation;
import org.mikul17.rpq.algorithms.common.Task;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.util.List;

@SpringBootApplication
public class RpqSolverApplication {

    public static void main (String[] args) throws IOException {
        SpringApplication.run(RpqSolverApplication.class, args);
    }
}
