import { useContext } from 'react';
import { UndoContext } from '../contexts/undoContext.types';

export const useUndo = () => {
  const context = useContext(UndoContext);
  if (!context) {
    throw new Error('useUndo must be used within UndoProvider');
  }
  return context;
};
