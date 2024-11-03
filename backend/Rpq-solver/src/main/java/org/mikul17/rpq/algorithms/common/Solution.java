package org.mikul17.rpq.algorithms.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Solution {
    protected int bestCmax;
    protected List<Integer> bestOrder = new ArrayList<>();
}
