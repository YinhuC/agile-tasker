import { Category } from './category.types';
import { Group } from './group.types';
import { Task } from './task.types';

export type GetProjectsParams = {
  groupId: number;
};

export type CreateProjectParams = {
  name: string;
  description?: string;
  groupId: number;
};

export type UpdateProjectParams = {
  id: number;
  name?: string;
  description?: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  group?: Group;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
};

export type BoardList = Category & { tasks: Task[] };
