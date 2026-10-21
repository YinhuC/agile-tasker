import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Task } from '../../types/task.types';
import {
  createTaskThunk,
  deleteTaskThunk,
  updateTaskThunk,
} from './task.thunks';
import { fetchBoardThunk } from '../project/project.thunks';
import { sortByIndex } from '../../utils/sort.utils';

export interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    updateAllTasks: (state, action: PayloadAction<Task[]>) => {
      const newTasks = action.payload;

      newTasks.forEach((newTask) => {
        const existingTaskIndex = state.tasks.findIndex(
          (task) => task.id === newTask.id
        );

        if (existingTaskIndex !== -1) {
          state.tasks[existingTaskIndex] = newTask;
        } else {
          state.tasks.push(newTask);
        }
      });

      state.tasks = sortByIndex(state.tasks);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardThunk.fulfilled, (state, action) => {
      state.tasks = action.payload.data.flatMap(({ tasks, ...category }) =>
        tasks.map((task) => ({ ...task, category }))
      );
    });

    builder.addCase(createTaskThunk.fulfilled, (state, action) => {
      state.tasks.push(action.payload.data);
    });

    builder.addCase(updateTaskThunk.fulfilled, (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.data.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload.data;
      }
    });

    builder.addCase(deleteTaskThunk.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter(
        (task) => task.id !== action.payload.data.id
      );
    });
  },
});

export const { updateAllTasks } = taskSlice.actions;

export default taskSlice.reducer;
