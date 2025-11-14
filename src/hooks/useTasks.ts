import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../services/api';
import type { TaskFormData } from '../types/task';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll
  });
};

export const useTask = (taskId: string | null) => {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => (taskId ? taskApi.getById(taskId) : null),
    enabled: !!taskId
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: TaskFormData) => taskApi.create(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      taskData
    }: {
      taskId: string;
      taskData: Partial<TaskFormData>;
    }) => taskApi.update(taskId, taskData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', data.taskId] });
    }
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskApi.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};
