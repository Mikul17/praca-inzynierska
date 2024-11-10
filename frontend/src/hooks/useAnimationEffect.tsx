"use client";
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAnimationEffectProps {
  initialSpeed: number;
  onFrameChange: (frame: number) => void;
  onAnimationEnd?: () => void;
  onAnimationStart?: () => void;
  canAdvanceFrame?: (frame: number) => boolean;
}

interface UseAnimationEffectReturn {
  currentFrame: number;
  isPlaying: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
}

const useAnimationEffect = ({
  initialSpeed,
  onFrameChange,
  onAnimationEnd,
  onAnimationStart,
  canAdvanceFrame,
}: UseAnimationEffectProps): UseAnimationEffectReturn => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(initialSpeed);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onFrameChange(currentFrame);
  }, [currentFrame, onFrameChange]);

  const updateFrame = useCallback(() => {
    setCurrentFrame((prevFrame) => {
      const nextFrame = prevFrame + 1;
  
      if (canAdvanceFrame && !canAdvanceFrame(nextFrame)) {
        if (onAnimationEnd) {
          onAnimationEnd();
        }
        setIsPlaying(false);
        return prevFrame;
      }
  
      if (nextFrame > 200) {
        if (onAnimationEnd) {
          onAnimationEnd();
        }
        setIsPlaying(false);
        return prevFrame;
      }
  
      return nextFrame;
    });
  }, [canAdvanceFrame, onAnimationEnd]);

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
  }, [onAnimationStart]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentFrame(0);
    setIsPlaying(false);
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
  };
};

export default useAnimationEffect;