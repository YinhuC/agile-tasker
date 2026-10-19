import React from 'react';
import {
  Container,
  Stack,
  Title,
  Button,
  BoxProps,
  Box,
  Flex,
  TextInput,
} from '@mantine/core';
import { Link } from 'react-router';
import { MdOutlineAlternateEmail } from 'react-icons/md';

function RegisterSection({ ...props }: BoxProps) {
  return (
    <Box
      style={{
        background:
          'linear-gradient(90deg, var(--mantine-color-violet-9) 0%, var(--mantine-color-pink-5) 100%)',
      }}
      {...props}
    >
      <Container
        size='lg'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        py={70}
      >
        <Stack justify='center' align='center' w='100%' mx={10}>
          <Title ta='center' order={1} c='white' fw={600} mb={10}>
            Start your Agile journey today.
          </Title>
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            align='center'
            justify='center'
          >
            <TextInput
              leftSection={<MdOutlineAlternateEmail />}
              placeholder='Your email'
              aria-label='Your email'
              required
              mr={{ base: 0, sm: 10 }}
              mb={{ base: 10, sm: 0 }}
            />
            <Button
              component={Link}
              size='md'
              mr='0.5rem'
              to={''}
              aria-label='Discover different views'
              variant='light'
            >
              Sign up for free
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}

export default RegisterSection;
