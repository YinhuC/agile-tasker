import {
  CreateTaskParams,
  GetTasksParams,
  Task,
  UpdateTaskParams,
} from '../../types/task.types';
import { store } from '..';
import {
  fetchAllTasksThunk,
  createTaskThunk,
  updateTaskThunk,
  deleteTaskThunk,
} from './task.thunks';
import API from '../../api';

vi.mock('../../api', () => ({
  default: {
    task: {
      getAllTasks: vi.fn(),
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

  it('dispatches fetchAllTasksThunk correctly', async () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        name: 'Updated Task',
        description: 'description',
        index: 0,
        createdAt: Date.toString(),
      },
    ];
    const getTasksMock = vi.fn().mockResolvedValue({ data: mockTasks });
    const taskModule = vi.mocked(API.task);
    taskModule.getAllTasks.mockImplementation(getTasksMock);

    const params: GetTasksParams = { categoryId: 1 };

    await store.dispatch(fetchAllTasksThunk(params));

    expect(getTasksMock).toHaveBeenCalledWith(params);
    expect(store.getState().tasks).toEqual({ tasks: mockTasks });
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
});
