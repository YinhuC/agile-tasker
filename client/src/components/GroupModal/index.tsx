import React, { useEffect } from 'react';
import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { FaEdit } from 'react-icons/fa';
import { GeneralErrorObject } from '../../utils/notification.utils';
import {
  CreateGroupParams,
  Group as GroupType,
  UpdateGroupParams,
} from '../../types/group.types';
import {
  createGroupThunk,
  deleteGroupThunk,
  updateGroupThunk,
} from '../../store/group/group.thunks';
import { useAppDispatch } from '../../hooks/useAppDispatch';

type GroupModalProps = {
  type: 'add' | 'edit';
  group?: GroupType;
};

function GroupModal({ type, group, ...props }: GroupModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: type === 'edit' && group?.name ? group.name : '',
    },
    validate: {
      name: (value) =>
        value.length > 30
          ? 'Title should not be longer than 30 characters long.'
          : null,
    },
  });

  useEffect(() => {
    form.setValues({
      name: type === 'edit' && group?.name ? group.name : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, group]);

  const onSubmit = async (values: CreateGroupParams | UpdateGroupParams) => {
    try {
      if (type === 'add') {
        dispatch(createGroupThunk(values as CreateGroupParams));
      } else {
        dispatch(updateGroupThunk(values as UpdateGroupParams));
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
      if (group && group.id) dispatch(deleteGroupThunk(group.id.toString()));
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
        title={type === 'add' ? 'Create New Group' : 'Edit Group'}
        centered
        size='lg'
        {...props}
      >
        <form
          onSubmit={form.onSubmit((values) =>
            onSubmit({ ...values, id: group?.id })
          )}
        >
          <TextInput
            mb={10}
            label='Title'
            placeholder='Title'
            required
            aria-label='Group Title'
            {...form.getInputProps('name')}
          />
          <Group justify='flex-end' gap={10}>
            <Button type='submit' h={45} aria-label='Submit'>
              {type === 'add' ? 'Create Group' : 'Edit Group'}
            </Button>
            {type === 'edit' && (
              <Button
                h={45}
                color='dark'
                onClick={onDelete}
                aria-label='Delete Group'
              >
                Delete Group
              </Button>
            )}
          </Group>
        </form>
      </Modal>
      {type === 'add' ? (
        <Button
          onClick={open}
          variant='light'
          mt={{ base: 10, md: 0 }}
          aria-label='Create Group'
        >
          Create Group
        </Button>
      ) : (
        <Button
          onClick={open}
          size='xs'
          variant='subtle'
          p={5}
          radius='50%'
          aria-label='Edit Group'
        >
          <FaEdit size={20} />
        </Button>
      )}
    </>
  );
}

export default GroupModal;
