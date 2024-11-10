"use client";
import { Solution, TabuMove, Task } from "@/common/types";
import toast from "react-hot-toast";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

interface TaskContextType {
  tasks: Array<Task>;
  solutions: Array<Solution>;
  temperatures: Array<number>;
  probabilities: Array<number>;
  recentlyChangedTasks: Set<number>;
  currentSolution: Solution | null;
  bestSolution: Solution | null;
  isDataFetchingCompleted: boolean;
  setIsDataFetchingCompleted: (isCompleted: boolean) => void;
  createSolution: (order: Array<number>) => void;
  calculateCmax: (order: Array<number>) => number;
  updateSolution: (solution: Solution) => void;
  updateTasks: (tasks: Array<Task>) => void;
  getTasksFromOrder: (order:Array<number>) => Array<Task>;
  getTasksFromCurrentOrder: () => Array<Task>;
  updateSimulatedAnnealingSolution: (
    solutions: Array<Solution>,
    temperatures: Array<number>,
    propabilities: Array<number>
  ) => void;
  updateTabuSearchSolution: (
    solutions: Array<Solution>,
    tabuList: Array<TabuMove>
  ) => void;
  setSolutionForAnimation: (solution: Solution) => void;
  validateOrder: (order: Array<number>) => boolean;
  resetRecentlyChangedTasks: () => void;
  clearAnimationData: () => void;
  displayTemperatures: Array<number>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);
const MAX_DATA_POINTS = 100;

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error(
      "useTaskAnimation must be used within a TaskAnimationProvider"
    );
  }
  return context;
};

