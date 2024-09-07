package org.mikul17.rpq.algorithms.common;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public abstract class Solution {
    protected int bestCmax;
    protected Permutation bestPermutation;
    protected List<Permutation> allPermutations;
    protected Long duration;

    public Solution () {
        allPermutations = new ArrayList<>();
    }

    public void setDuration (Long duration) {
        this.duration = duration / 1_000_000;
    }

    public void addPermutation (List<Task> permutation) {
        allPermutations.add(Permutation.of(permutation));
    }
}
