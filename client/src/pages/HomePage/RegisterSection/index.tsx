import React from 'react';
import {
  Container,
  Title,
  Button,
  BoxProps,
  Box,
  Group,
  TextInput,
  Text,
} from '@mantine/core';
import { Link } from 'react-router';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import ctaClasses from '../../../components/CtaBand/CtaBand.module.css';
import { childRoot, revealRoot, stagger } from '../../../theme/motion';
import classes from './RegisterSection.module.css';

function RegisterSection({ ...props }: BoxProps) {
  return (
    <Box className={ctaClasses.root} {...props}>
      <Container size='lg' py={{ base: 72, sm: 96 }}>
        <Box className={classes.inner} renderRoot={revealRoot(stagger(0.12))}>
          <Box renderRoot={childRoot()}>
            <Title order={1} c='white' className={classes.title}>
              Start your Agile journey today.
            </Title>
            <Text c='white' mt='sm' size='lg' opacity={0.9}>
              Create a free account in under a minute.
            </Text>
          </Box>
          <Group
            gap='sm'
            className={classes.form}
            wrap='nowrap'
            renderRoot={childRoot()}
          >
            <TextInput
              leftSection={<MdOutlineAlternateEmail />}
              placeholder='Your email'
              aria-label='Your email'
              type='email'
              size='md'
              className={classes.input}
            />
            <Button
              component={Link}
              size='md'
              to={'/register'}
              variant='white'
              aria-label='Sign up for free'
            >
              Sign up for free
            </Button>
          </Group>
        </Box>
      </Container>
    </Box>
  );
}

export default RegisterSection;
