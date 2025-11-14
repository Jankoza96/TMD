import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useFocusTimer } from '../../hooks/useFocusTimer';
import styles from './FocusTimer.module.scss';

interface FocusTimerProps {
  onComplete: () => void;
  onBreakComplete: () => void;
}

const formatTime = (minutes: number, seconds: number): string => {
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};

export const FocusTimer = ({ onComplete, onBreakComplete }: FocusTimerProps) => {
  const {
    currentTaskId,
    timeRemaining,
    isRunning,
    isPaused,
    timerType,
    pauseTimer,
    resumeTimer,
    stopTimer,
  } = useFocusTimer();

  useEffect(() => {
    if (timeRemaining === 0 && isRunning === false && timerType === 'focus' && currentTaskId) {
      onComplete();
    } else if (timeRemaining === 0 && isRunning === false && timerType === 'break' && currentTaskId) {
      onBreakComplete();
    }
  }, [timeRemaining, isRunning, timerType, currentTaskId, onComplete, onBreakComplete]);

  if (!currentTaskId) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = timerType === 'focus'
    ? ((25 * 60 - timeRemaining) / (25 * 60)) * 100
    : ((5 * 60 - timeRemaining) / (5 * 60)) * 100;

  return (
    <div className={styles.timerOverlay}>
      <div className={styles.timerContainer}>
        <button
          className={styles.closeButton}
          onClick={stopTimer}
          aria-label="Close timer"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className={styles.timerContent}>
          <div className={styles.timerType}>
            {timerType === 'focus' ? 'Focus Session' : 'Break Time'}
          </div>

          <div className={styles.timerCircle}>
            <svg className={styles.timerSvg} viewBox="0 0 100 100">
              <circle
                className={styles.timerBackground}
                cx="50"
                cy="50"
                r="45"
              />
              <circle
                className={`${styles.timerProgress} ${styles[timerType || 'focus']}`}
                cx="50"
                cy="50"
                r="45"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              />
            </svg>
            <div className={styles.timerDisplay}>
              {formatTime(minutes, seconds)}
            </div>
          </div>

          <div className={styles.timerControls}>
            {isPaused ? (
              <button
                className={styles.controlButton}
                onClick={resumeTimer}
                aria-label="Resume timer"
              >
                <FontAwesomeIcon icon={faPlay} />
                Resume
              </button>
            ) : (
              <button
                className={styles.controlButton}
                onClick={pauseTimer}
                aria-label="Pause timer"
                disabled={!isRunning}
              >
                <FontAwesomeIcon icon={faPause} />
                Pause
              </button>
            )}
            <button
              className={styles.controlButton}
              onClick={stopTimer}
              aria-label="Stop timer"
            >
              <FontAwesomeIcon icon={faStop} />
              Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

