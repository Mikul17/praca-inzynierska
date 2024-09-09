import { Button } from "@nextui-org/button";
import Icon from "./Icon";
import { useEffect, useState } from "react";
import { useFile } from "@/hooks/FileContext";

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
      className="shadow-outer-shadow"
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
