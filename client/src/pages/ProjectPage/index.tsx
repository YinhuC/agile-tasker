import React, { useEffect } from 'react';
import { Flex, Text } from '@mantine/core';
import { updateCategoryThunk } from '../../store/category/category.thunks';
import { fetchBoardThunk } from '../../store/project/project.thunks';
import { useLocation } from 'react-router';
import CategoryGrid from '../../components/CategoryGrid';
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import HeaderSection from './HeaderSection';
import classes from './ProjectPage.module.css';
import { Category } from '../../types/category.types';
import { Task } from '../../types/task.types';
import { updateTaskThunk } from '../../store/task/task.thunks';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  insertIndexValue,
  removeIndexValue,
  updateIndexValues,
} from '../../utils/array.utils';
import { updateAllCategories } from '../../store/category/category.slice';
import { updateAllTasks } from '../../store/task/task.slice';
import { showGeneralError } from '../../utils/notification.utils';

function ProjectPage() {
  const categories = useAppSelector((state) => state.categories.categories);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const location = useLocation();
  const path = location.pathname.split('/');
  const projectId = path[path.length - 1];
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBoardThunk(projectId));
  }, [dispatch, projectId]);

  /** The drop already shows on screen; if the server refuses it, reload the board so the screen matches the saved order. */
  const restoreBoard = () => {
    showGeneralError();
    dispatch(fetchBoardThunk(projectId));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const { source, destination, draggableId } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (result.type === 'CATEGORY') {
      // Update local first to prevent switch back glitch
      const updatedCategories = updateIndexValues(
        categories,
        source.index,
        destination.index
      );
      dispatch(updateAllCategories(updatedCategories));

      dispatch(
        updateCategoryThunk({
          id: categories[source.index].id,
          index: destination.index,
        })
      )
        .unwrap()
        .catch(restoreBoard);
    } else {
      // Set variables and ids from drop zones
      const taskId = parseInt(draggableId.split('-')[2]);
      const task = tasks.find((task) => task.id === taskId);
      if (!task) return;
      const newCategoryId = parseInt(destination.droppableId.split('-')[2]);
      const oldCategoryId = parseInt(source.droppableId.split('-')[2]);
      const oldTaskGroup = tasks.filter(
        (task) => task.category?.id === oldCategoryId
      );

      // Update local first to prevent switch back glitch
      if (newCategoryId === oldCategoryId) {
        const updatedTasks = updateIndexValues(
          oldTaskGroup,
          source.index,
          destination.index
        );
        dispatch(updateAllTasks(updatedTasks));
      } else {
        const newTaskGroup = tasks.filter(
          (task) => task.category?.id === newCategoryId
        );
        // Insert into new and remove from old category
        const { category, ...rest } = task;
        const newTask: Task = {
          ...rest,
          index: destination.index,
          category: {
            ...(category as Category),
            id: newCategoryId,
          },
        };
        const inserted = insertIndexValue(
          newTask,
          newTaskGroup,
          destination.index
        );
        const removed = removeIndexValue(oldTaskGroup, source.index);
        dispatch(updateAllTasks(inserted.concat(removed)));
      }

      dispatch(
        updateTaskThunk({
          id: task.id,
          index: destination.index,
          categoryId: newCategoryId,
        })
      )
        .unwrap()
        .catch(restoreBoard);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <HeaderSection projectId={projectId} />
      <Droppable droppableId='cat-drop' direction='horizontal' type='CATEGORY'>
        {(provided) => (
          <Flex
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={classes.rack}
          >
            {categories.map((category, index) => (
              <CategoryGrid
                projectId={parseInt(projectId)}
                category={category}
                index={index}
                key={`category-grid-${category.id}`}
              />
            ))}
            {provided.placeholder}
            {categories.length === 0 && (
              <Text className={classes.empty}>
                No lists yet. Add one to start placing cards.
              </Text>
            )}
          </Flex>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default ProjectPage;
