import React, { useRef, useState } from 'react';
import {
  Container,
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
import {
  motion,
  MotionValue,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

import MacScreen from '../../../assets/images/parallax/project-parallax.png';
import PhoneScreen from '../../../assets/images/parallax/phone-parallax.png';
import DeviceSquare from '../../../assets/images/parallax/device-parallax.png';
import TeamSquare from '../../../assets/images/parallax/team-parallax.png';
import IphoneProject from '../../../assets/images/iphone/iphone-project.png';
import {
  EASE_OUT,
  enter,
  reveal,
  rise,
  settle,
  stagger,
} from '../../../theme/motion';
import classes from './HeaderSection.module.css';

type LayerProps = {
  src: string;
  alt: string;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  scroll: MotionValue<number>;
  depth: number;
  lift: number;
  delay: number;
  still: boolean;
  onLoad?: () => void;
};

const SPRING = { stiffness: 140, damping: 22, mass: 0.5 };

/** One transparent 1438x919 layer; depth is pointer travel in px, lift is scroll travel. */
function ParallaxLayer({
  src,
  alt,
  pointerX,
  pointerY,
  scroll,
  depth,
  lift,
  delay,
  still,
  onLoad,
}: LayerProps) {
  const x = useTransform(pointerX, (value) => value * depth);
  const y = useTransform(
    [pointerY, scroll],
    ([py, progress]: number[]) => py * depth - progress * lift
  );

  return (
    <motion.img
      className={classes.layer}
      src={src}
      alt={alt}
      onLoad={onLoad}
      style={still ? undefined : { x, y }}
      initial={still || delay === 0 ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    />
  );
}

function HeaderSection({ ...props }: BoxProps) {
  const [loaded, setLoaded] = useState(false);
  const still = useReducedMotion() ?? false;
  const stageRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, SPRING);
  const pointerY = useSpring(rawY, SPRING);
  const rotateY = useTransform(pointerX, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(pointerY, [-0.5, 0.5], [4, -4]);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start'],
  });
  const scroll = useTransform(scrollYProgress, [0, 1], [-0.5, 0.5]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    rawX.set(e.clientX / window.innerWidth - 0.5);
    rawY.set(e.clientY / window.innerHeight - 0.5);
  };
  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const layerProps = { pointerX, pointerY, scroll, still };

  return (
    <Box
      className={classes.root}
      onPointerMove={still ? undefined : handlePointerMove}
      onPointerLeave={still ? undefined : handlePointerLeave}
      {...props}
    >
      <Container size='xl' pt={{ base: 64, sm: 96 }} pb={{ base: 64, sm: 96 }}>
        <motion.div {...enter} variants={stagger(0.1)}>
          <Stack align='center' gap='lg' mb={{ base: 48, sm: 72 }}>
            <motion.div variants={rise}>
              <Title
                ta='center'
                order={1}
                c='white'
                fw={600}
                className={classes.title}
              >
                Unmatched Project Efficiency.
              </Title>
            </motion.div>
            <motion.div variants={rise}>
              <Text ta='center' size='lg' c='white' maw={620}>
                Seamlessly Manage Projects and Foster Team Collaboration,
                Regardless of Physical Proximity.
              </Text>
            </motion.div>
            <motion.div variants={rise}>
              <Button
                component={Link}
                variant='white'
                size='lg'
                mt='xs'
                to={'/register'}
                aria-label='Start 14-day free trial'
              >
                Start 14-day free trial
              </Button>
            </motion.div>
          </Stack>
        </motion.div>

        <Box visibleFrom='md' className={classes.perspective}>
          <motion.div
            ref={stageRef}
            className={classes.stage}
            style={still ? undefined : { rotateX, rotateY }}
          >
            {!loaded && <Skeleton radius={12} className={classes.skeleton} />}
            <ParallaxLayer
              {...layerProps}
              src={MacScreen}
              alt='Agile Tasker project board on desktop'
              depth={10}
              lift={0}
              delay={0}
              onLoad={() => setLoaded(true)}
            />
            {loaded && (
              <>
                <ParallaxLayer
                  {...layerProps}
                  src={PhoneScreen}
                  alt=''
                  depth={28}
                  lift={70}
                  delay={0.15}
                />
                <ParallaxLayer
                  {...layerProps}
                  src={TeamSquare}
                  alt=''
                  depth={46}
                  lift={130}
                  delay={0.3}
                />
                <ParallaxLayer
                  {...layerProps}
                  src={DeviceSquare}
                  alt=''
                  depth={46}
                  lift={150}
                  delay={0.4}
                />
              </>
            )}
          </motion.div>
        </Box>

        <Box hiddenFrom='md'>
          <motion.div {...enter} variants={settle}>
            <Image
              src={IphoneProject}
              w='100%'
              miw={250}
              maw={420}
              mx='auto'
              alt='Agile Tasker project board on iPhone'
            />
          </motion.div>
        </Box>
        <motion.div {...reveal} variants={rise}>
          <Title
            ta='center'
            order={2}
            fw={500}
            mt={{ base: 64, sm: 112 }}
            mx='auto'
            maw={860}
            className={classes.community}
          >
            Join the global community of over 2,000,000 teams leveraging Agile
            Tasker to achieve greater productivity.
          </Title>
        </motion.div>
      </Container>
    </Box>
  );
}

export default HeaderSection;
