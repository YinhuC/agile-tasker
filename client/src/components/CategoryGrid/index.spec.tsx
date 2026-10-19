import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithMantine } from '../../utils/test.utils';
import CategoryGrid from '.';
import { fetchAllTasksThunk } from '../../store/task/task.thunks';
import { BrowserRouter as Router } from 'react-router';
import { Category } from '../../types/category.types';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type { Mock } from 'vitest';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';

vi.mock('../../hooks/useAppDispatch', () => ({
  useAppDispatch: vi.fn(),
}));
vi.mock('../../hooks/useAppSelector', () => ({
  useAppSelector: vi.fn(),
}));
vi.mock('../../store/task/task.thunks', () => ({
  fetchAllTasksThunk: vi.fn(),
}));

describe('CategoryGrid', () => {
  const projectId = 1;
  const index = 1;
  const category: Category = {
    id: 1,
    name: 'Category 1',
    createdAt: Date.toString(),
    index: 0,
  };
  const tasks = [
    { id: 1, name: 'Task 1', category: { id: 1 } },
    { id: 2, name: 'Task 2', category: { id: 1 } },
    { id: 3, name: 'Task 3', category: { id: 2 } },
  ];

  beforeEach(() => {
    const useAppDispatchModule = useAppDispatch as Mock;
    const useAppSelectorhModule = useAppSelector as Mock;
    useAppDispatchModule.mockReturnValue(vi.fn());
    useAppSelectorhModule.mockImplementation((selector: any) =>
      selector({
        tasks: { tasks },
      })
    );
  });

  it('renders the category name', () => {
    const dragOnEnd = vi.fn();
    renderWithMantine(
      <Router>
        <DragDropContext onDragEnd={dragOnEnd}>
          <Droppable droppableId='test'>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <CategoryGrid
                  category={category}
                  projectId={projectId}
                  index={index}
                />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Router>
    );

    const groupName = screen.getByText('Category 1');
    expect(groupName).toBeInTheDocument();
  });

  it('dispatches fetchAllTasksThunk with the correct categoryId', () => {
    const dragOnEnd = vi.fn();
    renderWithMantine(
      <Router>
        <DragDropContext onDragEnd={dragOnEnd}>
          <Droppable droppableId='test'>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <CategoryGrid
                  category={category}
                  projectId={projectId}
                  index={index}
                />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Router>
    );

    expect(fetchAllTasksThunk).toHaveBeenCalledWith({ categoryId: 1 });
  });

  it('renders TaskCard components for each task in the group', () => {
    const dragOnEnd = vi.fn();
    renderWithMantine(
      <Router>
        <DragDropContext onDragEnd={dragOnEnd}>
          <Droppable droppableId='test'>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <CategoryGrid
                  category={category}
                  projectId={projectId}
                  index={index}
                />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Router>
    );

    const task1 = screen.getByText('Task 1');
    const task2 = screen.getByText('Task 2');
    const task3 = screen.queryByText('Task 3');

    expect(task1).toBeInTheDocument();
    expect(task2).toBeInTheDocument();
    expect(task3).not.toBeInTheDocument();
  });

  it('renders the TaskModal component', () => {
    const dragOnEnd = vi.fn();
    renderWithMantine(
      <Router>
        <DragDropContext onDragEnd={dragOnEnd}>
          <Droppable droppableId='test'>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <CategoryGrid
                  category={category}
                  projectId={projectId}
                  index={index}
                />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Router>
    );

    const taskModal = screen.getByLabelText('Create Task');

    expect(taskModal).toBeInTheDocument();
  });

  it('renders the CategoryModal component', () => {
    const dragOnEnd = vi.fn();
    renderWithMantine(
      <Router>
        <DragDropContext onDragEnd={dragOnEnd}>
          <Droppable droppableId='test'>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <CategoryGrid
                  category={category}
                  projectId={projectId}
                  index={index}
                />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Router>
    );

    const categoryModal = screen.getByLabelText('Edit Category');

    expect(categoryModal).toBeInTheDocument();
  });
});
