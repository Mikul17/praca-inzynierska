"use client";
import { Task, TaskRequest } from '@/common/types';
import { i } from 'framer-motion/client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface TaskContextType {
  bestCmax: number;
  currentCmax: number;
  previousCmax: number;
  previousOrder: number[];
  currentOrder: number[];
  allOrders: number[][];
  tasks: Task[];
  updateTasks: (tasks: Task[]) => void;
  getTasksFromOrder: (order: number[]) => Task[];
  getTasksFromCurrentOrder: () => Task[];
  setOrder: (order: number[]) => void;
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
  const [previousOrder, setPreviousOrder] = useState<number[]>([]);
  const [allOrders, setAllOrders] = useState<number[][]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

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
    setAllOrders(orders);
  }, []);

  const updateTasks = useCallback((updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  }, [tasks]);


  const getTasksFromCurrentOrder = () => {
    return getTasksFromOrder(currentOrder);
  }

  const getTasksFromOrder = (order: number[]): Task[] => {
    if( order === undefined || order.length === 0) {
      return [];
    }
    return order.map(id => tasks.find(task => task.id === id)!);
  };

  const setOrder = useCallback((order: number[]) => {
    setPreviousOrder(currentOrder);
    setCurrentOrder(order);
  }, [currentOrder]);

  useEffect(() => {
    setCurrentOrder(allOrders[0]);
  }, [allOrders]);

  useEffect(() => {
    if(currentOrder === undefined || currentOrder.length === 0) {
      return;
    }
    setPreviousCmax(currentCmax);
    setCurrentCmax(calculateCmax(getTasksFromCurrentOrder()));
    if(currentCmax < bestCmax) {
      setBestCmax(currentCmax);
    }
  }, [currentOrder]);

  const value = {
    bestCmax,
    currentCmax,  
    previousCmax,
    previousOrder,
    currentOrder,
    allOrders,
    tasks,
    updateTasks,
    getTasksFromOrder,
    getTasksFromCurrentOrder,
    setOrder
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};