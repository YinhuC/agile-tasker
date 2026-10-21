import { Group } from './group.interface';

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
  authMethod?: string;
  createdAt?: Date;
  updatedAt?: Date;
  groups?: Group[];
}
