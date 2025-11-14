import {
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isPast,
  isToday,
  isFuture
} from 'date-fns';

/**
 * Formats a due date as a dynamic countdown
 * Examples:
 * - "Due in 2 Days"
 * - "Due in 5 Hours"
 * - "Due in 30 Minutes"
 * - "Due Today"
 * - "Overdue by 12 Hours"
 * - "Overdue by 3 Days"
 */
export const formatDueDateCountdown = (
  dueDate: string | null
): string | null => {
  if (!dueDate) return null;

  const due = parseISO(dueDate);
  const now = new Date();

  if (isToday(due)) {
    return 'Due Today';
  }

  if (isPast(due)) {
    const daysOverdue = differenceInDays(now, due);
    const hoursOverdue = differenceInHours(now, due);

    if (daysOverdue >= 1) {
      return `Overdue by ${daysOverdue} ${daysOverdue === 1 ? 'Day' : 'Days'}`;
    } else if (hoursOverdue >= 1) {
      return `Overdue by ${hoursOverdue} ${
        hoursOverdue === 1 ? 'Hour' : 'Hours'
      }`;
    } else {
      const minutesOverdue = differenceInMinutes(now, due);
      return `Overdue by ${minutesOverdue} ${
        minutesOverdue === 1 ? 'Minute' : 'Minutes'
      }`;
    }
  }

  if (isFuture(due)) {
    const daysUntil = differenceInDays(due, now);
    const hoursUntil = differenceInHours(due, now);

    if (daysUntil >= 1) {
      return `Due in ${daysUntil} ${daysUntil === 1 ? 'Day' : 'Days'}`;
    } else if (hoursUntil >= 1) {
      return `Due in ${hoursUntil} ${hoursUntil === 1 ? 'Hour' : 'Hours'}`;
    } else {
      const minutesUntil = differenceInMinutes(due, now);
      return `Due in ${minutesUntil} ${
        minutesUntil === 1 ? 'Minute' : 'Minutes'
      }`;
    }
  }

  return 'Due Today';
};
