"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface LockContextType {
    lock: boolean;
    setLock: (lock: boolean) => void;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export const LockContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lock, setLock] = useState<boolean>(false);
    

    return (
        <LockContext.Provider value={{ lock, setLock }}>
            {children}
        </LockContext.Provider>
    );
}

export const useLock = () => {
    const context = useContext(LockContext);
    if (context === undefined) {
        throw new Error("useLock must be used within a LockContextProvider");
    }
    return context;
}