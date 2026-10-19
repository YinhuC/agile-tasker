import React from 'react';
import { Box, Image, Button, Flex, FlexProps, Text } from '@mantine/core';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { notifications } from '@mantine/notifications';
import { GeneralErrorObject } from '../../utils/notification.utils';
import { postAuthLogout } from '../../api/auth.api';
import LogoDark from '../../assets/logos/logo-dark.png';
import SmallLogo from '../../assets/logos/logo-small.png';
import { usePrevious, useWindowScroll } from '@mantine/hooks';
import classes from './Header.module.css';

const Header: React.FC<FlexProps> = ({ ...props }) => {
  const { user, removeUser } = useAuth();
  const navigate = useNavigate();
  const [scroll] = useWindowScroll();
  const prevScroll = usePrevious(scroll);

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
    <Flex
      mx={5}
      justify='space-around'
      align='center'
      className={classes.root}
      style={{
        marginTop:
          (prevScroll && scroll.y < prevScroll.y) || scroll.y < 50 ? 0 : -100,
      }}
      {...props}
    >
      <Flex align='center' justify='center' visibleFrom='sm'>
        <Link to={'/'}>
          <Image src={LogoDark} w={200} alt='agile-tasker logo' mr={80} />
        </Link>
        {!user && (
          <>
            <Link to={'/views'} style={{ textDecorationLine: 'none' }}>
              <Text c='gray.8' fw={500} mr={40}>
                Views
              </Text>
            </Link>
            <Link to={'/plans'} style={{ textDecorationLine: 'none' }}>
              <Text c='gray.8' fw={500}>
                Pricing
              </Text>
            </Link>
          </>
        )}
      </Flex>
      <Box component={Link} to={'/'} hiddenFrom='sm'>
        <Image src={SmallLogo} w={100} alt='a. logo' />
      </Box>
      <Flex justify='flex-end' align='center' w={200} mr={20}>
        {user ? (
          <>
            <Button
              component={Link}
              variant='transparent'
              color='dark'
              to={`/boards/${user.id}`}
              fw={400}
              mr={40}
              visibleFrom='sm'
              aria-label='Board'
            >
              Board
            </Button>
            <Button
              onClick={logout}
              variant='outline'
              size='compact-sm'
              radius='xs'
              aria-label='Logout'
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            component={Link}
            mr='0.5rem'
            to={'/login'}
            aria-label='Sign In'
          >
            Sign In
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
