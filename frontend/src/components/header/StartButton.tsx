import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { useFile } from "@/context/FileContext";
import Icon from "../Icon";
import useAnimationEffect from "@/hooks/useAnimationEffect";
import { useTaskContext } from "@/context/TaskContext";

export default function StartButton() {
  const { isFileLoaded } = useFile();
  const { tasks, updateOrders, setOrderForAnimation } = useTaskContext();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { play } = useAnimationEffect({
    totalFrames: tasks.length,
    initialSpeed: 1,
    onFrameChange: (frame) => {
      setTimeout(() => setOrderForAnimation(testOrders[frame]), 0);
      console.log("FINISHED FRAME "+frame)
    }
  });

  const testOrders = [
    [1,2,3],
    [2,1,3],
    [2,3,1],
    [3,2,1]
  ]

  const handleClick = () => {
    updateOrders(testOrders);
    play();
  }


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
      onClick={handleClick}
    >
      {isFileLoaded ? "" : "Load data"}
      {isHovered ? "Start" : ""}
    </Button>
  );
}
