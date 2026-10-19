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
        value === values.password
          ? null
          : `Passwords Don't Match. Please Try Again.`,
    },
  });

  const navigate = useNavigate();
  const onSubmit = async (values: RegisterParams) => {
    try {
      await postAuthRegister(values);
      navigate('/login');
      notifications.cleanQueue();
      notifications.show({
        title: 'Account Created Successfully!',
        message:
          'Congratulations! Your user account has been successfully created. Welcome to our platform and get ready to explore!',
        color: 'green',
        icon: <FaCircleCheck />,
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      notifications.cleanQueue();
      if (axiosError.response?.status === 400) {
        notifications.show({
          title: 'Email Already Registered.',
          message: 'Please use a different email to register and try again.',
          color: 'red',
          icon: <MdError />,
        });
      } else {
        notifications.show({
          title: 'Account Creation Error',
          message:
            'An error occurred during the account creation process. Please double-check the provided information and try again.',
          color: 'red',
          icon: <MdError />,
        });
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
          'linear-gradient(225deg, var(--mantine-color-pink-0) 0%, var(--mantine-color-teal-0) 100%)',
      }}
      py={50}
      px={20}
    >
      <Title order={2} mb={20}>
        Create your account.
      </Title>
      <Text mb={50} ta='center'>
        Create your account today and embark on a collaborative journey.
      </Text>
      <Box miw={300} w='24%' mb={60}>
        <form
          onSubmit={form.onSubmit(({ confirmPassword, ...values }) =>
            onSubmit(values)
          )}
        >
          <TextInput
            mb={20}
            placeholder='First Name'
            aria-label='First Name'
            required
            {...form.getInputProps('firstname')}
          />
          <TextInput
            mb={20}
            placeholder='Last Name'
            aria-label='Last Name'
            required
            {...form.getInputProps('lastname')}
          />
          <TextInput
            mb={20}
            leftSection={<MdOutlineAlternateEmail />}
            placeholder='Your email'
            aria-label='Your email'
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            mb={20}
            leftSection={<TbPassword />}
            placeholder='Password'
            aria-label='Password'
            required
            {...form.getInputProps('password')}
          />
          <PasswordInput
            mb={30}
            leftSection={<TbPassword />}
            placeholder='Confirm Password'
            aria-label='Confirm Password'
            required
            {...form.getInputProps('confirmPassword')}
          />
          <Button type='submit' fullWidth h={45} aria-label='Submit'>
            Submit
          </Button>
        </form>
      </Box>
      <Box className={classes.link}>
        <Text size='sm'>
          Already have an acocunt? <Link to={'/login'}>Sign in</Link>
        </Text>
      </Box>
    </Flex>
  );
}

export default RegisterPage;
