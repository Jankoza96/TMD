import type { Task } from '../../types/task';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { formatDueDateCountdown } from '../../utils/dateCountdown';
import { parseISO, isPast, isToday } from 'date-fns';
import { Tag } from '../ui/Tag/Tag';
import { Button } from '../ui/Button/Button';
import { FocusButton } from '../FocusButton/FocusButton';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStartFocus?: (taskId: string) => void;
  isCompleting?: boolean;
}

export const TaskCard = ({
  task,
  onEdit,
  onComplete,
  onDelete,
  onStartFocus,
  isCompleting = false,
}: TaskCardProps) => {
  const priorityColor = task.priority === 'High' ? 'high' : task.priority === 'Low' ? 'low' : 'normal';

  const isOverdue = task.dueDate && !isToday(parseISO(task.dueDate)) && isPast(parseISO(task.dueDate));
  const countdownText = task.dueDate ? formatDueDateCountdown(task.dueDate) : null;

  const handleClick = () => {
    onEdit(task);
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task);
  };

  return (
    <div
      className={`${styles.taskCard} ${styles[task.status.toLowerCase().replace(' ', '-')]} ${isCompleting ? styles.completing : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Task: ${task.title}`}
    >
      <div className={`${styles.priorityBar} ${styles[priorityColor]}`} />
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{task.title}</h3>
          {task.dueDate && countdownText && (
            <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''}`}>
              <FontAwesomeIcon icon={faCalendar} /> {countdownText}
            </span>
          )}
        </div>
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}
        <div className={styles.footer}>
          <div className={styles.tags}>
            {task.tags.map((tag) => (
              <Tag key={tag} variant="default">
                {tag}
              </Tag>
            ))}
          </div>
          <div className={styles.actions}>
            {task.status !== 'Completed' && onStartFocus && (
              <FocusButton taskId={task.taskId} onStartFocus={onStartFocus} />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComplete}
              disabled={task.status === 'Completed'}
            >
              Mark Complete
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>
      {isCompleting && (
        <div className={styles.checkmarkOverlay}>
          <FontAwesomeIcon icon={faCheck} className={styles.checkmark} />
        </div>
      )}
    </div>
  );
};

