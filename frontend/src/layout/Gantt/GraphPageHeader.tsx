import TextDisplay from "@/components/common/TextDisplay";
import Gap from "../Gap";
import { useTaskContext } from "@/context/TaskContext";
import Searchbar from "@/components/header/Searchbar";

interface Props {
  headerHeight: number;
}

export default function GanttSectionHeader({ headerHeight }: Props) {
  const { bestCmax, currentCmax, previousCmax, previousBestCmax } = useTaskContext();

  const formatDisplay = (value: number, previousValue: number) => {
    if (value === Infinity) {
      return "-";
    }
    if(value < previousValue){
      return <p>{value}<span style={{color: 'green'}}> ↓</span></p>
    }

    if(value > previousValue){
      return <p>{value}<span style={{color: 'red'}}> ↑</span></p>
    }

    return value;
  };
  
  return (
    <div style={{ height: headerHeight }} className="flex items-center">
      <div className="flex items-center">
        <TextDisplay header="Best Cmax">
          {formatDisplay(bestCmax, previousBestCmax)}
        </TextDisplay>

        <Gap size={32} orientation="vertical" />

        <TextDisplay header="Current Cmax">
         {formatDisplay(currentCmax, previousCmax)}
        </TextDisplay>
      </div>
      <Gap size={32} orientation="vertical" />
      <Searchbar />
    </div>
  );
}
