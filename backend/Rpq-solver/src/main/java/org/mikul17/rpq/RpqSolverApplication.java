package org.mikul17.rpq;

import org.mikul17.rpq.algorithms.Schrage.Schrage;
import org.mikul17.rpq.algorithms.Schrage.SchrageParameters;
import org.mikul17.rpq.algorithms.Schrage.SchrageSolution;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealing;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearch;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearchParameters;
import org.mikul17.rpq.common.Permutation;
import org.mikul17.rpq.common.Task;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.util.List;

@SpringBootApplication
public class RpqSolverApplication {

    public static void main (String[] args) throws IOException {
        //SpringApplication.run(RpqSolverApplication.class, args);
        SimulatedAnnealing sa = new SimulatedAnnealing();
        TabuSearch ts = new TabuSearch();
        Schrage schrage = new Schrage();
        List<Task> tasks = List.of(
                new Task(1, 8354, 1, 5507),
                new Task(2, 8455, 696, 512),
                new Task(3, 2900, 435, 8619),
                new Task(4, 6176, 424, 3688),
                new Task(5, 586, 971, 76),
                new Task(6, 7751, 134, 5877),
                new Task(7, 7935, 516, 3017),
                new Task(8, 5957, 266, 5540),
                new Task(9, 68, 275, 4040),
                new Task(10, 1688, 308, 2907),
                new Task(11, 436, 171, 2963),
                new Task(12, 5683, 412, 6456),
                new Task(13, 3066, 14, 3960),
                new Task(14, 5104, 792, 5696),
                new Task(15, 8200, 258, 1170),
                new Task(16, 8731, 726, 3081),
                new Task(17, 5017, 912, 5131),
                new Task(18, 84, 124, 3846),
                new Task(19, 8355, 473, 1100),
                new Task(20, 1541, 306, 6302),
                new Task(21, 1808, 20, 5363),
                new Task(22, 114, 874, 5494),
                new Task(23, 3815, 472, 759),
                new Task(24, 2734, 482, 7478)
        );
        SimulatedAnnealingParameters p = SimulatedAnnealingParameters
                .builder()
                .initialTemperature(1000.0)
                .coolingRate(0.99995)
                .maxIterations(100_000)
                .tasks(tasks)
                .build();
        TabuSearchParameters tsParams = TabuSearchParameters
                .builder()
                .maxIterations(100_000)
                .tabuListSize(40)
                .tasks(tasks)
                .build();
        SchrageParameters schrageParameters = SchrageParameters
                .builder()
                .tasks(tasks)
                .build();

        //SimulatedAnnealingSolution s = sa.solve(p);
        //TabuSearchSolution s = ts.solve(tsParams);
        SchrageSolution s = schrage.solve(schrageParameters);
        System.out.println("________________________ Results ________________________");
        System.out.println("Initial cmax " + Permutation.of(p.getTasks()).getCmax());
        System.out.println("Cmax: " + s.getBestCmax());
        System.out.println("Time: " + s.getDuration() + " ms");
        System.out.println("Best permutation: ");
        s.getBestPermutation().printPermutation();

        System.out.println("________________________________________________________");
    }
}
