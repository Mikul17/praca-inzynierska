package org.mikul17.rpq.algorithms.TabuSearch;

import lombok.Builder;
import org.mikul17.rpq.common.Permutation;
import org.mikul17.rpq.common.Solver;
import org.mikul17.rpq.common.Task;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Class that represents Tabu Search algorithm.
 * It finds the best permutation by going through all possible permutations.
 * To avoid local optima, it uses tabu list to store forbidden moves.
 * It repeats the process for a given number of iterations, for each iteration
 * it finds the best move to make and adds it to tabu list. If the move is better
 * than the previous one, it updates the best permutation.
 */
public class TabuSearch implements Solver<TabuSearchParameters, TabuSearchSolution> {


    /**
     * Class that represents a move in the Tabu Search algorithm which
     * will be stored in the tabu list.
     *
     * @field firstTask - index of the first task to swap
     * @field secondTask - index of the second task to swap
     * @field moveCmax - Cmax value after swapping tasks
     */
    @Builder
    private static class TabuMove {
        public int firstTask;
        public int secondTask;
        public int moveCmax;
    }

    /**
     * Solves the scheduling problem using the Tabu Search algorithm.
     *
     * @param parameters - contains all necessary parameters for the Tabu Search algorithm
     * @see TabuSearchParameters
     *
     * @return TabuSearchSolution - object containing the best permutation and Cmax value
     * @see TabuSearchSolution
     */
    @Override
    public TabuSearchSolution solve (TabuSearchParameters parameters) {
        TabuSearchSolution solution = new TabuSearchSolution();
        long startTime = System.nanoTime();

        /* Temporary variables used in algorithm */
        List<Task> copy = new ArrayList<>(parameters.getTasks());
        int bestCmax = Integer.MAX_VALUE;
        Permutation bestPermutation = Permutation.of(parameters.getTasks());
        List<TabuMove> tabuList = new ArrayList<>(parameters.tabuListSize);

        /* main algorithm loop */
        for(int i = 0; i < parameters.maxIterations; i++) {
            TabuMove result = findBestTabu(copy, tabuList);
            int currentlyBestCmax = result.moveCmax;

            Collections.swap(copy, result.firstTask, result.secondTask);
            addMoveToTabuList(result, tabuList, parameters.tabuListSize);

            if(currentlyBestCmax < bestCmax) {
                bestCmax = currentlyBestCmax;
                bestPermutation =Permutation.of(copy);
            }
        }

        /* assigning solution parameters */
        long endTime = System.nanoTime();
        long duration = endTime - startTime;
        solution.setBestCmax(bestCmax);
        solution.setBestPermutation(bestPermutation);
        solution.setDuration(duration);

        return solution;
    }


    /**
     * Adds a move to the tabu list. If the tabu list is full, it removes the first element.
     *
     * @param result - move to be added to the tabu list
     * @param tabuList - list of forbidden moves
     * @param maxSize - maximum size of the tabu list
     */
    private void addMoveToTabuList (TabuMove result, List<TabuMove> tabuList, int maxSize) {
        if(tabuList.size() >= maxSize) {
            tabuList.removeFirst();
        }
        tabuList.add(result);
    }

    /**
     * Finds the best move to make. It checks all possible permutations of tasks
     * and returns the best one.
     *
     * @param copy - list of tasks to be checked
     * @param tabuList - list of forbidden moves
     *
     * @return TabuMove - object containing the best move
     * @see TabuMove
     */
    private TabuMove findBestTabu (List<Task> copy, List<TabuMove> tabuList) {
        int firstBestTask = -1;
        int secondBestTask = -1;
        int bestCmax = Integer.MAX_VALUE;

        for(int i=0; i<copy.size(); i++) {
            for(int j=i+1; j<copy.size(); j++) {
                Collections.swap(copy, i, j);
                int newCmax = calculateCmax(copy);
                if(newCmax < bestCmax && !isTabu(i, j, tabuList)) {
                    bestCmax = newCmax;
                    firstBestTask = i;
                    secondBestTask = j;
                }
                Collections.swap(copy, i, j);
            }
        }
        return TabuMove.builder()
                .firstTask(firstBestTask)
                .secondTask(secondBestTask)
                .moveCmax(bestCmax)
                .build();
    }


    /**
     * Checks if a move is forbidden (is present in the tabu list).
     *
     * @param i - index of the first task
     * @param j - index of the second task
     * @param tabuList - list of forbidden moves
     * @return boolean - true if the move is forbidden, false otherwise
     */
    private boolean isTabu (int i, int j, List<TabuMove> tabuList) {
        for(TabuMove move : tabuList) {
            if(move.firstTask == i && move.secondTask == j) {
                return true;
            }
        }
        return false;
    }
}
