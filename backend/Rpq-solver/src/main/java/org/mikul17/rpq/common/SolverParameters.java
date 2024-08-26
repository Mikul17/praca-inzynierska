package org.mikul17.rpq.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

/**
 * Base class for all solver parameters to be used in the application
 *
 * @field tasks - list of tasks to be scheduled
 */
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public abstract class SolverParameters {
    protected List<Task> tasks;
}
