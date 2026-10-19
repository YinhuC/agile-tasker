import React from 'react';
import { Box, BoxProps, Text } from '@mantine/core';
import { Task } from '../../types/task.types';
import { Draggable } from '@hello-pangea/dnd';
import TaskModal from '../TaskModal';
import classes from './TaskCard.module.css';

type TaskCardProps = BoxProps & {
  task: Task;
  index: number;
};

/** A card on white stock; while dragged it lifts and takes the signal-red outline. */
function TaskCard({ task, index, ...props }: TaskCardProps) {
  const { name, description, id, category } = task;

  return (
    <Draggable draggableId={`task-drag-${id}`} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classes.root}
          data-dragging={snapshot.isDragging || undefined}
          {...props}
        >
          <div className={classes.head}>
            <span className={classes.id}>#{String(id).padStart(2, '0')}</span>
            <TaskModal
              type='edit'
              categoryId={category?.id as number}
              task={task}
            />
          </div>
          <Text component='h3' className={classes.name}>
            {name}
          </Text>
          {description && (
            <Text className={classes.description}>{description}</Text>
          )}
        </Box>
      )}
    </Draggable>
  );
}

export default TaskCard;
