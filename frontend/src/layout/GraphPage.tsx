import React from "react";
import { useTaskContext } from "@/context/TaskContext";
import GanttChart from "@/components/content/GanttChart";
import Gap from "./Gap";
import Chart from "react-google-charts";
import SolutionChart from "@/components/content/SolutionChart";

interface LayoutProps {
  readonly height: number | string;
}

export default function GraphPage({ height }: LayoutProps) {
  const { tasks } = useTaskContext();

  return (
    <div style={{ height: height }} className="flex w-full h-full">
      <div style={{ width:"50%"}}>
        <GanttChart />
      </div>
      <Gap size={64} orientation="vertical"/>
      <div style={{ width:"50%"}}>
       <SolutionChart />
      </div>
    </div>
  );
}