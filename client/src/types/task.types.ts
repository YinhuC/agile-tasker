import { Category } from './category.types';
import { User } from './user.types';

export type CreateTaskParams = {
  name: string;
  description?: string;
  categoryId: number;
};

export type UpdateTaskParams = {
  id: number;
  name?: string;
  description?: string;
  index?: number;
  categoryId?: number;
};

export type Task = {
  id: number;
  name: string;
  description: string;
  index: number;
  category?: Category;
  createdAt: string;
  user?: User;
};
