import { CreateGroupParams, UpdateGroupParams } from '../../types/group.types';
import { store } from '..';
import {
  fetchAllGroupsThunk,
  createGroupThunk,
  updateGroupThunk,
  deleteGroupThunk,
} from './group.thunks';
import API from '../../api';

vi.mock('../../api', () => ({
  default: {
    group: {
      getGroups: vi.fn(),
      createGroup: vi.fn(),
      updateGroup: vi.fn(),
      deleteGroup: vi.fn(),
    },
  },
}));

describe('Group Thunks', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches createGroupThunk correctly', async () => {
    const params: CreateGroupParams = { name: 'New Group' };
    const createGroupMock = vi
      .fn()
      .mockResolvedValue({ data: { id: 1, ...params } });
    const groupModule = vi.mocked(API.group);
    groupModule.createGroup.mockImplementation(createGroupMock);

    await store.dispatch(createGroupThunk(params));

    expect(createGroupMock).toHaveBeenCalledWith(params);
    expect(store.getState().groups).toEqual({
      groups: [{ id: 1, ...params }],
    });
  });

  it('dispatches updateGroupThunk correctly', async () => {
    const groupId = 1;
    const updatedGroup: UpdateGroupParams = {
      id: groupId,
      name: 'Updated Group',
    };

    const updateGroupMock = vi.fn().mockResolvedValue({ data: updatedGroup });

    const groupModule = vi.mocked(API.group);
    groupModule.updateGroup.mockImplementation(updateGroupMock);

    await store.dispatch(updateGroupThunk(updatedGroup));

    expect(updateGroupMock).toHaveBeenCalledWith(updatedGroup);
    expect(store.getState().groups).toEqual({
      groups: [updatedGroup],
    });
  });

  it('dispatches fetchAllGroupsThunk correctly', async () => {
    const groups = [
      {
        id: 1,
        name: 'Updated Group',
      },
    ];
    const getGroupsMock = vi.fn().mockResolvedValue({ data: groups });
    const groupModule = vi.mocked(API.group);
    groupModule.getGroups.mockImplementation(getGroupsMock);

    await store.dispatch(fetchAllGroupsThunk());

    expect(getGroupsMock).toHaveBeenCalled();
    expect(store.getState().groups).toEqual({ groups: groups });
  });

  it('dispatches deleteGroupThunk correctly', async () => {
    const groupId = 1;
    const deleteGroupMock = vi
      .fn()
      .mockResolvedValue({ data: { id: groupId } });
    const groupModule = vi.mocked(API.group);
    groupModule.deleteGroup.mockImplementation(deleteGroupMock);

    await store.dispatch(deleteGroupThunk(groupId.toString()));

    expect(deleteGroupMock).toHaveBeenCalledWith(groupId.toString());
    expect(store.getState().groups).toEqual({
      groups: [],
    });
  });
});
