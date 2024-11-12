package org.mikul17.rpq.algorithms.TabuSearch;

import lombok.SneakyThrows;
import org.mikul17.rpq.algorithms.common.*;

import java.util.*;
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
    public Permutation solve(TabuSearchParameters parameters, Consumer<TabuSearchBatchedSolution> solutionConsumer) {
        TabuSearchBatchedSolution batchedSolution = new TabuSearchBatchedSolution();
        Solution bestSolution = new Solution();

        List<Task> copy = new ArrayList<>(parameters.getTasks());
        int bestCmax = Integer.MAX_VALUE;
        Permutation bestPermutation = null;

        List<TabuMove> tabuList = new ArrayList<>();
        List<Permutation> solutions = new ArrayList<>();

        for (int i = 0; i < parameters.maxIterations; i++) {
            TabuMove result = findBestTabu(copy, tabuList, parameters, bestCmax, solutions);
            int currentlyBestCmax = result.getMoveCmax();
            Collections.swap(copy, result.getFirstTask(), result.getSecondTask());

            addMoveToTabuList(result, tabuList, parameters);
            solutions.add(Permutation.fromTasks(currentlyBestCmax, copy));

            if (currentlyBestCmax < bestCmax) {
                bestCmax = currentlyBestCmax;
                bestPermutation = Permutation.fromTasks(bestCmax, copy);
            }

            if (parameters.isTenureDynamic) {
                reduceTenure(tabuList);
            } else {
                if (tabuList.size() > parameters.tabuListSize) {
                    tabuList.removeFirst();
                }
            }

                bestSolution.setBestCmax(bestCmax);
                bestSolution.setBestOrder(bestPermutation != null ? bestPermutation.permutation() : null);
                batchedSolution.setBestSolution(bestSolution);
                batchedSolution.updateTabuList(tabuList);
                batchedSolution.setPermutations(solutions);
                solutionConsumer.accept(batchedSolution);
                solutions = new ArrayList<>();
                batchedSolution = new TabuSearchBatchedSolution();
                Thread.sleep(parameters.getTimeoutDuration());

            if (parameters.clearTabuListFlag) {
                tabuList.clear();
                parameters.clearTabuListFlag = false;
            }

            parameters.applyPendingChanges();
        }

        return bestPermutation;
    }


    private void addMoveToTabuList(TabuMove result, List<TabuMove> tabuList, TabuSearchParameters parameters) {
        if (parameters.isTenureDynamic) {
            tabuList.add(result);
        } else {
            result.setTenure(-1);
            tabuList.add(result);
        }
    }

    private TabuMove findBestTabu(List<Task> copy, List<TabuMove> tabuList, TabuSearchParameters parameters, int bestCmax, List<Permutation> solutions) {
        int firstBestTask = -1;
        int secondBestTask = -1;
        int bestCmaxLocal = Integer.MAX_VALUE;
        int initialTenure = parameters.initialTenure;

        int totalIterations = (copy.size() * (copy.size() - 1)) / 2;
        int samplingInterval = Math.max(totalIterations / 99, 1);

        int iterationCount = 0;

        for (int i = 0; i < copy.size(); i++) {
            for (int j = i + 1; j < copy.size(); j++) {
                iterationCount++;

                Collections.swap(copy, i, j);
                int newCmax = calculateCmax(copy);
                boolean isTabuMove = isTabu(i, j, tabuList);

                if (!isTabuMove && newCmax < bestCmaxLocal) {
                    bestCmaxLocal = newCmax;
                    firstBestTask = i;
                    secondBestTask = j;
                } else if (isTabuMove && newCmax < bestCmax) {
                    if (newCmax < bestCmaxLocal) {
                        bestCmaxLocal = newCmax;
                        firstBestTask = i;
                        secondBestTask = j;
                    }
                }

                if (iterationCount % samplingInterval == 0 && solutions.size() < 99) {
                    solutions.add(Permutation.fromTasks(newCmax, copy));
                }

                Collections.swap(copy, i, j);
            }
        }

        return new TabuMove(firstBestTask, secondBestTask, bestCmaxLocal, initialTenure);
    }


    private boolean isTabu(int i, int j, List<TabuMove> tabuList) {
        for (TabuMove move : tabuList) {
            boolean match = (move.getFirstTask() == i && move.getSecondTask() == j) ||
                    (move.getFirstTask() == j && move.getSecondTask() == i);
            if (match) {
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

    private void reduceTenure(List<TabuMove> tabuList) {
        Iterator<TabuMove> iterator = tabuList.iterator();
        while (iterator.hasNext()) {
            TabuMove move = iterator.next();
            move.setTenure(move.getTenure() - 1);
            if (move.getTenure() <= 0) {
                iterator.remove();
            }
        }
    }


}
