package org.mikul17.rpq.algorithms.Schrage;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.mikul17.rpq.algorithms.common.AlgorithmParameters;

import java.util.Map;

@SuperBuilder
@Getter
public class SchrageParameters extends AlgorithmParameters {
    private boolean preemptive;

    @Override
    public void fromMap (Map<String, Object> map) {
       preemptive = (boolean) map.get("preemptive");
    }

    @Override
    public void updateFromMap (Map<String, Object> map) {
        throw new UnsupportedOperationException("Function not usable for SchrageParameters");
    }
}
