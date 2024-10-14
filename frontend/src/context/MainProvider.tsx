import { NextUIProvider } from "@nextui-org/react";
import { AlgorithmProvider } from "../context/AlgorithmContext";
import { FileProvider } from "../context/FileContext";
import { TaskProvider } from "./TaskContext";
import ContextSynchronizer from "./ContextSynchronizer";

export function MainProvider({children}: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <AlgorithmProvider>
                <FileProvider>
                    <TaskProvider>
                        <ContextSynchronizer />
                        {children}
                    </TaskProvider>
                </FileProvider>
            </AlgorithmProvider>
        </NextUIProvider>
    )
}