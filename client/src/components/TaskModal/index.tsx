import React, { useEffect } from 'react';
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { TbPencil, TbPlus } from 'react-icons/tb';
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
        title={type === 'add' ? 'New card' : 'Edit card'}
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
            label='Name'
            placeholder='Name'
            aria-label='Card name'
            required
            {...form.getInputProps('name')}
          />
          <Textarea
            mb={30}
            label='Description'
            placeholder='Optional'
            aria-label='Card description'
            autosize
            minRows={3}
            maxRows={5}
            {...form.getInputProps('description')}
          />
          <Group justify='flex-end' gap={10} mt='lg'>
            <Button type='submit' size='md'>
              {type === 'add' ? 'Create card' : 'Save changes'}
            </Button>
            {type === 'edit' && (
              <Button
                size='md'
                variant='outline'
                onClick={onDelete}
                aria-label='Delete card'
              >
                Delete card
              </Button>
            )}
          </Group>
        </form>
      </Modal>
      {type === 'add' ? (
        <Button
          fullWidth
          onClick={open}
          variant='subtle'
          justify='flex-start'
          leftSection={<TbPlus aria-hidden />}
          aria-label='New card'
        >
          New card
        </Button>
      ) : (
        <ActionIcon onClick={open} size='md' aria-label='Edit card'>
          <TbPencil size={18} />
        </ActionIcon>
      )}
    </>
  );
}

export default TaskModal;
