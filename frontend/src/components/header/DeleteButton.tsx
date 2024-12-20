import { useFile } from "@/context/FileContext";
import { Button } from "@nextui-org/button";
import Icon from "../Icon";
import { useState } from "react";
import { useLock } from "@/context/LockContext";


export default function DeleteButton() {
    const { deleteLoadedFile, isFileLoaded } = useFile();
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const { lock } = useLock();

    return (
        <Button
            startContent={<Icon name="delete" size={20} color="currentColor" />}
            className="shadow-outer-shadow bg-secondary hover:bg-primary"
            size="lg"
            isDisabled={!isFileLoaded || lock}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={deleteLoadedFile}
        >
            {isHovered ? "Delete file" : ""}
        </Button>
    )
}