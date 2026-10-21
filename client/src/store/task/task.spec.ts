import { CreateTaskParams, UpdateTaskParams } from '../../types/task.types';
import { BoardList } from '../../types/project.types';
import { setupStore, store } from '..';
import { fetchBoardThunk } from '../project/project.thunks';
import {
  createTaskThunk,
  updateTaskThunk,
  deleteTaskThunk,
} from './task.thunks';
import API from '../../api';

vi.mock('../../api', () => ({
  default: {
    project: {
      getBoard: vi.fn(),
    },
    task: {
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    },
  },
}));

describe('Task Thunks', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches createTaskThunk correctly', async () => {
    const params: CreateTaskParams = { name: 'New Task', categoryId: 1 };
    const createTaskMock = vi
      .fn()
      .mockResolvedValue({ data: { id: 1, ...params } });
    const taskModule = vi.mocked(API.task);
    taskModule.createTask.mockImplementation(createTaskMock);

    await store.dispatch(createTaskThunk(params));

    expect(createTaskMock).toHaveBeenCalledWith(params);
    expect(store.getState().tasks).toEqual({
      tasks: [{ id: 1, ...params }],
    });
  });

  it('dispatches updateTaskThunk correctly', async () => {
    const taskId = 1;
    const updatedTask: UpdateTaskParams = {
      id: taskId,
      name: 'Updated Task',
    };

    const updateTaskMock = vi.fn().mockResolvedValue({ data: updatedTask });

    const taskModule = vi.mocked(API.task);
    taskModule.updateTask.mockImplementation(updateTaskMock);

    await store.dispatch(updateTaskThunk(updatedTask));

    expect(updateTaskMock).toHaveBeenCalledWith(updatedTask);
    expect(store.getState().tasks).toEqual({
      tasks: [updatedTask],
    });
  });

  it('fills the tasks from fetchBoardThunk with their list attached', async () => {
    const board: BoardList[] = [
      {
        id: 3,
        name: 'To do',
        index: 0,
        createdAt: 'created',
        tasks: [
          {
            id: 1,
            name: 'Write tests',
            description: 'description',
            index: 0,
            createdAt: 'created',
          },
        ],
      },
    ];
    const getBoardMock = vi.fn().mockResolvedValue({ data: board });
    vi.mocked(API.project).getBoard.mockImplementation(getBoardMock);

    await store.dispatch(fetchBoardThunk('5'));

    expect(getBoardMock).toHaveBeenCalledWith('5');
    expect(store.getState().tasks).toEqual({
      tasks: [
        {
          id: 1,
          name: 'Write tests',
          description: 'description',
          index: 0,
          createdAt: 'created',
          category: { id: 3, name: 'To do', index: 0, createdAt: 'created' },
        },
      ],
    });
  });

  it('dispatches deleteTaskThunk correctly', async () => {
    const taskId = 1;
    const deleteTaskMock = vi.fn().mockResolvedValue({ data: { id: taskId } });
    const taskModule = vi.mocked(API.task);
    taskModule.deleteTask.mockImplementation(deleteTaskMock);

    await store.dispatch(deleteTaskThunk(taskId.toString()));

    expect(deleteTaskMock).toHaveBeenCalledWith(taskId.toString());
    expect(store.getState().tasks).toEqual({ tasks: [] });
  });

  it('clears the cards while fetchBoardThunk loads the next board', () => {
    const boardStore = setupStore({
      tasks: {
        tasks: [
          {
            id: 7,
            name: 'Write tests',
            description: 'description',
            index: 0,
            createdAt: 'created',
          },
        ],
      },
    });

    boardStore.dispatch(fetchBoardThunk.pending('request-1', '6'));

    expect(boardStore.getState().tasks).toEqual({ tasks: [] });
  });
});
