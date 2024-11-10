import TextDisplay from "@/components/common/TextDisplay";
import Gap from "../Gap";
import { useTaskContext } from "@/context/TaskContext";
import Searchbar from "@/components/header/Searchbar";
import { useEffect, useRef } from "react";

interface Props {
  headerHeight: number;
}

export default function GanttSectionHeader({ headerHeight }: Props) {
  const { currentSolution, bestSolution } = useTaskContext();
  const previousCmaxRef = useRef<number>(Infinity);
  const previousBestCmaxRef = useRef<number>(Infinity);

  const formatDisplay = (value: number, previousValue: number) => {
    if (value === Infinity) {
      return "-";
    }
    if (value < previousValue) {
      return (
        <p>
          {value}
          <span style={{ color: "green" }}> ↓</span>
        </p>
      );
    }

    if (value > previousValue) {
      return (
        <p>
          {value}
          <span style={{ color: "red" }}> ↑</span>
        </p>
      );
    }

    return value;
  };

  useEffect(() => {
    if (currentSolution) {
      previousCmaxRef.current = currentSolution.cmax;
    }
  }, [currentSolution]);

  useEffect(() => {
    if (bestSolution) {
      previousBestCmaxRef.current = bestSolution.cmax;
    }
  }, [bestSolution]);

  return (
    <div style={{ height: headerHeight }} className="flex items-center">
      <div className="flex items-center">
        <TextDisplay header="Best Cmax">
          {bestSolution
            ? formatDisplay(bestSolution.cmax, previousBestCmaxRef.current)
            : "-"}
        </TextDisplay>

        <Gap size={32} orientation="vertical" />

        <TextDisplay header="Current Cmax">
          {currentSolution
            ? formatDisplay(currentSolution.cmax, previousCmaxRef.current)
            : "-"}
        </TextDisplay>
      </div>
      <Gap size={32} orientation="vertical" />
      <Searchbar />
    </div>
  );
}
