"use client";
import { Task, TaskRequest } from '@/common/types';
import toast from 'react-hot-toast';
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface TaskContextType {
  bestCmax: number;
  currentCmax: number;
  previousCmax: number;
  currentOrder: number[];
  allOrders: number[][];
  tasks: Task[];
  recentlyChangedTasks: Set<number>;
  updateTasks: (tasks: Task[]) => void;
  getTasksFromOrder: (order: number[]) => Task[];
  getTasksFromCurrentOrder: () => Task[];
  setOrder: (order: number[]) => void;
  setOrderForAnimation: (order: number[]) => void;
  validateOrder: (order: number[]) => boolean;
  updateOrders: (orders: number[][]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskAnimation must be used within a TaskAnimationProvider');
  }
  return context;
};

export const TaskProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [bestCmax, setBestCmax] = useState<number>(Infinity);
  const [currentCmax, setCurrentCmax] = useState<number>(Infinity);
  const [previousCmax, setPreviousCmax] = useState<number>(Infinity);

  const [currentOrder, setCurrentOrder] = useState<number[]>([]);
  const [allOrders, setAllOrders] = useState<number[][]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recentlyChangedTasks, setRecentlyChangedTasks] = useState<Set<number>>(new Set());

  const calculateCmax = (tasks: Task[]): number => {
    let cmax = 0;
    let time = 0;

    for (const task of tasks) {
      time = Math.max(task.r, time) + task.p;
      cmax = Math.max(cmax, time + task.q);
    }
    return cmax;
  };

  const updateOrders = useCallback((orders: number[][]) => {
    setAllOrders((prevOrders) => {
      if (JSON.stringify(prevOrders) !== JSON.stringify(orders)) {
        return orders;
      }
      return prevOrders;
    });
  }, []);

  const updateTasks = useCallback((updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  }, []);

  const validateOrder = useCallback((order: number[]) => {
    const taskIds = tasks.map((task) => task.id);

    if (order.length > tasks.length) {
      toast.error("Order cannot be longer than the number of tasks");
      return false;
    }

    const invalidElements = order.filter((item) => !taskIds.includes(item));
    if (invalidElements.length > 0) {
      toast.error("Order contains invalid task IDs: " + invalidElements.join(", "));
      return false;
    }

    return true;
  }, [tasks]);

  const getTasksFromCurrentOrder = (): Task[] => {
    return getTasksFromOrder(currentOrder);
  };

  const getTasksFromOrder = (order: number[]): Task[] => {
    if (order === undefined || order.length === 0) {
      return [];
    }
    return order.map((id) => tasks.find((task) => task.id === id)!);
  };

  const prevOrderRef = useRef<number[]>([]);  // Dodajemy useRef dla przechowywania poprzedniego porządku

  const updateRecentlyChanged = (currOrder: number[]) => {
    const prevOrder = prevOrderRef.current;
    const changedTasks = new Set<number>();
  
    tasks.forEach((task) => {
      const prevIndex = prevOrder.indexOf(task.id);
      const currIndex = currOrder.indexOf(task.id);
  
      if (prevIndex !== currIndex) {
        changedTasks.add(task.id);
      }
    });
  
    // Dodajemy warunek, aby nie aktualizować recentlyChangedTasks, jeśli nie ma zmian
    if (changedTasks.size > 0) {
      setRecentlyChangedTasks(changedTasks);
      console.log("Updated recently changed tasks:", changedTasks);
    } else {
      console.log("No changes in tasks, not updating recentlyChangedTasks.");
    }
  
    prevOrderRef.current = [...currOrder]; // Aktualizujemy prevOrderRef na koniec tej operacji
  };

  const resetRecentlyChangedTasks = () => {
    recentlyChangedTasks.clear();
    tasks.forEach((task) => {
      task.recentlyChanged = false;
    })
  }

  const setOrder = useCallback((order: number[]) => {
    resetRecentlyChangedTasks();
    setCurrentOrder(order);
  }, [currentOrder]);

  const setOrderForAnimation = useCallback((order: number[]) => {
    console.log("Setting order for animation:", order);
    setCurrentOrder((prevCurrentOrder) => {
      updateRecentlyChanged(order);
      return order;
    });
  }, [updateRecentlyChanged]);


  const value = {
    bestCmax,
    currentCmax,
    previousCmax,
    currentOrder,
    allOrders,
    tasks,
    recentlyChangedTasks,
    updateTasks,
    getTasksFromOrder,
    getTasksFromCurrentOrder,
    setOrder,
    setOrderForAnimation,
    validateOrder,
    updateOrders,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};