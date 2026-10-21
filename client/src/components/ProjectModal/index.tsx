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
import { TbPencil } from 'react-icons/tb';
import { GeneralErrorObject } from '../../utils/notification.utils';
import {
  CreateProjectParams,
  Project,
  UpdateProjectParams,
} from '../../types/project.types';
import {
  createProjectThunk,
  deleteProjectThunk,
  updateProjectThunk,
} from '../../store/project/project.thunks';
import { useAppDispatch } from '../../hooks/useAppDispatch';

type ProjectModalProps = {
  groupId: number;
  type: 'add' | 'edit';
  project?: Project;
};

function ProjectModal({ groupId, type, project, ...props }: ProjectModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: type === 'edit' && project ? project.name : '',
      description: type === 'edit' && project ? project.description : '',
    },
    validate: {
      name: (value) =>
        value.length > 30 ? 'Keep the name to 30 characters or fewer.' : null,
      description: (value) =>
        value.length > 100
          ? 'Description should not be longer than 100 characters long.'
          : null,
    },
  });

  useEffect(() => {
    form.setValues({
      name: type === 'edit' && project ? project.name : '',
      description: type === 'edit' && project ? project.description : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, project]);

  const onSubmit = async (
    values: CreateProjectParams | UpdateProjectParams
  ) => {
    try {
      if (type === 'add') {
        await dispatch(
          createProjectThunk(values as CreateProjectParams)
        ).unwrap();
      } else {
        await dispatch(
          updateProjectThunk(values as UpdateProjectParams)
        ).unwrap();
      }
      form.reset();
      close();
    } catch (err) {
      notifications.cleanQueue();
      notifications.show(GeneralErrorObject);
    }
  };

  const onDelete = async () => {
    try {
      if (project && project.id) {
        await dispatch(deleteProjectThunk(project.id.toString())).unwrap();
      }
      form.reset();
      close();
    } catch (err) {
      notifications.cleanQueue();
      notifications.show(GeneralErrorObject);
    }
  };

  return (
    <>
      <Modal
        padding='xl'
        opened={opened}
        onClose={close}
        title={type === 'add' ? 'New project' : 'Edit project'}
        centered
        size='lg'
        {...props}
      >
        <form
          onSubmit={form.onSubmit((values) =>
            onSubmit({ ...values, groupId, id: project?.id as number })
          )}
        >
          <TextInput
            mb={10}
            label='Name'
            placeholder='Name'
            required
            aria-label='Project name'
            {...form.getInputProps('name')}
          />
          <Textarea
            mb={30}
            label='Description'
            placeholder='Optional'
            aria-label='Project description'
            autosize
            minRows={3}
            maxRows={5}
            {...form.getInputProps('description')}
          />
          <Group justify='flex-end' gap={10} mt='lg'>
            <Button type='submit' size='md'>
              {type === 'add' ? 'Create project' : 'Save changes'}
            </Button>
            {type === 'edit' && (
              <Button
                size='md'
                variant='outline'
                onClick={onDelete}
                aria-label='Delete project'
              >
                Delete project
              </Button>
            )}
          </Group>
        </form>
      </Modal>
      {type === 'add' ? (
        <Button
          onClick={open}
          mt={{ base: 15, sm: 0 }}
          aria-label='New project'
        >
          New project
        </Button>
      ) : (
        <ActionIcon onClick={open} size='lg' aria-label='Edit project'>
          <TbPencil size={18} />
        </ActionIcon>
      )}
    </>
  );
}

export default ProjectModal;
