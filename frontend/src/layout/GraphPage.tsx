import React, { memo, useEffect, useMemo } from "react";
import { useTaskContext } from "@/context/TaskContext";
import SolutionChart from "@/components/content/SolutionChart";
import GanttChartSection from "./Gantt/GanttChartSection";
import ChartCard from "./ChartCard";
import Gap from "./Gap";
import { useAlgorithm } from "@/context/AlgorithmContext";

interface LayoutProps {
  readonly height: number;
}

const GraphPage = memo(({ height }: LayoutProps) => {
  const { solutions, temperatures, probabilities } = useTaskContext();
  const { currentAlgorithm } = useAlgorithm();

  const generateCharts = useMemo(() => {
    const charts = [];
    const cmaxHistory = solutions.map((solution) => solution.cmax);
    switch (currentAlgorithm) {
      case "SimulatedAnnealing":
        charts.push(
          <SolutionChart
            data={cmaxHistory}
            title={"Cmax"}
            xAxisTitle={"Iteration"}
            yAxisTitle={"Cmax"}
            key="cmax"
          />
        );
        charts.push(
          <SolutionChart
            data={temperatures}
            title={"Temperature"}
            xAxisTitle={"Iteration"}
            yAxisTitle={"Temperature"}
            key="temperature"
          />
        );
        charts.push(
          <SolutionChart
            data={probabilities}
            title={"Probability"}
            xAxisTitle={"Iteration"}
            yAxisTitle={"Acceptance %"}
            key="probability"
          />
        );
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
}, [currentAlgorithm, solutions, temperatures, probabilities]);

  return (
    <div style={{ height: height}} className="flex w-full">
      <GanttChartSection />
      <Gap size={32} orientation="vertical"/>
      {/* <ChartCard height={height - 32 - 100}>
        {generateCharts}
       </ChartCard> */}
    </div>
  );
});

export default GraphPage;