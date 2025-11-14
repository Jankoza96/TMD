import type { Task, TaskFormData } from '../types/task';

const API_BASE_URL = 'http://localhost:3001';

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  getById: async (taskId: string): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks?taskId=${taskId}`);
    if (!response.ok) throw new Error('Failed to fetch task');
    const tasks: Task[] = await response.json();
    const task = tasks[0];
    if (!task) throw new Error('Task not found');
    return task;
  },

  create: async (taskData: TaskFormData): Promise<Task> => {
    const newTask: Task = {
      taskId: crypto.randomUUID(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });

    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  update: async (
    taskId: string,
    taskData: Partial<TaskFormData>
  ): Promise<Task> => {
    const existingTask = await taskApi.getById(taskId);
    const updatedTask: Task = {
      ...existingTask,
      ...taskData,
      updatedAt: new Date().toISOString()
    };

    // Find the id field for JSON Server
    const id = existingTask.id;
    if (!id) throw new Error('Task id not found');

    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    });

    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  delete: async (taskId: string): Promise<void> => {
    // First get the task to find its id
    const task = await taskApi.getById(taskId);
    const id = task.id;
    if (!id) throw new Error('Task id not found');

    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete task');
  }
};
