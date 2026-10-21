import {
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
} from './category.thunks';
import { setupStore, store } from '..';
import { fetchBoardThunk } from '../project/project.thunks';
import { BoardList } from '../../types/project.types';
import {
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../../types/category.types';
import API from '../../api';

vi.mock('../../api', () => ({
  default: {
    project: {
      getBoard: vi.fn(),
    },
    category: {
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    },
  },
}));

describe('Async Thunks', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches createCategoryThunk correctly', async () => {
    const params: CreateCategoryParams = { name: 'New Category', projectId: 1 };
    const createCategoryMock = vi
      .fn()
      .mockResolvedValue({ data: { id: 1, ...params } });
    const categoryModule = vi.mocked(API.category);
    categoryModule.createCategory.mockImplementation(createCategoryMock);

    await store.dispatch(createCategoryThunk(params));

    expect(createCategoryMock).toHaveBeenCalledWith(params);
    expect(store.getState().categories).toEqual({
      categories: [{ id: 1, ...params }],
    });
  });

  it('dispatches updateCategoryThunk correctly', async () => {
    const categoryId = '1';
    const updatedCategory: UpdateCategoryParams = {
      id: parseInt(categoryId),
      name: 'Updated Category',
    };

    const updateCategoryMock = vi
      .fn()
      .mockResolvedValue({ data: updatedCategory });

    const categoryModule = vi.mocked(API.category);
    categoryModule.updateCategory.mockImplementation(updateCategoryMock);

    await store.dispatch(updateCategoryThunk(updatedCategory));

    expect(updateCategoryMock).toHaveBeenCalledWith(updatedCategory);
    expect(store.getState().categories).toEqual({
      categories: [updatedCategory],
    });
  });

  it('dispatches deleteCategoryThunk correctly', async () => {
    const params: CreateCategoryParams = { name: 'New Category', projectId: 1 };
    const categoryId = '1';
    const deleteCategoryMock = vi
      .fn()
      .mockResolvedValue({ data: { id: parseInt(categoryId), ...params } });
    const categoryModule = vi.mocked(API.category);
    categoryModule.deleteCategory.mockImplementation(deleteCategoryMock);

    await store.dispatch(deleteCategoryThunk(categoryId));

    expect(deleteCategoryMock).toHaveBeenCalledWith(categoryId);
    expect(store.getState().categories).toEqual({
      categories: [],
    });
  });

  it('fills the lists from fetchBoardThunk without their cards', async () => {
    const board: BoardList[] = [
      {
        id: 3,
        name: 'To do',
        index: 0,
        createdAt: 'created',
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
      { id: 4, name: 'Done', index: 1, createdAt: 'created', tasks: [] },
    ];
    const getBoardMock = vi.fn().mockResolvedValue({ data: board });
    vi.mocked(API.project).getBoard.mockImplementation(getBoardMock);

    await store.dispatch(fetchBoardThunk('5'));

    expect(getBoardMock).toHaveBeenCalledWith('5');
    expect(store.getState().categories).toEqual({
      categories: [
        { id: 3, name: 'To do', index: 0, createdAt: 'created' },
        { id: 4, name: 'Done', index: 1, createdAt: 'created' },
      ],
    });
  });

  it('clears the lists while fetchBoardThunk loads the next board', () => {
    const boardStore = setupStore({
      categories: {
        categories: [{ id: 3, name: 'To do', index: 0, createdAt: 'created' }],
      },
    });

    boardStore.dispatch(fetchBoardThunk.pending('request-1', '6'));

    expect(boardStore.getState().categories).toEqual({ categories: [] });
  });
});
