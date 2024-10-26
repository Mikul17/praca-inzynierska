import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAnimationEffectProps {
  initialSpeed: number;
  totalFrames: number;
  onFrameChange: (frame: number) => void;
  onAnimationEnd?: () => void;
  onAnimationStart?: () => void;
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
  totalFrames,
  initialSpeed,
  onFrameChange,
  onAnimationEnd,
  onAnimationStart
}: UseAnimationEffectProps): UseAnimationEffectReturn => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [isAnimationOver, setIsAnimationOver] = useState<boolean>(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // TODO : Check if -1 should be where is the comment
  const updateFrame = useCallback(async () => {
    setCurrentFrame(prevFrame => {
      const nextFrame = prevFrame + 1;
    
      if (nextFrame >= totalFrames) {
        setIsPlaying(false); 
        onFrameChange(totalFrames);
        setIsAnimationOver(true);

        if (onAnimationEnd) {
          onAnimationEnd();
        }

        return totalFrames;
      }
  
      onFrameChange(nextFrame);
  
      return nextFrame;
    });
  
    // Wait for the task changes to complete before continuing
    await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust this value if needed
  }, [totalFrames, onFrameChange]);

  const play = useCallback(() => {
    if(isAnimationOver){
      reset();
    }

    if (onAnimationStart) {
      onAnimationStart();
    }
    
    setIsPlaying(true);
    setIsAnimationOver(false);
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