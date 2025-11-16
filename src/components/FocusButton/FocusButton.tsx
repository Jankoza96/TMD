import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useFocusTimer } from '../../hooks/useFocusTimer';
import { FOCUS_DURATION } from '../../contexts/FocusTimer';
import styles from './FocusButton.module.scss';

interface FocusButtonProps {
  taskId: string;
  onStartFocus: (taskId: string) => void;
}

export const FocusButton = ({ taskId, onStartFocus }: FocusButtonProps) => {
  const { startTimer, currentTaskId } = useFocusTimer();
  const isActive = currentTaskId === taskId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTimer(taskId, FOCUS_DURATION);
    onStartFocus(taskId);
  };

  return (
    <div className={styles.focusButtonWrapper}>
      <button
        className={`${styles.focusButton} ${isActive ? styles.active : ''}`}
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faPlay} />
        <span>Start Focus</span>
      </button>
      <div className={styles.tooltip}>
        <strong>Pomodoro Technique</strong>
        <p>Work in focused 25-minute intervals followed by 5-minute breaks. This helps maintain deep concentration and prevents burnout.</p>
      </div>
    </div>
  );
};

