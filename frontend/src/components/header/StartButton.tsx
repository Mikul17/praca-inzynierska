"use client";
import { Button } from "@nextui-org/button";
import { useState, useEffect, useCallback } from "react";
import { useFile } from "@/context/FileContext";
import Icon from "../Icon";
import useAnimationEffect from "@/hooks/useAnimationEffect";
import { useTaskContext } from "@/context/TaskContext";
import { AlgorithmApiNames, useAlgorithm } from "@/context/AlgorithmContext";
import { startScheduler } from "@/common/api";
import toast from "react-hot-toast";
import { useParameters } from "@/context/ParameterContext";
import { AlgorithmParameters } from "@/common/types";
import { useLock } from "@/context/LockContext";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function StartButton() {
  const { isFileLoaded } = useFile();
  const { currentAlgorithm } = useAlgorithm();
  const {
    solutions,
    tasks,
    setSolutionForAnimation,
    isDataFetchingCompleted,
    updateSolution,
    bestSolution,
    updateSolutionCharts,
    finaliseSolution
  } = useTaskContext();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { isSendable, algorithmParameters  } = useParameters();
  const { lock, setLock } = useLock();

  const { connect } = useWebSocket();

  const canAdvanceFrame = useCallback(
    (nextFrame) => {
      return solutions[nextFrame] !== undefined;
    },
    [solutions]
  );

  const onFrameChange = useCallback(
    (frame: number) => {
      if (solutions[frame]) {
        setSolutionForAnimation(solutions[frame], currentAlgorithm);
        updateSolutionCharts(frame);
      }
    },
    [solutions, setSolutionForAnimation]
  );

  const { play, currentFrame, isPlaying, hasAnimationEnded } = useAnimationEffect({
    initialSpeed: 1.0,
    onFrameChange,
    canAdvanceFrame,
    isDataFetchingCompleted,
    onAnimationStart: () => setLock(true),
    onAnimationEnd: () => setTimeout(() => {
      updateSolution(bestSolution);
      toast.success("Displaying best solution");
      finaliseSolution();
      setLock(false);
    }, 500),
  });

  useEffect(() => {
    if (!isPlaying && !hasAnimationEnded && solutions[currentFrame]) {
      play();
    }
  }, [solutions, isPlaying, play, currentFrame, hasAnimationEnded]);

  const newHandleClick = async () => {
    try {
      let parametersToSend : AlgorithmParameters = algorithmParameters;

      if (currentAlgorithm === "CarlierAlgorithm" || currentAlgorithm === "SchrageAlgorithm") {
        parametersToSend = {
          algorithm: AlgorithmApiNames[currentAlgorithm],
          tasks,
          timeoutDuration: 1,
          parameters: {},
        };
      }

      const response = await startScheduler(parametersToSend);
      if (response) {
        connect(response);
      }
    } catch (error) {
      console.error("Failed to start scheduler:", error);
    }
  };


  return (
    <Button
      startContent={
        isFileLoaded ? (
          <Icon name="play" size={20} color="currentColor" />
        ) : (
          <Icon name="file" size={20} color="currentColor" />
        )
      }
      className="shadow-outer-shadow bg-secondary hover:bg-primary"
      size="lg"
      isDisabled={!isFileLoaded || !isSendable || lock || isPlaying}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={newHandleClick}
    >
    {!isFileLoaded
      ? "Load data first"
      : isHovered
      ? "Start"
      : !isSendable
      ? "Provide parameters first"
      : ""}
    </Button>
  );
}
