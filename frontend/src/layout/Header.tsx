"use client";

import AlgorithmSelector from "@/components/header/AlgorithmSelector";
import DeleteButton from "@/components/header/DeleteButton";
import FileName from "@/components/header/FileName";
import StartButton from "@/components/header/StartButton";
import { useFile } from "@/context/FileContext";

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
      <div className="flex gap-4">
        <DeleteButton />
        <FileName />
      </div>
    </div>
  );
}
