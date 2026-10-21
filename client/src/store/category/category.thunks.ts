import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';
import {
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../../types/category.types';

export const createCategoryThunk = createAsyncThunk(
  'categories/create',
  (params: CreateCategoryParams) => API.category.createCategory(params)
);

export const updateCategoryThunk = createAsyncThunk(
  'categories/update',
  (params: UpdateCategoryParams) => API.category.updateCategory(params)
);

export const deleteCategoryThunk = createAsyncThunk(
  'categories/delete',
  (id: string) => API.category.deleteCategory(id)
);
