package org.mikul17.rpq.algorithms.Carlier;

import lombok.experimental.SuperBuilder;
import org.mikul17.rpq.algorithms.common.AlgorithmParameters;

import java.util.Map;

@SuperBuilder
public class CarlierParameters extends AlgorithmParameters {
    @Override
    public void fromMap (Map<String, Object> map) {
        throw new UnsupportedOperationException("Function not usable for CarlierParameters");
    }

    @Override
    public void updateFromMap (Map<String, Object> map) {
        throw new UnsupportedOperationException("Function not usable for CarlierParameters");
    }
}
