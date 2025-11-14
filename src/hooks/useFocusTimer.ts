import { useContext } from 'react';
import { FocusTimerContext } from '../contexts/focusTimer.types';

export const useFocusTimer = () => {
  const context = useContext(FocusTimerContext);
  if (!context) {
    throw new Error('useFocusTimer must be used within FocusTimerProvider');
  }
  return context;
};
