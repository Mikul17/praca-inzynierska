"use client";
import { AlgorithmParameters, Task } from "@/common/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AlgorithmApiNames, AlgorithmTypeKeys, useAlgorithm } from "./AlgorithmContext";
import toast from "react-hot-toast";


interface ParametersContextType {
    algorithmParameters: AlgorithmParameters | undefined;
    isSendable: boolean;
    setParameters: (
        tasks: Array<Task>,
        algorithm: string,
        timeoutDuration: number,
        parameters: Record<string, any>
      ) => boolean;
    resetParameters: () => void;
    updateParameter: (key: string, value: any) => void;
}

const requiredParameters: Record<AlgorithmTypeKeys, Array<string>> = {
    SimulatedAnnealing: ['initialTemperature', 'coolingRate', 'maxIterations'],
    TabuSearch: ['tabuListSize', 'isTenureDynamic', 'initialTenure', 'maxIterations'],
    SchrageAlgorithm: ['preemptive'],
    CarlierAlgorithm: []
};

const ParameterContext = createContext<ParametersContextType | undefined>(undefined);

export const ParameterContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [algorithmParameters, setAlgorithmParameters] = useState<AlgorithmParameters>(undefined);
    const {currentAlgorithm} = useAlgorithm();
    const [isSendable, setIsSendable] = useState<boolean>(false);

    const resetParameters = useCallback(() => {
        setAlgorithmParameters(undefined);
        setIsSendable(false);
    }, []);


    const setParameters = (tasks: Array<Task>, algorithm: string, timeoutDuration: number, parameters: Record<string, any>) => {
        if(!validateParameters(parameters, algorithm)) {
            console.error('Invalid parameters:', parameters);
            toast.error('Error while setting parameters');
            return false;
        }

        setAlgorithmParameters({
            tasks: tasks,
            algorithm: AlgorithmApiNames[algorithm],
            timeoutDuration: timeoutDuration,
            parameters: parameters
        });
        setIsSendable(true);
        return true;
    };

    const validateParameters = (parameters: Record<string, any>, algorithm: string) => {
        let required = [...requiredParameters[algorithm]];
        if(algorithm === "TabuSearch" && parameters.isTenureDynamic) {
            required = required.filter(key => key !== 'tabuListSize');
        }else if(algorithm === "TabuSearch" && !parameters.isTenureDynamic) {
            required = required.filter(key => key !== 'initialTenure');
        }
        for (const key of required) {
            if (parameters[key] === undefined || parameters[key] === null) { 
                return false;
            }
        }
        return true;
    };

    const updateParameter = (key: string, value: any) => {
        if (algorithmParameters) {
            setAlgorithmParameters({
                ...algorithmParameters,
                parameters: {
                    ...algorithmParameters.parameters,
                    [key]: value
                }
            });
        }
    }

    const value = {
        algorithmParameters,
        isSendable,
        setParameters,
        resetParameters,
        updateParameter
      };

      useEffect(() => {
        if (currentAlgorithm !== undefined && (currentAlgorithm === "CarlierAlgorithm" || currentAlgorithm === "SchrageAlgorithm")) {
            setIsSendable(true);
        }
    }, [currentAlgorithm]);

      return <ParameterContext.Provider value={value}>{children}</ParameterContext.Provider>;
};

export const useParameters = () => {
    const context = useContext(ParameterContext);
    if (!context) {
        throw new Error("useParameters must be used within a ParametersContextProvider");
    }
    return context;
}
