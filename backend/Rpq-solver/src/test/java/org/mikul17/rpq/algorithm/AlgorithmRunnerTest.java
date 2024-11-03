package org.mikul17.rpq.algorithm;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikul17.rpq.algorithms.SimulatedAnnealing.SimulatedAnnealingParameters;
import org.mikul17.rpq.algorithms.TabuSearch.TabuSearchParameters;
import org.mikul17.rpq.algorithms.common.Algorithm;
import org.mikul17.rpq.algorithms.common.AlgorithmRunner;
import org.mikul17.rpq.algorithms.common.BatchedSolution;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Map;
import java.util.function.Consumer;

import static org.mockito.Mockito.*;

class AlgorithmRunnerTest {

    @Mock
    private Algorithm<SimulatedAnnealingParameters, BatchedSolution> algorithm;
    @Mock
    private SimulatedAnnealingParameters parameters;
    @Mock
    private Consumer<BatchedSolution> solutionConsumer;

    private AlgorithmRunner<SimulatedAnnealingParameters, BatchedSolution> algorithmRunner;

    @BeforeEach
    void setUp () {
        MockitoAnnotations.openMocks(this);
        algorithmRunner = new AlgorithmRunner<>(algorithm, parameters, solutionConsumer);
    }

    @Test
    void shouldRunAlgorithmSuccessfully () {
        algorithmRunner.run();

        verify(algorithm, times(1)).solve(eq(parameters), any());
    }

    @Test
    void shouldUpdateParametersSuccessfully () {
        Map<String, Object> newParameters = Map.of("maxIterations", 500);

        algorithmRunner.updateParameters(newParameters);

        verify(parameters, times(1)).updateFromMap(newParameters);
    }

    @Test
    void shouldResetTemperatureForSimulatedAnnealing () {
        algorithmRunner.resetTemperature();

        verify(parameters, times(1)).resetTemperature();
    }

    @Test
    void shouldNotResetTemperatureForNonSimulatedAnnealingParameters () {
        Algorithm otherAlgorithm = mock(Algorithm.class);
        TabuSearchParameters otherParameters = mock(TabuSearchParameters.class);

        AlgorithmRunner nonSAAlgorithmRunner =
                new AlgorithmRunner<>(otherAlgorithm, otherParameters, solutionConsumer);

        nonSAAlgorithmRunner.resetTemperature();

        verify(parameters, never()).resetTemperature();
    }

    @Test
    void shouldStopTemperatureChangeForSimulatedAnnealing () {
        algorithmRunner.stopTemperatureChange();

        verify(parameters, times(1)).stopTemperatureChange();
    }

    @Test
    void shouldNotStopTemperatureChangeForNonSimulatedAnnealingParameters () {
        Algorithm otherAlgorithm = mock(Algorithm.class);
        TabuSearchParameters otherParameters = mock(TabuSearchParameters.class);

        AlgorithmRunner nonSAAlgorithmRunner =
                new AlgorithmRunner<>(otherAlgorithm, otherParameters, solutionConsumer);

        nonSAAlgorithmRunner.stopTemperatureChange();

        verify(parameters, never()).stopTemperatureChange();
    }

    @Test
    void shouldResumeTemperatureChangeForSimulatedAnnealing () {
        algorithmRunner.resumeTemperatureChange();

        verify(parameters, times(1)).resumeTemperatureChange();
    }

    @Test
    void shouldNotResumeTemperatureChangeForNonSimulatedAnnealingParameters () {
        Algorithm otherAlgorithm = mock(Algorithm.class);
        TabuSearchParameters otherParameters = mock(TabuSearchParameters.class);

        AlgorithmRunner nonSAAlgorithmRunner =
                new AlgorithmRunner<>(otherAlgorithm, otherParameters, solutionConsumer);

        nonSAAlgorithmRunner.resumeTemperatureChange();

        // Weryfikacja, że resumeTemperatureChange nie została wywołana
        verify(parameters, never()).resumeTemperatureChange();
    }
}

