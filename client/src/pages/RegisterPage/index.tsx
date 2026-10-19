import React from 'react';
import { Button, Group, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import AuthLayout from '../../components/AuthLayout';
import PhoneWorkspaces from '../../assets/images/screens/phone-workspaces.webp';
import { Link, useNavigate } from 'react-router';
import { MESSAGES, REGEXES } from '../../utils/regex.utils';
import { RegisterParams } from '../../types/auth.types';
import { postAuthRegister } from '../../api/auth.api';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { TbPassword } from 'react-icons/tb';
import { MdOutlineAlternateEmail, MdError } from 'react-icons/md';
import { FaCircleCheck } from 'react-icons/fa6';

function RegisterPage() {
  const form = useForm({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      firstname: (value) =>
        REGEXES.NAME_REGEX.test(value) ? null : MESSAGES.NAME_REGEX_MESSAGE,
      lastname: (value) =>
        REGEXES.NAME_REGEX.test(value) ? null : MESSAGES.NAME_REGEX_MESSAGE,
      email: (value) =>
        REGEXES.EMAIL_REGEX.test(value) ? null : MESSAGES.EMAIL_REGEX_MESSAGE,
      password: (value) =>
        REGEXES.PASSWORD_REGEX.test(value)
          ? null
          : MESSAGES.PASSWORD_REGEX_MESSAGE,
      confirmPassword: (value, values) =>
        value === values.password ? null : 'The passwords don’t match.',
    },
  });

  const navigate = useNavigate();
  const onSubmit = async (values: RegisterParams) => {
    try {
      await postAuthRegister(values);
      navigate('/login');
      notifications.cleanQueue();
      notifications.show({
        title: 'Account created.',
        message: 'Sign in with your new email and password.',
        color: 'dark',
        icon: <FaCircleCheck />,
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      notifications.cleanQueue();
      if (axiosError.response?.status === 400) {
        notifications.show({
          title: 'That email is already registered.',
          message: 'Sign in instead, or use a different email.',
          color: 'signal',
          icon: <MdError />,
        });
      } else {
        notifications.show({
          title: 'The account couldn’t be created.',
          message: 'Check the details and try again in a moment.',
          color: 'signal',
          icon: <MdError />,
        });
      }
    }
  };

  return (
    <AuthLayout
      title='Create an account.'
      subtitle='Make your own workspaces, projects and boards. It takes a minute.'
      image={PhoneWorkspaces}
      imageAlt='Workspaces and their projects in agile tasker on a phone'
      footer={
        <>
          {'Already have an account? '}
          <Link to={'/login'}>Sign in</Link>
        </>
      }
    >
      <form
        onSubmit={form.onSubmit(({ confirmPassword, ...values }) =>
          onSubmit(values)
        )}
      >
        <Group grow gap='md' mb='md' align='flex-start'>
          <TextInput
            size='md'
            placeholder='First name'
            aria-label='First name'
            required
            {...form.getInputProps('firstname')}
          />
          <TextInput
            size='md'
            placeholder='Last name'
            aria-label='Last name'
            required
            {...form.getInputProps('lastname')}
          />
        </Group>
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
          mb='md'
          size='md'
          leftSection={<TbPassword />}
          placeholder='Password'
          aria-label='Password'
          required
          {...form.getInputProps('password')}
        />
        <PasswordInput
          mb='xl'
          size='md'
          leftSection={<TbPassword />}
          placeholder='Confirm password'
          aria-label='Confirm password'
          required
          {...form.getInputProps('confirmPassword')}
        />
        <Button type='submit' fullWidth size='lg'>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
