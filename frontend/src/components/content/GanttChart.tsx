import React, { useEffect, useRef, useState } from 'react';
import { DataSet } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import { Task } from '@/common/types';
import { useTaskContext } from '@/context/TaskContext';

interface GanttChartProps {
}

const taskStyle = (isRecentlyChanged: boolean) => `
  color:  ${isRecentlyChanged ? '#f4f4f5' : 'black'};
  border: none;
  border-radius: 8px;
  background-color: ${isRecentlyChanged ? '#1DB954' : '#d9d9d9'};
  transition: background-color 0.3s ease;
`;

const GanttChart: React.FC<GanttChartProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<any>(null);
  const itemsRef = useRef<any>(null);
  const groupsRef = useRef<any>(null);
  const { getTasksFromCurrentOrder, recentlyChangedTasks } = useTaskContext();
  const tasks = getTasksFromCurrentOrder() ?? [];

  const computeSchedule = (tasks: Task[]): Task[] => {
    let currentTime = 0;

    return tasks.map((task) => {
      const start = Math.max(task.r, currentTime);
      const end = start + task.p;
      currentTime = end;
      return {
        ...task,
        actualStart: start,
        actualEnd: end,
      };
    });
  };

  const mapTasksToTimelineItems = (tasks: Task[]) => {
    return new DataSet(
      tasks.map((task) => ({
        id: task.id,
        content: `Task ${task.id}`,
        start: task.actualStart,
        end: task.actualEnd,
        group: task.id,
        title: `R: ${task.r}, P: ${task.p}, Q: ${task.q}`,
        style: taskStyle(recentlyChangedTasks.has(task.id)),
      }))
    );
  };

  //Puts each task into individual group which makes it possible to display them in separate rows
  const prepareTimelineGroups = (tasks: Task[]) => {
    return new DataSet(
      tasks.map(task => ({
        id: task.id,
        content: `Task ${task.id}`,
      }))
    );
  };

  //Render items on chart - handles update as well
  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      const { Timeline } = require('vis-timeline/standalone');

      const scheduledTasks = computeSchedule(tasks);

      const options = {
        orientation: {
          axis: 'top',
        },
        stack: false,
        zoomable: true,
        moveable: true,
        horizontalScroll: true,
        verticalScroll: true,
        selectable: false,
        maxHeight: 500,
        tooltip: {
          followMouse: true,
        },
        start: 0,
        end: scheduledTasks.length > 0 ? (scheduledTasks[scheduledTasks.length - 1].actualEnd ?? 0) + 10 : 100,
        min: 0,
        zoomMax:  1000 * 60 * 60 ,
        format: {
          minorLabels: function(date: string | number | Date, scale: any) {
            switch (scale) {
              case 'millisecond':
                return new Date(date).getTime();
              case 'second':
                var seconds = Math.round(new Date(date).getTime());
                return seconds;
              case 'minute':
                var minutes = Math.round(new Date(date).getTime());
                return minutes;
            }
          },
          majorLabels: {
            millisecond: '', second: '', minute: '', hour: '', weekday: '', day: '', month: '', year: ''
          }
        },

      };

      if (!timelineRef.current) {
        itemsRef.current = mapTasksToTimelineItems(scheduledTasks);
        groupsRef.current = prepareTimelineGroups(scheduledTasks);
        timelineRef.current = new Timeline(
          containerRef.current,
          itemsRef.current,
          groupsRef.current,
          options 
        );
      } else {

        const newItems = mapTasksToTimelineItems(scheduledTasks);
        const newGroups = prepareTimelineGroups(scheduledTasks);

        itemsRef.current.clear();
        itemsRef.current.add(newItems.get());

        groupsRef.current.clear();
        groupsRef.current.add(newGroups.get());
      }

      timelineRef.current.fit(true)
    }
  }, [tasks, recentlyChangedTasks]);

  return <div ref={containerRef}/>;
};

export default GanttChart;
