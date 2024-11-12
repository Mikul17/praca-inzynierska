 "use client";

import { useTaskContext } from "@/context/TaskContext";
import { Textarea } from "@nextui-org/react";
import { data } from "framer-motion/client";

interface QueueProps {
    readonly label: string;
    readonly data: Array<number>
}

 export default function QueueVisualizer({ label, data }: QueueProps) {
    return (
        <Textarea
            label= {label}
            value={data.length > 0 ? data.join(", ") : "Empty"}
            disabled
            style={{ width: "100%", height: "100%" }}
        />
    );
}