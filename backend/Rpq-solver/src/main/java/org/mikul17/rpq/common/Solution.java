package org.mikul17.rpq.common;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class Solution {
    protected int bestCmax;
    protected Permutation bestPermutation;
    protected List<Permutation> allPermutations;
    protected Long duration;

    public void setDuration (Long duration) {
        this.duration = duration/ 1_000_000;
    }

    public Solution () {
        allPermutations = new ArrayList<>();
    }

    public void addPermutation (List<Task> permutation) {
        allPermutations.add(Permutation.of(permutation));
    }
}
