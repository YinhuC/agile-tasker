import React from 'react';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import AuthLayout from '../../components/AuthLayout';
import PhoneBoard from '../../assets/images/screens/phone-board.webp';
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
          title: 'That email and password don’t match.',
          message: 'Check both and try again.',
          color: 'signal',
          icon: <MdError />,
        });
      } else {
        notifications.show(GeneralErrorObject);
      }
    }
  };

  return (
    <AuthLayout
      title='Sign in.'
      subtitle='The demo account is already filled in. Press sign in to open its board.'
      image={PhoneBoard}
      imageAlt='A project board in agile tasker on a phone'
      footer={
        <>
          {'No account yet? '}
          <Link to={'/register'}>Create one</Link>
          {'. The free server can take about 30 seconds to wake up.'}
        </>
      }
    >
      <form onSubmit={form.onSubmit(async (values) => await onSubmit(values))}>
        <TextInput
          mb='md'
          size='md'
          leftSection={<MdOutlineAlternateEmail />}
          placeholder='Email'
          aria-label='Email'
          required
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mb='xl'
          size='md'
          leftSection={<TbPassword />}
          placeholder='Password'
          aria-label='Password'
          required
          {...form.getInputProps('password')}
        />
        <Button type='submit' fullWidth size='lg'>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
