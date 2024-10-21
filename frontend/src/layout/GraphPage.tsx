import React, { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import GanttChart from "@/components/content/GanttChart";
import Gap from "./Gap";
import Chart from "react-google-charts";

interface LayoutProps {
  readonly height: number | string;
}

export default function GraphPage({ height }: LayoutProps) {
  const { tasks } = useTaskContext();

  return (
    <div style={{ height: height }} className="flex w-full h-full">
      <div style={{ width:"50%"}}>
        {tasks ? <GanttChart /> : <div>NIE MA DANYCH :c</div>}
      </div>
      <Gap size={64} orientation="vertical"/>
      <div style={{ width:"50%"}}>
        <Chart chartType={"LineChart"} />
      </div>
    </div>
  );
}