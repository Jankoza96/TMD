import type { Task } from '../types/task';
import { isToday, parseISO } from 'date-fns';

export type FocusLoadLevel = 'low' | 'medium' | 'high';

export interface FocusLoadData {
  level: FocusLoadLevel;
  count: number;
  highPriorityCount: number;
}

/**
 * Calculates the focus load for today's tasks
 * Green (Low): 2-3 Normal tasks
 * Yellow (Medium): 4+ Normal/High tasks
 * Red (High): Multiple High priority or 6+ tasks
 */
export const calculateTodayFocusLoad = (tasks: Task[]): FocusLoadData => {
  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === 'Completed') return false;
    return isToday(parseISO(task.dueDate));
  });

  const count = todayTasks.length;
  const highPriorityCount = todayTasks.filter(
    (task) => task.priority === 'High'
  ).length;

  let level: FocusLoadLevel = 'low';

  if (count >= 6 || highPriorityCount >= 2) {
    level = 'high';
  } else if (count >= 4 || highPriorityCount >= 1) {
    level = 'medium';
  } else if (count >= 2) {
    level = 'low';
  }

  return {
    level,
    count,
    highPriorityCount
  };
};
