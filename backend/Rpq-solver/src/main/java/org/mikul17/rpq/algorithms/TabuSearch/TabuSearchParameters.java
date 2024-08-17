package org.mikul17.rpq.algorithms.TabuSearch;

import lombok.experimental.SuperBuilder;
import org.mikul17.rpq.common.SolverParameters;

/**
 * Class representing parameters for TabuSearch algorithm
 *
 * @field maxIterations - number of iterations TabuSearch algorithm will perform
 * @field tabuListSize - size of tabu list containing forbidden moves
 *
 * @see SolverParameters
 */
@SuperBuilder
public class TabuSearchParameters extends SolverParameters {
    protected int maxIterations;
    protected int tabuListSize;

}
