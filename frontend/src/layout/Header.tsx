"use client";

import AlgorithmSelector from "@/components/header/AlgorithmSelector";
import StartButton from "@/components/header/StartButton";
import { useFile } from "@/hooks/FileContext";

interface HeaderProps {
  height: number | string;
}

export default function Header({ height }: HeaderProps) {
  const { fileName } = useFile();
  

  return (
    <div className={`flex justify-between`} style={{ height }}>
      <div className="flex gap-4">
        <AlgorithmSelector />
        <StartButton />
      </div>
      <div className="flex justify-center items-center bg-secondary p-4 h-[48px] shadow-outer-shadow" style={{borderRadius:"1rem 0 0 1rem", maxWidth:"30rem"}}>
          {fileName ? (
            <span className="text-2xl truncate ">File: {fileName}</span>
          ) : (
            <span className="text-2xl">No file selected</span>
          )}
    </div>
    </div>
  );
}
