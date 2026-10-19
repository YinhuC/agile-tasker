import React from 'react';
import { Box, Button, Container, Group, BoxProps } from '@mantine/core';
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { notifications } from '@mantine/notifications';
import { GeneralErrorObject } from '../../utils/notification.utils';
import { postAuthLogout } from '../../api/auth.api';
import { GITHUB_URL } from '../../utils/links';
import { usePrevious, useWindowScroll } from '@mantine/hooks';
import Wordmark from '../Wordmark';
import classes from './Header.module.css';

const Header: React.FC<BoxProps> = ({ ...props }) => {
  const { user, removeUser } = useAuth();
  const navigate = useNavigate();
  const [scroll] = useWindowScroll();
  const prevScroll = usePrevious(scroll);
  const isVisible = (prevScroll && scroll.y < prevScroll.y) || scroll.y < 50;

  const logout = async () => {
    try {
      await postAuthLogout();
      navigate(`/`);
      removeUser();
    } catch (err) {
      notifications.cleanQueue();
      notifications.show(GeneralErrorObject);
    }
  };

  return (
    <Box
      component='header'
      className={classes.root}
      data-hidden={isVisible ? undefined : true}
      {...props}
    >
      <Container size='xl' className={classes.inner}>
        <Group gap={40} wrap='nowrap'>
          <Wordmark to={user ? `/boards/${user.id}` : '/'} />
          {!user && (
            <nav className={classes.nav}>
              <Link to={'/#how'} className={classes.link}>
                How it works
              </Link>
              <Link to={'/#build'} className={classes.link}>
                The build
              </Link>
              <a
                href={GITHUB_URL}
                target='_blank'
                rel='noreferrer'
                className={classes.link}
              >
                GitHub
              </a>
            </nav>
          )}
        </Group>
        <Group gap='sm' wrap='nowrap'>
          {user ? (
            <>
              <NavLink
                to={`/boards/${user.id}`}
                className={classes.link}
                aria-label='Board'
              >
                Board
              </NavLink>
              <Button
                onClick={logout}
                variant='outline'
                color='steel.3'
                size='compact-md'
                aria-label='Logout'
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to={'/login'}
                variant='outline'
                color='steel.3'
                size='compact-md'
                aria-label='Sign In'
              >
                Sign in
              </Button>
              <Button
                component={Link}
                to={'/login'}
                size='compact-md'
                visibleFrom='xs'
              >
                Try the demo
              </Button>
            </>
          )}
        </Group>
      </Container>
    </Box>
  );
};

export default Header;
