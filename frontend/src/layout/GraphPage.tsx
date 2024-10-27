import React, { useEffect } from "react";
import { useTaskContext } from "@/context/TaskContext";
import SolutionChart from "@/components/content/SolutionChart";
import GanttChartSection from "./Gantt/GanttChartSection";
import ChartCard from "./ChartCard";
import Gap from "./Gap";
import { useAlgorithm } from "@/context/AlgorithmContext";

interface LayoutProps {
  readonly height: number;
}

export default function GraphPage({ height }: LayoutProps) {
  const { cmaxHistory } = useTaskContext();
  const { currentAlgorithm } = useAlgorithm();

  const charts = []

  const generateCharts = () => {
    switch (currentAlgorithm) {
      case "SimulatedAnnealing":
        charts.push(<SolutionChart data={cmaxHistory} title={"Cmax"} xAxisTitle={"cmax"} yAxisTitle={"iteration"} />);
        charts.push(<SolutionChart data={cmaxHistory} title={"Temperature"} xAxisTitle={"Temperature"} yAxisTitle={"iteration"} />);
        charts.push(<SolutionChart data={cmaxHistory} title={"Probability"} xAxisTitle={"Acceptance %"} yAxisTitle={"iteration"} />);
        return charts;
      case "TabuSearch":
        charts.push(<SolutionChart data={cmaxHistory} title={"Cmax"} xAxisTitle={"cmax"} yAxisTitle={"iteration"} />);
        return charts;
       case "SchrageAlgorithm":
        charts.push(<SolutionChart data={cmaxHistory} title={"Cmax"} xAxisTitle={"cmax"} yAxisTitle={"iteration"} />);
        return charts;
       case "CarlierAlgorithm":
        charts.push(<SolutionChart data={cmaxHistory} title={"Cmax"} xAxisTitle={"cmax"} yAxisTitle={"iteration"} />);
        return charts;
        default:
        return charts;
  }
}

  return (
    <div style={{ height: height}} className="flex w-full">
      <GanttChartSection />
      <Gap size={32} orientation="vertical"/>
      <ChartCard height={height - 32 - 100}>
        {generateCharts()}
       </ChartCard>
    </div>
  );
}