package org.mikul17.rpq.common;

import java.util.List;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public abstract class SolverParameters {
    protected List<Task> tasks;
}
