import { Group } from './group.types';

export type User = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  createdAt: string;
  updatedAt: string;
  groups?: Group[];
};
