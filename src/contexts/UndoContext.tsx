import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { UndoContext, type UndoAction } from './undoContext.types';

export const UndoProvider = ({ children }: { children: ReactNode }) => {
  const [currentAction, setCurrentAction] = useState<UndoAction | null>(null);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const showUndo = useCallback((action: UndoAction) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setCurrentAction(action);

    const id = setTimeout(() => {
      setCurrentAction(null);
    }, 5000);

    setTimeoutId(id);
  }, [timeoutId]);

  const handleUndo = useCallback(() => {
    if (currentAction) {
      currentAction.undo();
      setCurrentAction(null);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }, [currentAction, timeoutId]);

  const handleDismiss = useCallback(() => {
    setCurrentAction(null);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }, [timeoutId]);

  return (
    <UndoContext.Provider value={{ showUndo }}>
      {children}
      {currentAction && (
        <div className="undo-notification" role="alert">
          <span>{currentAction.label}</span>
          <div className="undo-actions">
            <button onClick={handleUndo} className="undo-button">
              Undo
            </button>
            <button onClick={handleDismiss} className="dismiss-button" aria-label="Dismiss">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}
    </UndoContext.Provider>
  );
};
