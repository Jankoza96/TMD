import type { Task, ViewFilter } from '../../types/task';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday, parseISO, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './Calendar.module.scss';

interface CalendarProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  searchQuery: string;
  currentFilter: ViewFilter;
}

export const Calendar = ({ tasks, onTaskClick, currentFilter }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const filteredTasks = tasks;

  const getTasksForDay = (day: Date) => {
    return filteredTasks.filter((task) => {
      if (
        !task.dueDate ||
        (task.status === 'Completed' && currentFilter !== 'completed')
      )
        return false;
      return isSameDay(parseISO(task.dueDate), day);
    });
  };

  const getPriorityColor = (priority: string) => priority.toLowerCase();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={goToPreviousMonth} className={styles.navButton} aria-label="Previous month">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className={styles.monthTitle}>{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={goToNextMonth} className={styles.navButton} aria-label="Next month">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <button onClick={goToToday} className={styles.todayButton}>
          Today
        </button>
      </div>

      <div className={styles.calendarGrid}>
        <div className={styles.weekdayHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {days.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`${styles.dayCell} ${!isCurrentMonth ? styles.otherMonth : ''} ${isCurrentDay ? styles.today : ''}`}
              >
                <div className={styles.dayNumber}>{format(day, 'd')}</div>
                <div className={styles.tasksList}>
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.taskId}
                      className={`${styles.taskItem} ${styles[getPriorityColor(task.priority)]}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                      title={task.title}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onTaskClick(task);
                        }
                      }}
                    >
                      <span className={styles.taskTitle}>{task.title}</span>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <span className={styles.moreTasks}>+{dayTasks.length - 3}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

