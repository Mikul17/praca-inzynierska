"use client";
import React, { useEffect } from 'react';
import { useFile } from './FileContext';
import { useTaskContext } from './TaskContext';

const ContextSynchronizer: React.FC = () => {
  const { fileTasks, isFileLoaded } = useFile();
  const { tasks, updateTasks } = useTaskContext();

  useEffect(() => {
    if (isFileLoaded && fileTasks) {
      updateTasks(fileTasks);
    }
  }, [isFileLoaded, fileTasks, updateTasks, tasks]);

  return null;
};

export default ContextSynchronizer;