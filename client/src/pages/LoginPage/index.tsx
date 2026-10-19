import React from 'react';
import {
  Flex,
  Text,
  Title,
  Button,
  TextInput,
  PasswordInput,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '../../theme/styles/auth-link.module.css';
import { TbPassword } from 'react-icons/tb';
import { MdOutlineAlternateEmail, MdError } from 'react-icons/md';
import { Link, Navigate, useNavigate } from 'react-router';
import { postAuthLogin } from '../../api/auth.api';
import { LoginParams } from '../../types/auth.types';
import { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import { User } from '../../types/user.types';
import { GeneralErrorObject } from '../../utils/notification.utils';
import { useAuth } from '../../hooks/useAuth';

function LoginPage() {
  const form = useForm({
    initialValues: {
      email: 'johndoe@example.com',
      password: 'Password12345',
    },
    validate: {
      email: () => null,
      password: () => null,
    },
  });

  const navigate = useNavigate();

  const { user } = useAuth();
  if (user) {
    return <Navigate to={`/boards/${user.id}`} replace />;
  }

  const onSubmit = async (values: LoginParams) => {
    try {
      const user: User = (await postAuthLogin(values)).data;
      navigate(`/boards/${user.id}`);
    } catch (err) {
      const axiosError = err as AxiosError;
      notifications.cleanQueue();
      if (axiosError.response?.status === 401) {
        notifications.show({
          title: 'Invalid email or password.',
          message: 'Please check your credentials and try again.',
          color: 'red',
          icon: <MdError />,
        });
      } else {
        notifications.show(GeneralErrorObject);
      }
    }
  };

  return (
    <Flex
      h='100%'
      w='100%'
      justify='center'
      align='center'
      direction='column'
      mih='100vh'
      style={{
        background:
          'linear-gradient(45deg, var(--mantine-color-pink-0) 0%, var(--mantine-color-teal-0) 100%)',
      }}
      py={50}
      px={20}
    >
      <Title order={2} mb={15}>
        Login.
      </Title>
      <Text mb={50}>Access your team projects by logging in.</Text>
      <Box miw={300} w='18%' mb={60}>
        <form
          onSubmit={form.onSubmit(async (values) => await onSubmit(values))}
        >
          <TextInput
            mb={20}
            leftSection={<MdOutlineAlternateEmail />}
            placeholder='Email'
            aria-label='Email'
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            mb={30}
            leftSection={<TbPassword />}
            placeholder='Password'
            aria-label='Password'
            required
            {...form.getInputProps('password')}
          />
          <Button type='submit' fullWidth h={45} aria-label='Submit'>
            Submit
          </Button>
        </form>
      </Box>
      <Box className={classes.link}>
        <Text size='sm'>
          Not registered? <Link to={'/register'}>Create account</Link>
        </Text>
      </Box>
    </Flex>
  );
}

export default LoginPage;
