import {
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
} from './category.thunks';
import { store } from '..';
import {
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../../types/category.types';
import API from '../../api';

vi.mock('../../api', () => ({
  default: {
    category: {
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      getAllCategories: vi.fn(),
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
});
