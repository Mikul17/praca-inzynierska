"use client";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import { Button } from "@nextui-org/button";

export default function Header() {

    return (
        <div className="flex gap-3">
            <AlgorithmSelector />
            <Button size="lg">Start</Button>
        </div>
    )
}
