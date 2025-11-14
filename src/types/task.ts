export type TaskPriority = 'Normal' | 'Low' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  taskId: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  id?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
}

export type ViewFilter = 'today' | 'upcoming' | 'completed' | 'all';
export type ViewMode = 'list' | 'calendar';
