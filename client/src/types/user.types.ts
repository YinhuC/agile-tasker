import { Group } from './group.types';

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  Groups?: Group[];
};
