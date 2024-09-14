import { NextUIProvider } from "@nextui-org/react";
import { AlgorithmProvider } from "./AlgorithmContext";
import { FileProvider } from "./FileContext";

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