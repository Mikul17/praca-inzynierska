package org.mikul17.rpq.common;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public abstract class Solution {
    protected int bestCmax;
    protected Permutation bestPermutation;
    protected List<Permutation> allPermutations;
    protected Long time;

    public Solution(){
        allPermutations = new ArrayList<>();
    }

    public void addPermutation(List<Task> permutation){
       allPermutations.add(Permutation.of(permutation));
    }

    public void addPermutation(Permutation permutation){
       allPermutations.add(permutation);
    }
}