export const TaskProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {

  const [currentSolution, setCurrentSolution] = useState<Solution>({
    cmax: Infinity,
    order: [],
  });

  const [bestSolution, setBestSolution] = useState<Solution>({
    cmax: Infinity,
    order: [],
  });
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [recentlyChangedTasks, setRecentlyChangedTasks] = useState<Set<number>>(
    new Set()
  );
  const [isDataFetchingCompleted, setIsDataFetchingCompleted] = useState<boolean>(false);
  //Simulated Annealing
  const [temperatures, setTemperatures] = useState<Array<number>>([]);
  const [probabilities, setProbabilities] = useState<Array<number>>([]);
  const [displayTemperatures, setDisplayTemperatures] = useState<Array<number>>([]);
  //Tabu Search
  const [tabuList, setTabuList] = useState<TabuMove[]>([]);
  //Schrage Algorithm
  const [readyQueue, setReadyQueue] = useState<Array<number>>([]);
  const [notReadyQueue, setNotReadyQueue] = useState<Array<number>>([]);

  const calculateCmax = (order: Array<number>): number => {
    let cmax = 0;
    let time = 0;

    order.forEach((taskId) => {
      const task = tasks.find((task) => task.id === taskId);
      if (task) {
        time = Math.max(time, task.r) + task.p;
        cmax = Math.max(cmax, time + task.q);
      }
    });

    if (cmax === 0) {
      return Infinity;
    }

    return cmax;
  };


  const updateTasks = useCallback((updatedTasks: Array<Task>) => {
    setTasks(updatedTasks);
  }, []);

  const validateOrder = useCallback(
    (order: Array<number>) => {
      const taskIds = tasks.map((task) => task.id);
      console.log(`Order length: ${order.length}, Tasks length: ${tasks.length}`);
      if (order.length > tasks.length) {
        toast.error("Order cannot be longer than the number of tasks");
        return false;
      }

      const duplicates = order.filter((item, index) => order.indexOf(item) !== index);
      if(duplicates.length > 0){
        toast.error("Order contains duplicates: " + duplicates.join(", "));
        return false;
      }
  
      const invalidElements = order.filter((item) => !taskIds.includes(item));
      if (invalidElements.length > 0) {
        toast.error(
          "Order contains invalid task IDs: " + invalidElements.join(", ")
        );
        return false;
      }
  
      return true;
    },
    [tasks]
  );

  const getTasksFromCurrentOrder = (): Array<Task> => {
    return getTasksFromOrder(currentSolution?.order ?? []);
  };

  const getTasksFromOrder = (order: Array<number>): Array<Task> => {
    if (order === undefined || order.length === 0) {
      return [];
    }
    return order.map((id) => {
      const task = tasks.find((task) => task.id === id);
      if (!task) {
        throw new Error(`Task with id ${id} not found`);
      }
      return task;
    });
  };

  const prevOrderRef = useRef<Array<number>>([]);

  const updateRecentlyChanged = (currOrder: Array<number>) => {
    const prevOrder = prevOrderRef.current;
    const changedTasks = new Set<number>();

    tasks.forEach((task) => {
      const prevIndex = prevOrder.indexOf(task.id);
      const currIndex = currOrder.indexOf(task.id);

      if (prevIndex !== currIndex) {
        changedTasks.add(task.id);
      }
    });

    if (changedTasks.size > 0) {
      setRecentlyChangedTasks(changedTasks);
    }

    prevOrderRef.current = [...currOrder];
  };

  const resetRecentlyChangedTasks = () => {
    recentlyChangedTasks.clear();
    tasks.forEach((task) => {
      task.recentlyChanged = false;
    });
  };

  const setSolutionForAnimation = useCallback(
    (solution: Solution) => {
      if (solution) {
        if (solution.cmax < bestSolution.cmax) {
          setBestSolution(solution);
        }
        setCurrentSolution(solution);
        updateRecentlyChanged(solution.order);
      } else {
        console.warn('setSolutionForAnimation called with undefined solution');
      }
    },
    [bestSolution, setBestSolution, updateRecentlyChanged]
  );
  const updateAllSolutions = useCallback(
    (incomingSolutions: Array<Solution>) => {
      setSolutions((prevSolutions) => {
        return [...prevSolutions, ...incomingSolutions]
    });
  },[]
  );
  
  const createSolution = useCallback(
    (order: Array<number>) => {
      if (!validateOrder(order)) {
        return;
      }
      const newCmax = calculateCmax(order);
      setCurrentSolution({ order, cmax: newCmax });
    },
    [calculateCmax]
  );

  const updateSolution = useCallback((incomingSolution: Solution) => {
    if(incomingSolution.cmax < bestSolution.cmax){
      setBestSolution(incomingSolution);
    }
    setCurrentSolution(incomingSolution);
  }, []);


  const updateSimulatedAnnealingSolution = useCallback(
    (incomingSolutions, incomingTemperatures, incomingProbabilities) => {
      updateAllSolutions(incomingSolutions);
      setTemperatures((prev) => {
        const newTemperatures = [...prev, ...incomingTemperatures];
        return newTemperatures.slice(-MAX_DATA_POINTS);
      });
      setProbabilities((prev) => {
        const newProbabilities = [...prev, ...incomingProbabilities];
        return newProbabilities.slice(-MAX_DATA_POINTS);
      });
    },
    []
  );

  const updateTabuSearchSolution = useCallback(
    (incomingSolutions, incomingTabuList) => {
      updateAllSolutions(incomingSolutions);
      setTabuList((prev) => {
        const newTabuList = [...prev, ...incomingTabuList];
        return newTabuList.slice(-MAX_DATA_POINTS);
      });
    },
    []
  );

  const clearAnimationData = () => {
    setSolutions([]);
    setTemperatures([]);
    setProbabilities([]);
    setTabuList([]);
  };

  const value = {
    calculateCmax,
    tasks,
    temperatures,
    displayTemperatures,
    probabilities,
    solutions,
    recentlyChangedTasks,
    currentSolution,
    bestSolution,
    isDataFetchingCompleted,
    setIsDataFetchingCompleted,
    updateSolution,
    createSolution,
    updateTasks,
    getTasksFromOrder,
    getTasksFromCurrentOrder,
    setSolutionForAnimation,
    validateOrder,
    updateSimulatedAnnealingSolution,
    updateTabuSearchSolution,
    resetRecentlyChangedTasks,
    clearAnimationData,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
