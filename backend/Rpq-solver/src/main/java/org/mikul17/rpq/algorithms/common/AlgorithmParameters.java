package org.mikul17.rpq.algorithms.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.Map;

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
public abstract class AlgorithmParameters {
    protected List<Task> tasks;

    public abstract void fromMap(Map<String, Object> map);
    public abstract void updateFromMap(Map<String, Object> map);
}
