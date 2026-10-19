import React, { useEffect } from 'react';
import { ActionIcon, Button, Group, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { TbPencil } from 'react-icons/tb';
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
        value.length > 30 ? 'Keep the name to 30 characters or fewer.' : null,
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
        title={type === 'add' ? 'New workspace' : 'Edit workspace'}
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
            label='Name'
            placeholder='Name'
            required
            aria-label='Workspace name'
            {...form.getInputProps('name')}
          />
          <Group justify='flex-end' gap={10} mt='lg'>
            <Button type='submit' size='md'>
              {type === 'add' ? 'Create workspace' : 'Save changes'}
            </Button>
            {type === 'edit' && (
              <Button
                size='md'
                variant='outline'
                onClick={onDelete}
                aria-label='Delete workspace'
              >
                Delete workspace
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
          aria-label='New workspace'
        >
          New workspace
        </Button>
      ) : (
        <ActionIcon onClick={open} size='lg' aria-label='Edit workspace'>
          <TbPencil size={18} />
        </ActionIcon>
      )}
    </>
  );
}

export default GroupModal;
