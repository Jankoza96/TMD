import { createContext } from 'react';

export interface UndoAction {
  id: string;
  label: string;
  undo: () => void;
}

export interface UndoContextType {
  showUndo: (action: UndoAction) => void;
}

export const UndoContext = createContext<UndoContextType | undefined>(
  undefined
);
