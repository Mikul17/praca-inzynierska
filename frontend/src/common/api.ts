import { AlgorithmParameters, Task } from "./types"
import toast from "react-hot-toast"

// Api configuration
export const API_URL = 'http://localhost:8080'
export const START_ALGORITHM_URL = '/start_scheduling'


export const startScheduler = async (algorithmParameters: AlgorithmParameters) => {
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(algorithmParameters)
    };
    console.log('payload:', payload);
    try {
        const response = await fetch(API_URL + START_ALGORITHM_URL, payload);
        console.log
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData);
        }
        return response.text();
    } catch (error) {
        toast.error('Error starting algorithm');
        console.error('Error starting algorithm:', error);
    }
};

