"use client";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import StartButton from "@/components/StartButton";

export default function Header() {

    return (
        <div className="flex gap-4 pb-4">
            <AlgorithmSelector />
            <StartButton />
        </div>
    )
}
