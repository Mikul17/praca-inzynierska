package org.mikul17.rpq.algorithms.TabuSearch;

import lombok.Getter;
import lombok.Setter;
import org.mikul17.rpq.algorithms.common.BatchedSolution;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class TabuSearchBatchedSolution extends BatchedSolution {
   private final List<TabuMove> tabuList = new ArrayList<>();

   public void updateTabuList(List<TabuMove> tabuList) {
       this.tabuList.clear();
       this.tabuList.addAll(tabuList);
   }

}
