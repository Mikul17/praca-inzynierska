import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { useFile } from "@/hooks/FileContext";
import Icon from "../Icon";

export default function StartButton() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { isFileLoaded } = useFile();

  useEffect(() => {
    console.log("isFileLoaded", isFileLoaded);
  }, [isFileLoaded]);

  return (
    <Button
      startContent={
        isFileLoaded ? 
        <Icon name="play" size={20} color="currentColor" /> : 
        <Icon name="file" size={20} color="currentColor" />
      }
      className="shadow-outer-shadow bg-secondary hover:bg-primary"
      size="lg"
      isDisabled={!isFileLoaded}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isFileLoaded ? "" : "Load data"}
      {isHovered ? "Start" : ""}
    </Button>
  );
}
