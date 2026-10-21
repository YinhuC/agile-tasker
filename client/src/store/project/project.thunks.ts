import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';
import {
  BoardList,
  CreateProjectParams,
  GetProjectsParams,
  Project,
  UpdateProjectParams,
} from '../../types/project.types';

export interface FetchAllProjectsPayload {
  data: Project[];
}

export interface FetchProjectPayload {
  data: Project;
}

export const fetchAllProjectsThunk = createAsyncThunk<
  FetchAllProjectsPayload,
  GetProjectsParams
>('projects/fetch/all', (params: GetProjectsParams) => {
  return API.project.getAllProjects(params);
});

export const fetchProjectThunk = createAsyncThunk<FetchProjectPayload, string>(
  'projects/fetch',
  (id: string) => API.project.getProject(id)
);

export interface FetchBoardPayload {
  data: BoardList[];
}

export const fetchBoardThunk = createAsyncThunk<FetchBoardPayload, string>(
  'projects/fetch/board',
  (id: string) => API.project.getBoard(id)
);

export const createProjectThunk = createAsyncThunk(
  'projects/create',
  (params: CreateProjectParams) => API.project.createProject(params)
);

export const updateProjectThunk = createAsyncThunk(
  'projects/update',
  (params: UpdateProjectParams) => API.project.updateProject(params)
);

export const deleteProjectThunk = createAsyncThunk(
  'projects/delete',
  (id: string) => API.project.deleteProject(id)
);
