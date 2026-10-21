import { createSlice } from '@reduxjs/toolkit';
import { Project } from '../../types/project.types';
import {
  createProjectThunk,
  deleteProjectThunk,
  fetchProjectThunk,
  fetchAllProjectsThunk,
  updateProjectThunk,
} from './project.thunks';
import { sortByUpdateTime } from '../../utils/sort.utils';

export interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: [],
};

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllProjectsThunk.fulfilled, (state, action) => {
      const { groupId } = action.meta.arg;
      const fetchedProjects = action.payload.data;
      const otherProjects = state.projects.filter(
        (project) =>
          project.group?.id !== groupId &&
          !fetchedProjects.some((fetched) => fetched.id === project.id)
      );

      state.projects = sortByUpdateTime([...otherProjects, ...fetchedProjects]);
    });

    builder.addCase(fetchProjectThunk.fulfilled, (state, action) => {
      const fetchedProject = action.payload.data;
      const existingProjetIndex = state.projects.findIndex(
        (project) => project.id === fetchedProject.id
      );
      if (existingProjetIndex !== -1) {
        state.projects[existingProjetIndex] = fetchedProject;
      } else {
        state.projects.push(fetchedProject);
      }
      state.projects = sortByUpdateTime(state.projects);
    });

    builder.addCase(createProjectThunk.fulfilled, (state, action) => {
      state.projects.unshift(action.payload.data);
    });

    builder.addCase(updateProjectThunk.fulfilled, (state, action) => {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.data.id
      );
      if (index !== -1) {
        state.projects[index] = action.payload.data;
      }
      state.projects = sortByUpdateTime(state.projects);
    });

    builder.addCase(deleteProjectThunk.fulfilled, (state, action) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload.data.id
      );
      state.projects = sortByUpdateTime(state.projects);
    });
  },
});

export default projectSlice.reducer;
