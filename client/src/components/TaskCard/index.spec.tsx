import React from 'react';
import { screen } from '@testing-library/react';
import TaskCard from '.';
import TaskModal from '../TaskModal';
import { Task } from '../../types/task.types';
import { renderWithProviders } from '../../utils/redux.utils';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

vi.mock('../TaskModal', () => ({ default: vi.fn(() => <div>TaskModal</div>) }));

describe('TaskCard', () => {
  const task: Task = {
    id: 1,
    name: 'Task 1',
    description: 'This is Task 1',
    index: 1,
    createdAt: Date.toString(),
    category: { id: 1, name: '', index: 1, createdAt: Date.toString() },
  };

  const index = 0;

  it('renders the task name and description', () => {
    const dragOnEnd = vi.fn();
    renderWithProviders(
      <DragDropContext onDragEnd={dragOnEnd}>
        <Droppable droppableId='test'>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <TaskCard task={task} index={index} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );

    const taskName = screen.getByText('Task 1');
    const taskDescription = screen.getByText('This is Task 1');

    expect(taskName).toBeInTheDocument();
    expect(taskDescription).toBeInTheDocument();
  });

  it('renders the TaskModal component with the correct props', () => {
    const dragOnEnd = vi.fn();
    renderWithProviders(
      <DragDropContext onDragEnd={dragOnEnd}>
        <Droppable droppableId='test'>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <TaskCard task={task} index={index} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );

    const taskModalProps = {
      type: 'edit',
      categoryId: 1,
      task: task,
    };

    expect(TaskModal).toHaveBeenCalledWith(taskModalProps, undefined);
  });
});
