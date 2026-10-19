import React from 'react';
import {
  Box,
  BoxProps,
  Button,
  Container,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Link } from 'react-router';
import { revealRoot } from '../../theme/motion';
import classes from './CtaBand.module.css';

type CtaBandProps = BoxProps & {
  title: string;
  text?: string;
  buttonText: string;
  to: string;
};

/** Closing call-to-action strip on the hero gradient; external `to` opens in a new tab. */
function CtaBand({ title, text, buttonText, to, ...props }: CtaBandProps) {
  const isExternal = to.startsWith('http');

  return (
    <Box className={classes.root} {...props}>
      <Container size='lg' py={{ base: 72, sm: 96 }}>
        <Stack align='center' gap='lg' renderRoot={revealRoot()}>
          <Title order={2} c='white' ta='center' className={classes.title}>
            {title}
          </Title>
          {text && (
            <Text c='white' size='lg' ta='center' opacity={0.9}>
              {text}
            </Text>
          )}
          {isExternal ? (
            <Button
              component='a'
              href={to}
              target='_blank'
              rel='noreferrer'
              variant='white'
              size='md'
              mt='xs'
            >
              {buttonText}
            </Button>
          ) : (
            <Button component={Link} to={to} variant='white' size='md' mt='xs'>
              {buttonText}
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default CtaBand;
