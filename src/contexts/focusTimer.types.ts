import { createContext } from 'react';

export interface FocusTimerContextType {
  startTimer: (taskId: string, duration: number) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  currentTaskId: string | null;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  timerType: 'focus' | 'break' | null;
}

export const FocusTimerContext = createContext<
  FocusTimerContextType | undefined
>(undefined);
