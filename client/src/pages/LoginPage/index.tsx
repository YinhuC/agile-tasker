import React from 'react';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import AuthLayout from '../../components/AuthLayout';
import IphoneLogin from '../../assets/images/iphone/iphone-login.png';
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
    <AuthLayout
      title='Login.'
      subtitle='Access your team projects by logging in.'
      image={IphoneLogin}
      imageAlt='Agile Tasker login screen on iPhone'
      footer={
        <>
          {'Not registered? '}
          <Link to={'/register'}>Create account</Link>
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
        <Button type='submit' fullWidth size='md' aria-label='Submit'>
          Submit
        </Button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
