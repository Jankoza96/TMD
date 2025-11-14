import type { Task, ViewFilter } from '../types/task';
import { isToday, isFuture, parseISO } from 'date-fns';

export const filterTasks = (tasks: Task[], filter: ViewFilter): Task[] => {
  switch (filter) {
    case 'today':
      return tasks.filter((task) => {
        if (!task.dueDate) return false;
        return isToday(parseISO(task.dueDate));
      });

    case 'upcoming':
      return tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = parseISO(task.dueDate);
        return isFuture(dueDate) || isToday(dueDate);
      });

    case 'completed':
      return tasks.filter((task) => task.status === 'Completed');

    case 'all':
    default:
      return tasks;
  }
};

export const getUniqueTags = (tasks: Task[]): string[] => {
  const tagMap = new Map<string, string>();
  tasks.forEach((task) => {
    task.tags.forEach((tag) => {
      const lowerTag = tag.toLowerCase();
      if (!tagMap.has(lowerTag)) {
        tagMap.set(lowerTag, tag);
      }
    });
  });
  return Array.from(tagMap.values()).sort();
};

export const filterByTag = (tasks: Task[], tag: string | null): Task[] => {
  if (!tag) return tasks;
  const lowerTag = tag.toLowerCase();
  return tasks.filter((task) =>
    task.tags.some((taskTag) => taskTag.toLowerCase() === lowerTag)
  );
};
