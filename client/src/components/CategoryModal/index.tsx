import React, { useEffect } from 'react';
import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../../types/category.types';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { FaEdit } from 'react-icons/fa';
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
        value.length > 30
          ? 'Title should not be longer than 30 characters long.'
          : null,
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
        title={type === 'add' ? 'Create New Category' : 'Edit Category'}
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
            label='Title'
            placeholder='Title'
            required
            aria-label='Category Title'
            {...form.getInputProps('name')}
          />
          <Group justify='flex-end' gap={10}>
            <Button type='submit' h={45} aria-label='Submit'>
              {type === 'add' ? 'Create Category' : 'Edit Category'}
            </Button>
            {type === 'edit' && (
              <Button
                h={45}
                color='dark'
                onClick={onDelete}
                aria-label='Delete Category'
              >
                Delete Category
              </Button>
            )}
          </Group>
        </form>
      </Modal>
      {type === 'add' ? (
        <Button
          onClick={open}
          mt={{ base: 15, sm: 0 }}
          aria-label='Create Category'
        >
          Create Category
        </Button>
      ) : (
        <Button
          onClick={open}
          size='xs'
          variant='subtle'
          mb={5}
          p={5}
          radius='50%'
          aria-label='Edit Category'
        >
          <FaEdit size={20} />
        </Button>
      )}
    </>
  );
}

export default CategoryModal;
