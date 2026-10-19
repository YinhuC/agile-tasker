import React, { useState } from 'react';
import {
  Container,
  Flex,
  Stack,
  Title,
  Text,
  Button,
  BoxProps,
  Box,
  Image,
  Skeleton,
} from '@mantine/core';
import { Link } from 'react-router';
import { motion, useAnimation } from 'motion/react';
import { throttle } from 'lodash';

import MacScreen from '../../../assets/images/parallax/project-parallax.png';
import PhoneScreen from '../../../assets/images/parallax/phone-parallax.png';
import DeviceSquare from '../../../assets/images/parallax/device-parallax.png';
import TeamSquare from '../../../assets/images/parallax/team-parallax.png';
import IphoneProject from '../../../assets/images/iphone/iphone-project.png';
import classes from './HeaderSection.module.css';

function HeaderSection({ ...props }: BoxProps) {
  const [loading, setLoading] = useState(true);

  const imgAnimate1 = useAnimation();
  const imgAnimate2 = useAnimation();
  const imgAnimate3 = useAnimation();
  const imgAnimate4 = useAnimation();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = e;
    const moveX = window.innerWidth / 2 - clientX * 2;
    const moveY = window.innerHeight / 2 - clientY * 2;
    imgAnimate1.start({
      x: moveX / 250,
      y: moveY / 250,
    });
    imgAnimate2.start({
      x: moveX / 80,
      y: moveY / 80,
    });
    imgAnimate3.start({
      x: moveX / 50,
      y: moveY / 50,
    });
    imgAnimate4.start({
      x: moveX / 50,
      y: moveY / 50,
    });
  };
  const throttledMouseMove = throttle(handleMouseMove, 100);

  return (
    <Box
      onMouseMove={(e) => throttledMouseMove(e)}
      style={{
        background:
          'linear-gradient(180deg, var(--mantine-color-pink-7) 0%, var(--mantine-color-teal-3) 100%)',
      }}
      {...props}
    >
      <Container
        size='xl'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        pt={100}
        pb={50}
      >
        <Stack
          justify='center'
          align='center'
          w='100%'
          mb={60}
          mx={10}
        >
          <Title ta='center' order={1} c='white' fw={600}>
            Unmatched Project Efficiency.
          </Title>
          <Text ta='center' mb={10} size='lg' c='white'>
            Seamlessly Manage Projects and Foster Team Collaboration, Regardless
            of Physical Proximity.
          </Text>
          <Button
            component={Link}
            variant='light'
            size='md'
            mr='0.5rem'
            to={'/register'}
            aria-label='Start 14-day free trial'
          >
            Start 14-day free trial
          </Button>
        </Stack>
        <Flex mx={20} visibleFrom='md' className={classes.parallax}>
            <Skeleton
              width={(window.innerWidth / 100) * 90}
              radius={12}
              height={(window.innerHeight / 100) * 75}
              display={loading ? 'block' : 'none'}
            />
            <motion.img
              animate={imgAnimate1}
              src={MacScreen}
              alt='project screen wide screen'
              onLoad={() => setLoading(false)}
              style={{ display: loading ? 'none' : 'block' }}
            />
            <Box pos='absolute'>
              <motion.img
                animate={imgAnimate2}
                src={PhoneScreen}
                alt='project screen mobile screen'
              />
            </Box>
            <Box pos='absolute'>
              <motion.img
                animate={imgAnimate3}
                src={DeviceSquare}
                alt='device info'
              />
            </Box>
            <Box pos='absolute'>
              <motion.img
                animate={imgAnimate4}
                src={TeamSquare}
                alt='team info'
              />
            </Box>
          </Flex>
        <Image
          src={IphoneProject}
          w='100%'
          miw={250}
          maw={500}
          hiddenFrom='md'
          alt='Iphone project page'
        />
        <Title ta='center' order={2} fw={500} mt={100} mx={10}>
          Join the global community of over 2,000,000 teams leveraging Agile
          Tasker to achieve greater productivity.
        </Title>
      </Container>
    </Box>
  );
}

export default HeaderSection;
