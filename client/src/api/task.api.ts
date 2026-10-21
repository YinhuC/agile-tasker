import { CreateTaskParams, Task, UpdateTaskParams } from '../types/task.types';
import { axiosClient } from './client.api';

export const createTask = (data: CreateTaskParams) =>
  axiosClient.post<Task>('/tasks', data);

export const updateTask = ({ id, ...data }: UpdateTaskParams) =>
  axiosClient.put<Task>(`/tasks/${id}`, data);

export const deleteTask = (id: string) => axiosClient.delete(`/tasks/${id}`);
