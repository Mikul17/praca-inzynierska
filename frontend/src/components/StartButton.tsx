import { Button } from "@nextui-org/button";
import Icon from "./Icon";
import { useEffect, useState } from "react";
import { useFile } from "@/providers/context/FileContext";
import { Spinner } from "@nextui-org/react";

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
      size="lg"
      spinner={<Spinner color="white" />}
      isDisabled={!isFileLoaded}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isFileLoaded ? "" : "Load data"}
      {isHovered ? "Start" : ""}
    </Button>
  );
}
