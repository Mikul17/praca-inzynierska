package org.mikul17.rpq.common;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public abstract class SolverParameters {
    protected List<Task> tasks;
}
