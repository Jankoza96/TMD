import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCoffee, faRedo } from '@fortawesome/free-solid-svg-icons';
import { useFocusTimer } from '../../hooks/useFocusTimer';
import { BREAK_DURATION, FOCUS_DURATION } from '../../contexts/FocusTimer';
import { Button } from '../ui/Button/Button';
import styles from './TimerCompletionModal.module.scss';

interface TimerCompletionModalProps {
  taskId: string;
  onComplete: () => void;
  onBreak: () => void;
  onContinue: () => void;
  onClose: () => void;
}

export const TimerCompletionModal = ({
  taskId,
  onComplete,
  onBreak,
  onContinue,
  onClose,
}: TimerCompletionModalProps) => {
  const { timerType, startTimer } = useFocusTimer();
  const isFocusComplete = timerType === 'focus';

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleBreak = () => {
    onBreak();
    startTimer(taskId, BREAK_DURATION);
  };

  const handleContinue = () => {
    onContinue();
    startTimer(taskId, FOCUS_DURATION);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            {isFocusComplete ? 'Focus Session Complete!' : 'Break Time Over'}
          </h2>
          <p className={styles.message}>
            {isFocusComplete
              ? 'Great work! You completed a 25-minute focus session. What would you like to do next?'
              : 'Break time is over. Ready to get back to work?'}
          </p>

          {isFocusComplete && (
            <div className={styles.options}>
              <Button
                variant="primary"
                onClick={handleComplete}
                className={styles.optionButton}
              >
                <FontAwesomeIcon icon={faCheck} />
                Mark Task as Complete
              </Button>
              <Button
                variant="secondary"
                onClick={handleBreak}
                className={styles.optionButton}
              >
                <FontAwesomeIcon icon={faCoffee} />
                Take a 5-Min Break
              </Button>
              <Button
                variant="secondary"
                onClick={handleContinue}
                className={styles.optionButton}
              >
                <FontAwesomeIcon icon={faRedo} />
                Continue Working
              </Button>
            </div>
          )}

          {!isFocusComplete && (
            <div className={styles.options}>
              <Button
                variant="primary"
                onClick={handleContinue}
                className={styles.optionButton}
              >
                <FontAwesomeIcon icon={faRedo} />
                Start Another Focus Session
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

