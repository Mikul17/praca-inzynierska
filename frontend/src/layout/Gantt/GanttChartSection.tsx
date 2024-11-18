import GanttChart from "@/components/content/GanttChart";
import Gap from "../Gap";
import GanttSectionHeader from "./GraphPageHeader";
import ChartCard from "../ChartCard";
import { useAlgorithm } from "@/context/AlgorithmContext";
import { useMemo } from "react";
import ControlButton from "@/components/common/ControlButton";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useDisclosure } from "@nextui-org/react";
import ChangeParametersModal from "@/components/content/ChangeParametersModal";


export default function GanttChartSection() {
  const { currentAlgorithm } = useAlgorithm();
  const { sendResetTemperature, sendStopTemperatureChange ,clearTabuList, stopTemperatureChangeFlag  } = useWebSocket();
  const { isOpen, onOpen, onOpenChange} = useDisclosure();
 
  const shouldGenerateControlButtons =
    currentAlgorithm === "SimulatedAnnealing" ||
    currentAlgorithm === "TabuSearch";

  const generateControlButtonByAlgorithm = useMemo(() => {
    switch (currentAlgorithm) {
      case "SimulatedAnnealing":
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              width: "100%",
            }}
          >
            <ControlButton text="Change cooling rate" onClick={onOpen} />
            <ControlButton text="Reset temperature" onClick={sendResetTemperature} />
            <ControlButton text={stopTemperatureChangeFlag ? "Stop temperature change" : "Resume temperature change"} onClick={sendStopTemperatureChange} />
          </div>
        );
        break;
      case "TabuSearch":
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              width: "100%",
            }}
          >
            <ControlButton text="Change tabu list parameter" onClick={onOpen} />
            <ControlButton text="Clear tabu list" onClick={clearTabuList} />
          </div>
        );
      default:
        return;
    }
  }, [currentAlgorithm, sendResetTemperature, sendStopTemperatureChange, clearTabuList]);

  return (
    <ChartCard>
      <GanttSectionHeader headerHeight={100} />
      <Gap size={16} orientation="horizontal" />
      <GanttChart />
      <Gap size={16} orientation="horizontal" />
      {shouldGenerateControlButtons && generateControlButtonByAlgorithm}
      <ChangeParametersModal isOpen={isOpen} onOpenChange={onOpenChange}/>
    </ChartCard>
  );
}
