import { NextUIProvider } from "@nextui-org/react";
import { AlgorithmProvider } from "../context/AlgorithmContext";
import { FileProvider } from "../context/FileContext";
import { TaskProvider } from "./TaskContext";
import ContextSynchronizer from "./ContextSynchronizer";
import { ParameterContextProvider } from "./ParameterContext";
import { LockContextProvider } from "./LockContext";
import { WebSocketProvider } from "@/hooks/useWebSocket";

export function MainProvider({children}: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <AlgorithmProvider>
                <FileProvider>
                    <TaskProvider>
                        <ContextSynchronizer />
                        <ParameterContextProvider>
                         <LockContextProvider>
                            <WebSocketProvider>
                                {children}
                            </WebSocketProvider>
                         </LockContextProvider>
                        </ParameterContextProvider>
                    </TaskProvider>
                </FileProvider>
            </AlgorithmProvider>
        </NextUIProvider>
    )
}