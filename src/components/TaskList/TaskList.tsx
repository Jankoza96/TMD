import { useState, useMemo } from 'react';
import type { Task } from '../../types/task';
import { TaskCard } from './TaskCard';
import { Pagination } from '../ui/Pagination/Pagination';
import styles from './TaskList.module.scss';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStartFocus?: (taskId: string) => void;
  completingTaskId: string | null;
  searchQuery: string;
}

const ITEMS_PER_PAGE = 10;

export const TaskList = ({
  tasks,
  onEdit,
  onComplete,
  onDelete,
  onStartFocus,
  completingTaskId,
  searchQuery,
}: TaskListProps) => {
  const paginationKey = `${searchQuery}-${tasks.length}`;
  const [pageState, setPageState] = useState<{ key: string; page: number }>({
    key: paginationKey,
    page: 1,
  });

  const filteredTasks = useMemo(() => tasks, [tasks]);

  const currentPage = pageState.key !== paginationKey ? 1 : pageState.page;

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const validPage = Math.min(currentPage, Math.max(1, totalPages || 1));

  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setPageState({ key: paginationKey, page });
  };

  if (!filteredTasks.length) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyMessage}>
          {searchQuery ? 'No tasks found matching your search.' : 'No tasks to display.'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.taskList}>
        {currentTasks.map((task) => (
          <TaskCard
            key={task.taskId}
            task={task}
            onEdit={onEdit}
            onComplete={onComplete}
            onDelete={onDelete}
            onStartFocus={onStartFocus}
            isCompleting={completingTaskId === task.taskId}
          />
        ))}
      </div>
      <Pagination
        currentPage={validPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredTasks.length}
      />
    </div>
  );
};

