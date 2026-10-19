import { combineReducers, configureStore } from '@reduxjs/toolkit';
import groupReducer from './group/group.slice';
import projectReducer from './project/project.slice';
import categoryReducer from './category/category.slice';
import taskReducer from './task/task.slice';

export const rootReducer = combineReducers({
  groups: groupReducer,
  projects: projectReducer,
  categories: categoryReducer,
  tasks: taskReducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
    devTools: true,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export const store = setupStore();
