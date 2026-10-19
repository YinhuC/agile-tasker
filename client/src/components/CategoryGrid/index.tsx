import React, { useEffect, useMemo } from 'react';
import { Box, BoxProps, Title } from '@mantine/core';
import TaskCard from '../TaskCard';
import { Category } from '../../types/category.types';
import { fetchAllTasksThunk } from '../../store/task/task.thunks';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { sortByIndex } from '../../utils/sort.utils';
import TaskModal from '../TaskModal';
import CategoryModal from '../CategoryModal';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import classes from './CategoryGrid.module.css';

type CategoryGridProps = BoxProps & {
  category: Category;
  projectId: number;
  index: number;
};

/** One list as a rack slot: ink header with its card count, cards below, add card at the foot. */
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
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={classes.root}
          data-dragging={snapshot.isDragging || undefined}
          {...props}
        >
          <div className={classes.head} {...provided.dragHandleProps}>
            <Title order={2} className={classes.title}>
              {name}
            </Title>
            <span className={classes.count}>
              {String(tasks.length).padStart(2, '0')}
            </span>
            <CategoryModal
              type='edit'
              projectId={projectId}
              category={category}
            />
          </div>
          <Droppable droppableId={`task-drop-${id}`} type='TASK'>
            {(dropProvided, dropSnapshot) => (
              <div
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                className={classes.cards}
                data-over={dropSnapshot.isDraggingOver || undefined}
              >
                {tasks.map((task, index) => (
                  <TaskCard
                    task={task}
                    index={index}
                    key={`task-card-${task.id}`}
                  />
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
          <TaskModal categoryId={id} type={'add'} />
        </Box>
      )}
    </Draggable>
  );
}

export default CategoryGrid;
