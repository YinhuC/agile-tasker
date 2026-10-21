import {
  BoardList,
  CreateProjectParams,
  GetProjectsParams,
  Project,
  UpdateProjectParams,
} from '../types/project.types';
import { axiosClient } from './client.api';

export const getAllProjects = (data: GetProjectsParams) =>
  axiosClient.post<Project[]>('/projects/all', data);

export const getProject = (id: string) => axiosClient.get(`/projects/${id}`);

export const getBoard = (id: string) =>
  axiosClient.get<BoardList[]>(`/projects/${id}/board`);

export const createProject = (data: CreateProjectParams) =>
  axiosClient.post<Project>('/projects', data);

export const updateProject = ({ id, ...data }: UpdateProjectParams) =>
  axiosClient.put<Project>(`/projects/${id}`, data);

export const deleteProject = (id: string) =>
  axiosClient.delete(`/projects/${id}`);
