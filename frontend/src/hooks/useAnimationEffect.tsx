import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAnimationEffectProps {
  initialSpeed: number;
  totalFrames: number;
  taskOrders: number[][];
  onFrameChange: (frame: number) => void;
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
  taskOrders,
  totalFrames,
  initialSpeed,
  onFrameChange
}: UseAnimationEffectProps): UseAnimationEffectReturn => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(initialSpeed);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);


  const updateFrame = useCallback(() => {
    setCurrentFrame(prevFrame => {
      const nextFrame = (prevFrame + 1) % totalFrames;
      onFrameChange(nextFrame);
      return nextFrame;
    });
  }, [totalFrames, onFrameChange]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentFrame(0);
    setIsPlaying(false);
    onFrameChange(0);
  }, [onFrameChange]);


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