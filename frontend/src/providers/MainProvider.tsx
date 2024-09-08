import { NextUIProvider } from "@nextui-org/react";
import { AlgorithmProvider } from "./context/AlgorithmContext";

export function MainProvider({children}: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <AlgorithmProvider>
                {children}
            </AlgorithmProvider>
        </NextUIProvider>
    )
}