import { useFile } from "@/context/FileContext";
import { Button } from "@nextui-org/button";
import Icon from "../Icon";
import { useState } from "react";


export default function DeleteButton() {
    const { deleteLoadedFile, isFileLoaded } = useFile();
    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <Button
            startContent={<Icon name="delete" size={20} color="currentColor" />}
            className="shadow-outer-shadow bg-secondary hover:bg-primary"
            size="lg"
            isDisabled={!isFileLoaded}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={deleteLoadedFile}
        >
            {isHovered ? "Delete file" : ""}
        </Button>
    )
}