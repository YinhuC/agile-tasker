import React, { useEffect, useMemo } from 'react';
import { Divider, Flex, Stack, StackProps, Title } from '@mantine/core';
import TaskCard from '../TaskCard';
import { Category } from '../../types/category.types';
import { fetchAllTasksThunk } from '../../store/task/task.thunks';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { sortByIndex } from '../../utils/sort.utils';
import TaskModal from '../TaskModal';
import CategoryModal from '../CategoryModal';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';

type CategoryGridProps = StackProps & {
  category: Category;
  projectId: number;
  index: number;
};

function CategoryGrid({
  category,
  index,
  projectId,
  ...props
}: CategoryGridProps) {
  const dispatch = useAppDispatch();
  const allTasks = useAppSelector((state) => state.tasks.tasks);
  const { name, id } = category;

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
          gap={20}
          p={20}
          mx={10}
          miw={322}
          bg='white'
          style={{
            borderRadius: '0.5rem',
            height: 'fit-content',
            overflow: 'visible',
            border: '0.0625rem solid #dee2e6',
            boxShadow:
              '0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.05), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.1)',
          }}
          {...props}
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
                gap={10}
                mih={60}
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
          <TaskModal categoryId={id} type={'add'} />
        </Stack>
      )}
    </Draggable>
  );
}

export default CategoryGrid;
