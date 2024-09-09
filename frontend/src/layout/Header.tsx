"use client";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import StartButton from "@/components/StartButton";

interface HeaderProps {
    height: number | string;
}

export default function Header({ height }: HeaderProps) {
  return (
    <div className={`flex gap-4`} style={{ height }}>
      <AlgorithmSelector />
      <StartButton />
    </div>
  );
};


