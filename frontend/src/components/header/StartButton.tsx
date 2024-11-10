"use client";
import { Button } from "@nextui-org/button";
import { useState, useEffect, useCallback } from "react";
import { useFile } from "@/context/FileContext";
import Icon from "../Icon";
import useAnimationEffect from "@/hooks/useAnimationEffect";
import { useTaskContext } from "@/context/TaskContext";
import { useAlgorithm } from "@/context/AlgorithmContext";
import { startScheduler } from "@/common/api";
import useWebSocket from "@/hooks/useWebSocket";

export default function StartButton() {
  const { isFileLoaded } = useFile();
  const { currentAlgorithm } = useAlgorithm();
  const { solutions, bestSolution, tasks, setSolutionForAnimation, updateSolution, resetRecentlyChangedTasks } = useTaskContext();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const {
    setSessionId,
    connect
  } = useWebSocket();

  const canAdvanceFrame = useCallback(
    (nextFrame) => {
      return solutions[nextFrame] !== undefined;
    },
    [solutions]
  );
  

  const onFrameChange = useCallback(
    (frame: number) => {
      if (solutions[frame]) {
        setSolutionForAnimation(solutions[frame]);
        console.log("Frame changed to:", frame);
      } 
    },
    [solutions, setSolutionForAnimation]
  );

  const { play, currentFrame, isPlaying, } = useAnimationEffect({
    initialSpeed: 5.0,
    onFrameChange,
    canAdvanceFrame,
    onAnimationStart: () => console.log("Animation started"),
    onAnimationEnd: () => {
      setTimeout(() => {
        resetRecentlyChangedTasks();
        updateSolution(bestSolution);
      }, 0);
    },
  });

  useEffect(() => {
    if (!isPlaying && solutions[currentFrame + 1]) {
      play();
    }
  }, [solutions, isPlaying, play, currentFrame]);

  useEffect(() => {
    if (isPlaying) {
      onFrameChange(currentFrame);
    }
  }, [currentFrame, onFrameChange, isPlaying]);

  const newHandleClick = async () => {
    try {
      const response = await startScheduler(currentAlgorithm, tasks);
      if (response) {
        setSessionId(response);
        connect(response);
      }
    } catch (error) {
      console.error('Failed to start scheduler:', error);
    }
  };

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
      onClick={newHandleClick}
    >
      {isFileLoaded ? "" : "Load data first"}
      {isHovered ? "Start" : ""}
    </Button>
  );
}
