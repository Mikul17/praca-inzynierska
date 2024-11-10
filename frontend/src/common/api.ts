import { AlgorithmApiNames, AlgorithmTypeKeys } from "@/context/AlgorithmContext"
import { Task } from "./types"

// Api configuration
export const API_URL = 'http://localhost:8080'
export const START_ALGORITHM_URL = '/start_scheduling'

const algorithmParameters: Record<AlgorithmTypeKeys, any> = {
    SimulatedAnnealing: {
        initialTemperature: 1000.2,
        coolingRate: 0.975,
        maxIterations: 50,
    },
    TabuSearch: {
        tabuListSize: 2,
        maxIterations: 200,
    },
    SchrageAlgorithm: {
        preemption: false,
    },
    CarlierAlgorithm: {
    }
}



export const startScheduler = async (algorithm: AlgorithmTypeKeys, tasks: Task[]) => {
    const parameters = algorithmParameters[algorithm];
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            algorithm: AlgorithmApiNames[algorithm],
            tasks: tasks,
            parameters: parameters
        })
    };
    console.log('Payload:', payload);
    try {
        const response = await fetch(API_URL + START_ALGORITHM_URL, payload);
        console.log
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData);
        }
        return response.text();
    } catch (error) {
        console.error('Error starting algorithm:', error);
    }
};

