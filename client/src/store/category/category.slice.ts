import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Category } from '../../types/category.types';
import {
  createCategoryThunk,
  deleteCategoryThunk,
  updateCategoryThunk,
} from './category.thunks';
import { fetchBoardThunk } from '../project/project.thunks';
import { sortByIndex } from '../../utils/sort.utils';

export interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    updateAllCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = sortByIndex(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardThunk.pending, (state) => {
      state.categories = [];
    });

    builder.addCase(fetchBoardThunk.fulfilled, (state, action) => {
      state.categories = action.payload.data.map(
        ({ tasks, ...category }) => category
      );
    });

    builder.addCase(createCategoryThunk.fulfilled, (state, action) => {
      state.categories.push(action.payload.data);
    });

    builder.addCase(updateCategoryThunk.fulfilled, (state, action) => {
      const index = state.categories.findIndex(
        (category) => category.id === action.payload.data.id
      );
      if (index !== -1) {
        state.categories[index] = action.payload.data;
      }
    });

    builder.addCase(deleteCategoryThunk.fulfilled, (state, action) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload.data.id
      );
    });
  },
});

export const { updateAllCategories } = categorySlice.actions;

export default categorySlice.reducer;
