import React, { useState, useEffect } from 'react';
import GanttChart from './GanttChart';
import { Task } from '@/common/types';


const GanttChartContainer: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://your-backend-url');

    ws.onmessage = (event) => {
      const newTask: Task = JSON.parse(event.data);
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks, newTask];
        return updatedTasks;
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  // return <GanttChart tasks={tasks} />;
  return <div>Placeholder</div>;
};

export default GanttChartContainer;
