import React, { memo, useEffect, useMemo } from "react";
import { useTaskContext } from "@/context/TaskContext";
import SolutionChart from "@/components/content/SolutionChart";
import GanttChartSection from "./Gantt/GanttChartSection";
import ChartCard from "./ChartCard";
import Gap from "./Gap";
import { useAlgorithm } from "@/context/AlgorithmContext";
import TabuList from "@/components/content/TabuList";
import QueueVisualizer from "@/components/content/QueueVisualizer";
import ProbabilityChart from "@/components/content/ProbabilityChart";
import TreeChart from "@/components/content/TreeChart";
import { TreeNode } from "@/common/types";
interface LayoutProps {
  readonly height: number;
}

const GraphPage = memo(({ height }: LayoutProps) => {
  const { solutions, displayTemperatures, displayProbabilities, displayCmax, readyQueue, notReadyQueue, rootNode } =
    useTaskContext();
  const { currentAlgorithm } = useAlgorithm();

  const dataExists = useMemo(() => solutions.length > 0 || notReadyQueue.length > 0 || readyQueue.length>0, [solutions]);


  const generateCharts = useMemo(() => {
    const charts = [];
    switch (currentAlgorithm) {
      case "SimulatedAnnealing":
        charts.push(
          <SolutionChart
            data={displayCmax}
            title={"Cmax"}
            yAxisTitle={"Iteration"}
            xAxisTitle={"Cmax"}
            key="cmaxSA"
          />
        );
        charts.push(
          <SolutionChart
            data={displayTemperatures}
            title={"Temperature"}
            yAxisTitle={"Iteration"}
            xAxisTitle={"Temperature"}
            key="temperatureSA"
          />
        );
        charts.push(
          <ProbabilityChart
            data={displayProbabilities}
            title={"Probability"}
            yAxisTitle={"Iteration"}
            xAxisTitle={"Acceptance %"}
            key="probabilitySA"
          />
        );
        return charts;
      case "TabuSearch":
        charts.push(
          <SolutionChart
            data={displayCmax}
            title={"Cmax"}
            yAxisTitle={"Iteration"}
            xAxisTitle={"Cmax"}
            key="cmaxTS"
          />
        );
        charts.push(<Gap size={32} orientation="horizontal" key="gapTS" />);
        charts.push(<TabuList key="tabuList" />);
        return charts;
      case "SchrageAlgorithm":
        charts.push(<QueueVisualizer key="queueVisualizer" label="Not Ready Queue" data={notReadyQueue}/>);
        charts.push(<QueueVisualizer key="queueVisualizer" label="Ready Queue" data={readyQueue}/>);
        return charts;
      case "CarlierAlgorithm":
        charts.push(
          <TreeChart data={rootNode}/>
        );
        return charts;
      default:
        return charts;
    }
  }, [
    currentAlgorithm,
    solutions,
    displayTemperatures,
    displayProbabilities,
    displayCmax,
    rootNode
  ]);

  return (
    <div style={{ height: height }} className="flex w-full">
      <GanttChartSection />
      <Gap size={32} orientation="vertical" />
        <ChartCard height={height - 32 - 100}>{generateCharts}</ChartCard>
    </div>
  );
});

export default GraphPage;
