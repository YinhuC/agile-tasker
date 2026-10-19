import React, { useEffect } from 'react';
import { ActionIcon, Button, Group, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../../types/category.types';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { TbPencil } from 'react-icons/tb';
import { GeneralErrorObject } from '../../utils/notification.utils';
import {
  createCategoryThunk,
  deleteCategoryThunk,
  updateCategoryThunk,
} from '../../store/category/category.thunks';
import { useAppDispatch } from '../../hooks/useAppDispatch';

type CategoryModalProps = {
  projectId: number;
  type: 'add' | 'edit';
  category?: Category;
};

function CategoryModal({
  projectId,
  type,
  category,
  ...props
}: CategoryModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: type === 'edit' && category?.name ? category.name : '',
    },
    validate: {
      name: (value) =>
        value.length > 30 ? 'Keep the name to 30 characters or fewer.' : null,
    },
  });

  useEffect(() => {
    form.setValues({
      name: type === 'edit' && category?.name ? category.name : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, category]);

  const onSubmit = async (
    values: CreateCategoryParams | UpdateCategoryParams
  ) => {
    try {
      if (type === 'add') {
        dispatch(createCategoryThunk(values as CreateCategoryParams));
      } else {
        dispatch(updateCategoryThunk(values as UpdateCategoryParams));
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
      if (category && category.id)
        dispatch(deleteCategoryThunk(category.id.toString()));
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
        title={type === 'add' ? 'New list' : 'Edit list'}
        centered
        size='lg'
        {...props}
      >
        <form
          onSubmit={form.onSubmit((values) =>
            onSubmit({ ...values, projectId, id: category?.id })
          )}
        >
          <TextInput
            mb={10}
            label='Name'
            placeholder='Name'
            required
            aria-label='List name'
            {...form.getInputProps('name')}
          />
          <Group justify='flex-end' gap={10} mt='lg'>
            <Button type='submit' size='md'>
              {type === 'add' ? 'Create list' : 'Save changes'}
            </Button>
            {type === 'edit' && (
              <Button
                size='md'
                variant='outline'
                onClick={onDelete}
                aria-label='Delete list'
              >
                Delete list
              </Button>
            )}
          </Group>
        </form>
      </Modal>
      {type === 'add' ? (
        <Button onClick={open} mt={{ base: 15, sm: 0 }} aria-label='New list'>
          New list
        </Button>
      ) : (
        <ActionIcon onClick={open} size='md' aria-label='Edit list'>
          <TbPencil size={18} />
        </ActionIcon>
      )}
    </>
  );
}

export default CategoryModal;
