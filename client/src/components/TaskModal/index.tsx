import React, { useEffect } from 'react';
import { Button, Group, Modal, TextInput, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { FaEdit } from 'react-icons/fa';
import {
  CreateTaskParams,
  Task,
  UpdateTaskParams,
} from '../../types/task.types';
import {
  createTaskThunk,
  deleteTaskThunk,
  updateTaskThunk,
} from '../../store/task/task.thunks';
import { GeneralErrorObject } from '../../utils/notification.utils';
import { useAppDispatch } from '../../hooks/useAppDispatch';

type TaskModalProps = {
  categoryId: number;
  type: 'add' | 'edit';
  task?: Task;
};

function TaskModal({ categoryId, type, task, ...props }: TaskModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: type === 'edit' && task ? task.name : '',
      description:
        type === 'edit' && task?.description
          ? task.description === null
            ? ''
            : task.description
          : '',
    },
    validate: {
      name: (value) =>
        value.length > 50
          ? 'Title should not be longer than 50 characters long.'
          : null,
      description: (value) =>
        value.length > 200
          ? 'Description should not be longer than 200 characters long.'
          : null,
    },
  });

  useEffect(() => {
    form.setValues({
      name: type === 'edit' && task ? task.name : '',
      description:
        type === 'edit' && task?.description
          ? task.description === null
            ? ''
            : task.description
          : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, task]);

  const onSubmit = async (values: CreateTaskParams | UpdateTaskParams) => {
    try {
      if (type === 'add') {
        dispatch(createTaskThunk(values as CreateTaskParams));
      } else {
        dispatch(updateTaskThunk(values as UpdateTaskParams));
      }
    } catch (err) {
      notifications.cleanQueue();
      notifications.show(GeneralErrorObject);
    }
    form.reset();
    close();
  };

  const onDelete = async () => {
    try {
      if (task && task.id) dispatch(deleteTaskThunk(task.id.toString()));
    } catch (err) {
      notifications.cleanQueue();
      notifications.show(GeneralErrorObject);
    }
    form.reset();
    close();
  };

  return (
    <>
      <Modal
        padding='xl'
        opened={opened}
        onClose={close}
        title={type === 'add' ? 'Create New Task' : 'Edit Task'}
        centered
        size='lg'
        {...props}
      >
        <form
          onSubmit={form.onSubmit((values) =>
            onSubmit({ ...values, categoryId, id: task?.id })
          )}
        >
          <TextInput
            mb={10}
            label='Title'
            placeholder='Title'
            aria-label='Task Title'
            required
            {...form.getInputProps('name')}
          />
          <Textarea
            mb={30}
            label='Description'
            placeholder='Description'
            aria-label='Task Description'
            autosize
            minRows={3}
            maxRows={5}
            {...form.getInputProps('description')}
          />
          <Group justify='flex-end' gap={10}>
            <Button type='submit' h={45} aria-label='Submit'>
              {type === 'add' ? 'Create Task' : 'Edit Task'}
            </Button>
            {type === 'edit' && (
              <Button
                h={45}
                color='dark'
                onClick={onDelete}
                aria-label='Delete Task'
              >
                Delete Task
              </Button>
            )}
          </Group>
        </form>
      </Modal>
      {type === 'add' ? (
        <Button
          fullWidth
          onClick={open}
          variant='outline'
          aria-label='Create Task'
        >
          Create Task
        </Button>
      ) : (
        <Button
          onClick={open}
          size='xs'
          variant='subtle'
          mb={5}
          p={5}
          radius='50%'
          aria-label='Edit Task'
        >
          <FaEdit size={20} />
        </Button>
      )}
    </>
  );
}

export default TaskModal;
