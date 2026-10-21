import { createSlice } from '@reduxjs/toolkit';
import { Group } from '../../types/group.types';
import {
  createGroupThunk,
  deleteGroupThunk,
  fetchAllGroupsThunk,
  updateGroupThunk,
} from './group.thunks';
import { sortByCreateTime } from '../../utils/sort.utils';

export interface GroupState {
  groups: Group[];
}

const initialState: GroupState = {
  groups: [],
};

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllGroupsThunk.fulfilled, (state, action) => {
      state.groups = sortByCreateTime(action.payload.data);
    });

    builder.addCase(createGroupThunk.fulfilled, (state, action) => {
      state.groups.unshift(action.payload.data);
      state.groups = sortByCreateTime(state.groups);
    });

    builder.addCase(updateGroupThunk.fulfilled, (state, action) => {
      const index = state.groups.findIndex(
        (group) => group.id === action.payload.data.id
      );
      if (index !== -1) {
        state.groups[index] = action.payload.data;
      }
    });

    builder.addCase(deleteGroupThunk.fulfilled, (state, action) => {
      state.groups = state.groups.filter(
        (group) => group.id !== action.payload.data.id
      );
    });
  },
});

export default groupSlice.reducer;
