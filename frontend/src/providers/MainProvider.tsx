import { NextUIProvider } from "@nextui-org/react";
import { AlgorithmProvider } from "./context/AlgorithmContext";
import { FileProvider } from "./context/FileContext";

export function MainProvider({children}: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <AlgorithmProvider>
                <FileProvider>
                    {children}
                </FileProvider>
            </AlgorithmProvider>
        </NextUIProvider>
    )
}