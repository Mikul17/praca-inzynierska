package org.mikul17.rpq.algorithms.TabuSearch;

import lombok.SneakyThrows;
import org.mikul17.rpq.algorithms.common.Algorithm;
import org.mikul17.rpq.algorithms.common.Permutation;
import org.mikul17.rpq.algorithms.common.Solution;
import org.mikul17.rpq.algorithms.common.Task;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;

/**
 * Class that represents Tabu Search algorithm.
 * It finds the best permutation by going through all possible permutations.
 * To avoid local optima, it uses tabu list to store forbidden moves.
 * It repeats the process for a given number of iterations, for each iteration
 * it finds the best move to make and adds it to tabu list. If the move is better
 * than the previous one, it updates the best permutation.
 */
public class TabuSearch implements Algorithm<TabuSearchParameters, TabuSearchBatchedSolution> {

    /**
     * Solves the scheduling problem using the Tabu Search algorithm.
     *
     * @param parameters - contains all necessary parameters for the Tabu Search algorithm
     * @return TabuSearchSolution - object containing the best permutation and Cmax value
     * @see TabuSearchParameters
     * @see TabuSearchBatchedSolution
     */
    @SneakyThrows
    @Override
    public Permutation solve (TabuSearchParameters parameters, Consumer<TabuSearchBatchedSolution> solutionConsumer) {
        TabuSearchBatchedSolution batchedSolution = new TabuSearchBatchedSolution();
        Solution bestSolution = new Solution();

        /* Temporary variables used in algorithm */
        List<Task> copy = new ArrayList<>(parameters.getTasks());
        int bestCmax = Integer.MAX_VALUE;
        Permutation bestPermutation = null;
        List<TabuMove> tabuList = new ArrayList<>(parameters.tabuListSize);
        List<Permutation> solutions = new ArrayList<>();

        /* main algorithm loop */
        for (int i = 0; i < parameters.maxIterations; i++) {
            TabuMove result = findBestTabu(copy, tabuList);
            int currentlyBestCmax = result.moveCmax();
            Collections.swap(copy, result.firstTask(), result.secondTask());
            addMoveToTabuList(result, tabuList, parameters.tabuListSize);

            if (currentlyBestCmax < bestCmax) {
                bestCmax = currentlyBestCmax;
                bestPermutation = Permutation.fromTasks(bestCmax, copy);
            }
            solutions.add(Permutation.fromTasks(currentlyBestCmax, copy));

            if(i % 100 == 99 || i == parameters.maxIterations - 1) {
                bestSolution.setBestCmax(bestCmax);
                bestSolution.setBestOrder(bestPermutation != null ? bestPermutation.permutation() : null);
                batchedSolution.setBestSolution(bestSolution);
                batchedSolution.updateTabuList(tabuList);
                batchedSolution.setPermutations(solutions);
                solutionConsumer.accept(batchedSolution);
                solutions = new ArrayList<>();
                batchedSolution = new TabuSearchBatchedSolution();
                //            Thread.sleep(4000);
            }


            if(parameters.clearTabuListFlag) {
                tabuList.clear();
                parameters.clearTabuListFlag = false;
            }

            parameters.applyPendingChanges();
            if(parameters.resizeTabuList) {
                tabuList = resizeTabuList(tabuList, parameters.tabuListSize);
                parameters.resizeTabuList = false;
            }
        }

        return bestPermutation;
    }

    /**
     * Adds a move to the tabu list. If the tabu list is full, it removes the first element.
     *
     * @param result   - move to be added to the tabu list
     * @param tabuList - list of forbidden moves
     * @param maxSize  - maximum size of the tabu list
     */
    private void addMoveToTabuList (TabuMove result, List<TabuMove> tabuList, int maxSize) {
        if (tabuList.size() >= maxSize) {
            tabuList.removeFirst();
        }
        tabuList.add(result);
    }

    /**
     * Finds the best move to make. It checks all possible permutations of tasks
     * and returns the best one.
     *
     * @param copy     - list of tasks to be checked
     * @param tabuList - list of forbidden moves
     * @return TabuMove - object containing the best move
     * @see TabuMove
     */
    private TabuMove findBestTabu (List<Task> copy, List<TabuMove> tabuList) {
        int firstBestTask = -1;
        int secondBestTask = -1;
        int bestCmax = Integer.MAX_VALUE;

        for (int i = 0; i < copy.size(); i++) {
            for (int j = i + 1; j < copy.size(); j++) {
                Collections.swap(copy, i, j);
                int newCmax = calculateCmax(copy);
                if (newCmax < bestCmax && !isTabu(i, j, tabuList)) {
                    bestCmax = newCmax;
                    firstBestTask = i;
                    secondBestTask = j;
                }
                Collections.swap(copy, i, j);
            }
        }
        return new TabuMove(firstBestTask, secondBestTask, bestCmax);
    }

    /**
     * Checks if a move is forbidden (is present in the tabu list).
     *
     * @param i        - index of the first task
     * @param j        - index of the second task
     * @param tabuList - list of forbidden moves
     * @return boolean - true if the move is forbidden, false otherwise
     */
    private boolean isTabu (int i, int j, List<TabuMove> tabuList) {
        for (TabuMove move : tabuList) {
            if (move.firstTask() == i && move.secondTask() == j) {
                return true;
            }
        }
        return false;
    }

    private List<TabuMove> resizeTabuList(List<TabuMove> tabuList, int maxSize) {
        if (tabuList.size() > maxSize) {
            return tabuList.subList(tabuList.size() - maxSize, tabuList.size());
        }

        if(tabuList.size() < maxSize) {
            return new ArrayList<>(tabuList);
        }

        return tabuList;
    }

}
