import React, { memo, useMemo } from "react";
import Chart from "react-google-charts";

interface ChartProps {
  readonly data: number[];
  readonly iterationOffset: number;
  readonly title: string;
  readonly xAxisTitle: string;
  readonly yAxisTitle: string;
}

const SolutionChart = memo(function SolutionChart({
  data,
  title,
  xAxisTitle,
  yAxisTitle,
  iterationOffset,
}: ChartProps) {
  const chartData = useMemo(() => {
    if (data.length > 0) {
      const mappedData: Array<(string | number)[]> = [[yAxisTitle, xAxisTitle]];
      data.forEach((value, index) => {
        const iterationNumber = index + iterationOffset + 1;
        mappedData.push([iterationNumber, value]);
      });
      return mappedData;
    }
    return [];
  }, [data, iterationOffset]);

  const options = {
    title: title,
    hAxis: { title: yAxisTitle },
    vAxis: { title: xAxisTitle },
    curveType: "function",
    backgroundColor: "#faf9f6",
  };

  return (
    <div className="bg-primary">
      <Chart
        chartType={"LineChart"}
        data={chartData}
        options={options}
        legendToggle={false}
        className="bg-primary"
      />
    </div>
  );
});

export default SolutionChart;
