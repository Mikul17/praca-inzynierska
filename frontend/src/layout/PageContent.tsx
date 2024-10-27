"use client";
import {  Tab, Tabs } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { useFile } from "@/context/FileContext";
import GraphPage from "./GraphPage";
import GanttSectionHeader from "./Gantt/GraphPageHeader";
import DataSection from "./Data/DataSection";

interface PageContentProps {
  height: number;
}

export default function PageContent({ height }: PageContentProps) {
  const contentHeight = height - 16;

 
  return (
    <div style={{ height: height, minHeight: height}} className="flex items-center flex-col p-3">
      <Tabs
        size="lg"
        classNames={{
          tabList: "w-full flex",
          panel: "w-full",
        }}
      >
        <Tab key="Graphs" title="Graphs">
          <GraphPage height={contentHeight} />
        </Tab>
        <Tab key="Data" title="Data">
          <DataSection height={contentHeight}/>
        </Tab>
      </Tabs>
    </div>
  );
}
