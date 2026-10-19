import React from 'react';
import { Box, Image, Button, Container, Group, BoxProps } from '@mantine/core';
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { notifications } from '@mantine/notifications';
import { GeneralErrorObject } from '../../utils/notification.utils';
import { postAuthLogout } from '../../api/auth.api';
import LogoDark from '../../assets/logos/logo-dark.png';
import SmallLogo from '../../assets/logos/logo-small.png';
import { usePrevious, useWindowScroll } from '@mantine/hooks';
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
      <Container size='lg' className={classes.inner}>
        <Group gap={48} wrap='nowrap'>
          <Link to={'/'}>
            <Image
              src={LogoDark}
              alt='agile-tasker logo'
              className={classes.logo}
              visibleFrom='sm'
            />
            <Box className={classes.logoSmall} hiddenFrom='sm'>
              <Image src={SmallLogo} alt='a. logo' />
            </Box>
          </Link>
          {!user && (
            <nav className={classes.nav}>
              <NavLink to={'/views'} className={classes.link}>
                Views
              </NavLink>
              <NavLink to={'/plans'} className={classes.link}>
                Pricing
              </NavLink>
            </nav>
          )}
        </Group>
        <Group gap='lg' wrap='nowrap'>
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
                size='compact-sm'
                aria-label='Logout'
              >
                Logout
              </Button>
            </>
          ) : (
            <Button component={Link} to={'/login'} aria-label='Sign In'>
              Sign In
            </Button>
          )}
        </Group>
      </Container>
    </Box>
  );
};

export default Header;
