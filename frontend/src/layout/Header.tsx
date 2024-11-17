"use client";

import AlgorithmSelector from "@/components/header/AlgorithmSelector";
import DeleteButton from "@/components/header/DeleteButton";
import FileName from "@/components/header/FileName";
import ParametersButton from "@/components/header/ParametersButton";
import StartButton from "@/components/header/StartButton";
import { useFile } from "@/context/FileContext";
import { useLock } from "@/context/LockContext";

interface HeaderProps {
  height: number | string;
}

export default function Header({ height }: HeaderProps) {
  const { fileTasks } = useFile();
  const { lock } = useLock();

  return (
    <div className={`flex justify-between`} style={{ height }}>
      <div className="flex gap-4">
        <AlgorithmSelector />
        {(fileTasks !== null && fileTasks.length > 0 && !lock) && <ParametersButton />}
        <StartButton />
      </div>
      <div className="flex gap-4">
        <DeleteButton />
        <FileName />
      </div>
    </div>
  );
}
