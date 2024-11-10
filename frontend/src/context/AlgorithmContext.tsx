"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";

export const AlgorithmType = {
  SimulatedAnnealing: "SimulatedAnnealing",
  TabuSearch: "TabuSearch",
  SchrageAlgorithm: "SchrageAlgorithm",
  CarlierAlgorithm: "CarlierAlgorithm",
} as const;

export type AlgorithmTypeKeys = keyof typeof AlgorithmType;

export const AlgorithmDisplayNames: Record<AlgorithmTypeKeys, string> = {
  SimulatedAnnealing: "Simulated Annealing",
  TabuSearch: "Tabu Search",
  SchrageAlgorithm: "Schrage Algorithm",
  CarlierAlgorithm: "Carlier Algorithm",
};

export const AlgorithmApiNames: Record<AlgorithmTypeKeys, string> = {
  SimulatedAnnealing: "SIMULATED_ANNEALING",
  TabuSearch: "TABU_SEARCH",
  SchrageAlgorithm: "SCHRAGE",
  CarlierAlgorithm: "CARLIER",
};

interface AlgorithmContextType {
  currentAlgorithm: AlgorithmTypeKeys;
  setCurrentAlgorithm: React.Dispatch<React.SetStateAction<AlgorithmTypeKeys>>;
}

const AlgorithmContext = createContext<AlgorithmContextType | undefined>(
  undefined
);

export const useAlgorithm = (): AlgorithmContextType => {
  const context = useContext(AlgorithmContext);
  if (context === undefined) {
    throw new Error("useAlgorithm must be used within an AlgorithmProvider");
  }
  return context;
};

interface AlgorithmProviderProps {
  children: ReactNode;
}

export const AlgorithmProvider: React.FC<AlgorithmProviderProps> = ({
  children,
}) => {
  const [currentAlgorithm, setCurrentAlgorithm] =
    useState<AlgorithmTypeKeys>("SimulatedAnnealing");

  return (
    <AlgorithmContext.Provider
      value={{ currentAlgorithm, setCurrentAlgorithm }}
    >
      {children}
    </AlgorithmContext.Provider>
  );
};
