import GanttChart from "@/components/content/GanttChart";
import Gap from "../Gap";
import GanttSectionHeader from "./GraphPageHeader";
import ChartCard from "../ChartCard";

export default function GanttChartSection() {
  return (
    <ChartCard>
      <GanttSectionHeader headerHeight={100} />
      <Gap size={16} orientation="horizontal" />
      <GanttChart />
      <Gap size={16} orientation="horizontal" />
    </ChartCard>
  );
}
