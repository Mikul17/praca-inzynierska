package org.mikul17.rpq.common;

import java.util.List;

import lombok.*;
import lombok.experimental.SuperBuilder;

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
