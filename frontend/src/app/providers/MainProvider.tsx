import { NextUIProvider } from "@nextui-org/react";

export function MainProvider({children}: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )
}