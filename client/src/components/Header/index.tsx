import React from 'react';
import { Image, Button, Flex, MediaQuery, ContainerProps } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { notifications } from '@mantine/notifications';
import { GeneralErrorObject } from '../../utils/notification.utils';
import { postAuthLogout } from '../../api/auth.api';
import Logo from '../../assets/logos/logo-transparent.png';
import SmallLogo from '../../assets/logos/small-logo-transparent.png';
import { usePrevious, useWindowScroll } from '@mantine/hooks';

const Header: React.FC = ({ ...props }: ContainerProps) => {
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
      {...props}
      py='md'
      mx={5}
      justify='space-around'
      align='center'
      sx={{
        top: 0,
        position: 'fixed',
        zIndex: 9,
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'white',
        borderBottom: '1px solid lightgray',
        height: 80,
        marginTop:
          (prevScroll && scroll.y < prevScroll.y) || scroll.y < 50 ? 0 : -100,
        transition: 'margin-top 0.5s ease-out',
      }}
    >
      <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
        <Link to={'/'}>
          <Image src={Logo} width={200} alt='agile-tasker logo' />
        </Link>
      </MediaQuery>
      <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
        <Link to={'/'}>
          <Image
            src={SmallLogo}
            width={100}
            sx={{ overflow: 'hidden' }}
            alt='a. logo'
          />
        </Link>
      </MediaQuery>
      <Flex justify='flex-end' align='center' w={200} mr={20}>
        {user ? (
          <>
            <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
              <Button
                component={Link}
                variant='link'
                mr={20}
                to={'/'}
                sx={{ fontWeight: 400 }}
                aria-label='Home'
              >
                Home
              </Button>
            </MediaQuery>
            <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
              <Button
                component={Link}
                variant='link'
                to={`/boards/${user.id}`}
                sx={{ fontWeight: 400 }}
                mr={40}
                aria-label='Board'
              >
                Board
              </Button>
            </MediaQuery>
            <Button
              onClick={logout}
              variant='outline'
              compact
              radius='xs'
              aria-label='Logout'
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            component={Link}
            size='md'
            variant='outline'
            mr='0.5rem'
            to={'/login'}
            compact
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
