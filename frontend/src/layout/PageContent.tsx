"use client";
import { Button } from "@nextui-org/button";
import { Input, Tab, Tabs, Tooltip } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTaskContext } from "@/context/TaskContext";
import FileDropzone from "@/components/content/FileDropzone";
import TooltipContent from "@/components/content/TooltipInformation";
import Icon from "@/components/Icon";
import Gap from "./Gap";
import { useFile } from "@/context/FileContext";
import GraphPage from "./GraphPage";

interface PageContentProps {
  height: number | string;
}

// Dynamiczny import z wyłączonym SSR
const GanttChart = dynamic(() => import("../components/content/GanttChart"), {
  ssr: false,
});

export default function PageContent({ height }: PageContentProps) {
  const { tasks, setOrder, validateOrder } = useTaskContext();
  const { generateSampleTasks } = useFile();
  const [inputValue, setInputValue] = useState("");

  const contentHeight = typeof height === "number" ? height - 80 : height;

  return (
    <div style={{ height: height}} className="flex items-center flex-col">
      <Tabs
        size="lg"
        classNames={{
          tabList: "w-full flex",
          panel: "w-full p-4"
        }}
      >
        <Tab key="Graphs" title="Graphs">
          <GraphPage height={contentHeight} />
        </Tab>
        <Tab key="Data" title="Data">
          {/* Your other content */}
        </Tab>
      </Tabs>
    </div>
  );
}

// return (
//   <div style={{ width: "1000px" }}>
//     <Input
//       placeholder="Wpisz kolejność zadań (np. 1 2 3)"
//       value={inputValue}
//       onChange={(e) => setInputValue(e.target.value)}
//       width="300px"
//     />
//     <GanttChart />
//   </div>
// );
