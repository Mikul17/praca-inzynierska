import { useTaskContext } from "@/context/TaskContext";
import Chart from "react-google-charts";
import Image from "next/image";
import NoDataImage from "@/icons/noData.png";
import { useEffect, useState } from "react";

interface ChartProps {
  readonly data: number[];
  readonly title: string;
  readonly xAxisTitle: string;
  readonly yAxisTitle: string;
}


export default function SolutionChart({data, title, xAxisTitle, yAxisTitle}: ChartProps) {
    const [chartData, setChartData] = useState<Array<(string | number)[]>>([]);

    const mapToChartData = (data: number[]): Array<(string | number)[]> => {
      const chartData: Array<(string | number)[]> = [[xAxisTitle, yAxisTitle]];
      data.forEach((value, index) => {
        chartData.push([index + 1, value]);
      });
      return chartData;
    }

  useEffect(() => {
    if (data.length > 0) {
      setChartData(mapToChartData(data));
    }
  }, [data]);

    const options = {
      title: title,
      hAxis: { title: yAxisTitle },
      vAxis: { title: xAxisTitle },
      curveType: "function",
      backgroundColor: '#faf9f6',
    };

    if(data.length === 0 || data === undefined) {
        return <div className="flex justify-center ">
          <Image src={NoDataImage} alt="No data available" />
        </div>
    }

  return (
    <div className="bg-primary">
      <Chart 
      chartType={"LineChart"}
      data={chartData}
      options={options}
      legendToggle={true}
      className="bg-primary"
      />
    </div>
  );
}
