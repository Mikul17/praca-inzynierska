package org.mikul17.rpq.algorithms.TabuSearch;

import lombok.Getter;
import org.mikul17.rpq.algorithms.common.BatchedSolution;

import java.util.ArrayList;
import java.util.List;

@Getter
public class TabuSearchBatchedSolution extends BatchedSolution {
   private final List<TabuMove> tabuList = new ArrayList<>();

    public void addTabuMove(TabuMove tabuMove) {
        tabuList.add(tabuMove);
    }
}
