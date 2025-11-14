import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { FocusTimerContext } from './focusTimer.types';

export const FOCUS_DURATION = 25 * 60;
export const BREAK_DURATION = 5 * 60;

export const FocusTimerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timerType, setTimerType] = useState<'focus' | 'break' | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeRemaining]);

  const startTimer = useCallback((taskId: string, duration: number = FOCUS_DURATION) => {
    setCurrentTaskId(taskId);
    setTimeRemaining(duration);
    setIsRunning(true);
    setIsPaused(false);
    setTimerType(duration === FOCUS_DURATION ? 'focus' : 'break');
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(0);
    setCurrentTaskId(null);
    setTimerType(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    if (timeRemaining > 0) {
      setIsPaused(false);
      setIsRunning(true);
    }
  }, [timeRemaining]);

  return (
    <FocusTimerContext.Provider
      value={{
        startTimer,
        stopTimer,
        pauseTimer,
        resumeTimer,
        currentTaskId,
        timeRemaining,
        isRunning,
        isPaused,
        timerType,
      }}
    >
      {children}
    </FocusTimerContext.Provider>
  );
};

