package org.mikul17.rpq.algorithms.TabuSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TabuMove {
    private int firstTask;
    private int secondTask;
    private int moveCmax;
    private int tenure;
}
