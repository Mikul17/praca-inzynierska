import { useTaskContext } from "@/context/TaskContext";
import Chart from "react-google-charts";
import Image from "next/image";
import NoDataImage from "@/icons/noData.png";
import { useEffect, useState } from "react";


export default function SolutionChart() {
    const { cmaxHistory } = useTaskContext();
    const [chartData, setChartData] = useState<Array<(string | number)[]>>([]);

    const mapCmaxToChartData = (cmaxHistory: number[]): Array<(string | number)[]> => {
      const chartData: Array<(string | number)[]> = [["iteration", "cmax"]];
      cmaxHistory.forEach((cmax, index) => {
        chartData.push([index + 1, cmax]);
      });
      return chartData;
    }

  useEffect(() => {
    if (cmaxHistory.length > 0) {
      setChartData(mapCmaxToChartData(cmaxHistory));
    }
  }, [cmaxHistory]);

    const options = {
      title: "Cmax",
      hAxis: { title: "Iteration" },
      vAxis: { title: "Cmax" },
      curveType: "function",
      backgroundColor: '#faf9f6',
    };

    if(cmaxHistory.length === 0 || cmaxHistory === undefined) {
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
