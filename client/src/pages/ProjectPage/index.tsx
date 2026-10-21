import React, { useEffect, useState } from 'react';
import { Flex, Text } from '@mantine/core';
import { updateCategoryThunk } from '../../store/category/category.thunks';
import { fetchBoardThunk } from '../../store/project/project.thunks';
import { useLocation } from 'react-router';
import CategoryGrid from '../../components/CategoryGrid';
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd';
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

/** Reads the numeric id from a drag and drop id such as `task-drop-12`. */
function parseDndId(dndId: string) {
  return parseInt(dndId.split('-')[2]);
}

function ProjectPage() {
  const categories = useAppSelector((state) => state.categories.categories);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const location = useLocation();
  const path = location.pathname.split('/');
  const projectId = path[path.length - 1];
  const dispatch = useAppDispatch();
  const [missingProjectId, setMissingProjectId] = useState<string>();
  const missing = missingProjectId === projectId;

  useEffect(() => {
    dispatch(fetchBoardThunk(projectId))
      .unwrap()
      .catch((status) => {
        if (status === 404) {
          setMissingProjectId(projectId);
        } else {
          showGeneralError();
        }
      });
  }, [dispatch, projectId]);

  /** The drop already shows on screen; if the server refuses it, reload the board so the screen matches the saved order. */
  const restoreBoard = () => {
    showGeneralError();
    dispatch(fetchBoardThunk(projectId));
  };

  /** Reorders the lists on screen before saving, so the drop does not snap back. */
  const moveCategory = (
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
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
  };

  /** Moves the card on screen, within its list or into another, before saving, so the drop does not snap back. */
  const moveTask = (
    source: DraggableLocation,
    destination: DraggableLocation,
    draggableId: string
  ) => {
    const taskId = parseDndId(draggableId);
    const task = tasks.find((task) => task.id === taskId);
    if (!task) {
      return;
    }
    const newCategoryId = parseDndId(destination.droppableId);
    const oldCategoryId = parseDndId(source.droppableId);
    const oldTaskGroup = tasks.filter(
      (task) => task.category?.id === oldCategoryId
    );

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
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (result.type === 'CATEGORY') {
      moveCategory(source, destination);
    } else {
      moveTask(source, destination, draggableId);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <HeaderSection projectId={projectId} missing={missing} />
      {!missing && (
        <Droppable
          droppableId='cat-drop'
          direction='horizontal'
          type='CATEGORY'
        >
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
      )}
    </DragDropContext>
  );
}

export default ProjectPage;
