"use client";
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAnimationEffectProps {
  initialSpeed: number;
  onFrameChange: (frame: number) => void;
  onAnimationEnd?: () => void;
  onAnimationStart?: () => void;
  canAdvanceFrame?: (frame: number) => boolean;
  isDataFetchingCompleted?: boolean;
}

interface UseAnimationEffectReturn {
  currentFrame: number;
  isPlaying: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
  hasAnimationEnded: boolean;
}

const useAnimationEffect = ({
  initialSpeed,
  onFrameChange,
  onAnimationEnd,
  onAnimationStart,
  canAdvanceFrame,
  isDataFetchingCompleted,
}: UseAnimationEffectProps): UseAnimationEffectReturn => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [hasAnimationEnded, setHasAnimationEnded] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateFrame = useCallback(() => {
    setCurrentFrame((prevFrame) => {
      const nextFrame = prevFrame + 1;

      if (canAdvanceFrame && !canAdvanceFrame(nextFrame)) {
        if (isDataFetchingCompleted) {
          setIsPlaying(false);
          setHasAnimationEnded(true);
          if (onAnimationEnd) {
            onAnimationEnd();
          }
        }
        return prevFrame;
      }


      onFrameChange(nextFrame);

      return nextFrame;
    });
  }, [canAdvanceFrame, isDataFetchingCompleted, onAnimationEnd, onFrameChange]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateFrame, 1000 / speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, updateFrame]);

  const play = useCallback(() => {
    if (onAnimationStart) {
      onAnimationStart();
    }
    setIsPlaying(true);

    onFrameChange(currentFrame);
  }, [onAnimationStart, onFrameChange, currentFrame]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (onAnimationEnd) {
      onAnimationEnd();
    }
  }, [onAnimationEnd]);

  const reset = useCallback(() => {
    setCurrentFrame(0);
    setIsPlaying(false);
    setHasAnimationEnded(false);
    onFrameChange(0);
  }, [onFrameChange]);

  return {
    currentFrame,
    isPlaying,
    speed,
    play,
    pause,
    setSpeed,
    reset,
    hasAnimationEnded,
  };
};

export default useAnimationEffect;
