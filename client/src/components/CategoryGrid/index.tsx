import React, { useEffect, useMemo } from 'react';
import { Divider, Flex, Stack, Title } from '@mantine/core';
import TaskCard from '../TaskCard';
import { Category } from '../../types/category.types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchAllTasksThunk } from '../../store/task/task.thunks';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { sortByIndex } from '../../utils/sort.utils';
import TaskModal from '../TaskModal';
import CategoryModal from '../CategoryModal';

type CategoryGridProps = {
  category: Category;
  projectId: number;
  index: number;
};

function CategoryGrid({ category, index, projectId }: CategoryGridProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { name, id } = category;
  const allTasks = useSelector((state: RootState) => state.tasks.tasks);

  const tasks = useMemo(
    () => sortByIndex(allTasks.filter((task) => task.category?.id === id)),
    [allTasks, id]
  );

  useEffect(() => {
    dispatch(fetchAllTasksThunk({ categoryId: id }));
  }, [dispatch, id]);

  return (
    <Draggable draggableId={`cat-drag-${id}`} index={index}>
      {(provided) => (
        <Stack
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          spacing={20}
          p={20}
          mx={10}
          miw={340}
          sx={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            height: '100%',
            border: '0.0625rem solid #dee2e6',
            boxShadow:
              '0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.05), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.1)',
          }}
        >
          <Flex justify='space-between' align='center'>
            <Title order={4} ml={5}>
              {name}
            </Title>
            <CategoryModal
              type='edit'
              projectId={projectId}
              category={category}
            />
          </Flex>
          <Divider />
          <Droppable droppableId={`task-drop-${id}`} type='TASK'>
            {(provided) => (
              <Stack
                ref={provided.innerRef}
                {...provided.droppableProps}
                spacing={10}
                sx={{
                  minHeight: 60,
                }}
              >
                {tasks.map((task, index) => (
                  <TaskCard
                    task={task}
                    index={index}
                    key={`task-card-${task.id}`}
                  />
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
          <TaskModal category={category} type={'add'} />
        </Stack>
      )}
    </Draggable>
  );
}

export default CategoryGrid;
