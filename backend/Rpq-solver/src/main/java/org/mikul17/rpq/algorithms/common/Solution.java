package org.mikul17.rpq.algorithms.common;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Solution {
    protected int bestCmax;
    protected List<Integer> bestOrder = new ArrayList<>();
}
