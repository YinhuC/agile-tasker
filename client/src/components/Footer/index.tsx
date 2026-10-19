import React from 'react';
import { Text, Container, Box, BoxProps, Group } from '@mantine/core';
import { Link } from 'react-router';
import { FaGithub } from 'react-icons/fa';
import Wordmark from '../Wordmark';
import { GITHUB_URL } from '../../utils/links';
import classes from './Footer.module.css';

function Footer({ ...props }: BoxProps) {
  return (
    <Box component='footer' className={classes.root} {...props}>
      <Container size='xl' py={{ base: 48, sm: 64 }}>
        <Box className={classes.top}>
          <Wordmark to='/' size={28} />
          <Group gap='xl' component='nav'>
            <Link to='/#how' className={classes.link}>
              How it works
            </Link>
            <Link to='/#build' className={classes.link}>
              The build
            </Link>
            <Link to='/login' className={classes.link}>
              Sign in
            </Link>
            <a
              href={GITHUB_URL}
              target='_blank'
              rel='noreferrer'
              className={classes.link}
            >
              <FaGithub aria-hidden /> Source
            </a>
          </Group>
        </Box>
        <Box className={classes.bottom}>
          <Text size='sm' className={classes.muted}>
            A portfolio project. Open source under the MIT licence.
          </Text>
          <Text size='sm' className={classes.muted}>
            © {new Date().getFullYear()} agile tasker
          </Text>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
