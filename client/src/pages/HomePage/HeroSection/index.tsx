import React, { useRef } from 'react';
import { Container, Text, Title, Button, BoxProps, Box } from '@mantine/core';
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
import { TbInfoCircle } from 'react-icons/tb';

import DeskBoard from '../../../assets/images/screens/desk-board.webp';
import PhoneBoard from '../../../assets/images/screens/phone-board.webp';
import ScreenFrame from '../../../components/ScreenFrame';
import StockCard from '../../../components/StockCard';
import { GITHUB_URL } from '../../../utils/links';
import { EASE_OUT, enter, rise, settle, stagger } from '../../../theme/motion';
import classes from './HeroSection.module.css';

type LayerProps = {
  className: string;
  children: React.ReactNode;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  scroll: MotionValue<number>;
  depth: number;
  lift: number;
  delay: number;
  still: boolean;
};

const SPRING = { stiffness: 140, damping: 22, mass: 0.5 };

const fields = [
  { label: 'Setup', value: 'Under a minute' },
  { label: 'Drag and drop', value: 'Every list' },
  { label: 'Works on', value: 'Desktop and phone' },
  { label: 'Starts at', value: '$0' },
];

const slots = [
  { name: 'To do', count: '03' },
  { name: 'Doing', count: '02' },
  { name: 'Done', count: '04' },
];

/** One layer of the hero stage; depth is pointer travel in px, lift is scroll travel. */
function ParallaxLayer({
  className,
  children,
  pointerX,
  pointerY,
  scroll,
  depth,
  lift,
  delay,
  still,
}: LayerProps) {
  const x = useTransform(pointerX, (value) => value * depth);
  const y = useTransform(
    [pointerY, scroll],
    ([py, progress]: number[]) => py * depth - progress * lift
  );

  return (
    <motion.div
      className={className}
      style={still ? undefined : { x, y }}
      initial={still || delay === 0 ? false : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

function HeroSection({ ...props }: BoxProps) {
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
      <Container size='xl' className={classes.grid}>
        <motion.div className={classes.cardSlot} {...enter} variants={rise}>
          <StockCard className={classes.card}>
            <div className={classes.head}>
              <span className={classes.number} aria-hidden>
                01
              </span>
              <dl className={classes.meta}>
                <div>
                  <dt>Product</dt>
                  <dd>Kanban task boards</dd>
                </div>
                <div>
                  <dt>Free plan</dt>
                  <dd>No card needed</dd>
                </div>
              </dl>
            </div>
            <Title order={1} className={classes.title}>
              Plan it, move it, finish it.
            </Title>
            <dl className={classes.fields}>
              {fields.map((field) => (
                <div key={field.label} className={classes.field}>
                  <dt>{field.label}</dt>
                  <dd>{field.value}</dd>
                </div>
              ))}
            </dl>
            <Text className={classes.lede}>
              Put every project on one board. Group work into workspaces, break
              it into lists and cards, and drag each card from To do to Done, at
              your desk or on your phone.
            </Text>
            <div className={classes.actions}>
              <Button component={Link} to='/register' variant='ink' size='lg'>
                Start for free
              </Button>
              <Button
                component={Link}
                to='/#pricing'
                variant='outline'
                size='lg'
              >
                See pricing
              </Button>
              <span className={classes.barcode} aria-hidden />
            </div>
          </StockCard>
        </motion.div>

        <motion.div
          className={classes.rack}
          {...enter}
          variants={stagger(0.08, 0.15)}
        >
          <div className={classes.slots} aria-hidden>
            {slots.map((slot) => (
              <motion.div
                key={slot.name}
                className={classes.slot}
                variants={rise}
              >
                {slot.name}
                <span>{slot.count}</span>
              </motion.div>
            ))}
          </div>

          <motion.div className={classes.sleeve} variants={settle}>
            <Box visibleFrom='md' className={classes.perspective}>
              <motion.div
                ref={stageRef}
                className={classes.stage}
                style={still ? undefined : { rotateX, rotateY }}
              >
                <ParallaxLayer
                  {...layerProps}
                  className={classes.windowLayer}
                  depth={10}
                  lift={0}
                  delay={0}
                >
                  <ScreenFrame kind='window' label='agile tasker / Portfolio'>
                    <img
                      src={DeskBoard}
                      width={1600}
                      height={1000}
                      alt='The Portfolio project board with To do, Doing, Review and Done lists'
                    />
                  </ScreenFrame>
                </ParallaxLayer>
                <ParallaxLayer
                  {...layerProps}
                  className={classes.phoneLayer}
                  depth={28}
                  lift={70}
                  delay={0.25}
                >
                  <ScreenFrame kind='phone'>
                    <img src={PhoneBoard} width={780} height={1688} alt='' />
                  </ScreenFrame>
                </ParallaxLayer>
              </motion.div>
            </Box>
            <ScreenFrame kind='phone' hiddenFrom='md' className={classes.phone}>
              <img
                src={PhoneBoard}
                width={780}
                height={1688}
                alt='The Portfolio project board on a phone'
              />
            </ScreenFrame>
          </motion.div>

          <motion.p className={classes.note} variants={rise}>
            <TbInfoCircle aria-hidden />
            <span>
              Only the frontend is hosted right now, so signing in won't work
              here. For the full app,{' '}
              <a href={GITHUB_URL} target='_blank' rel='noreferrer'>
                clone the repo
              </a>
              .
            </span>
          </motion.p>
        </motion.div>
      </Container>
    </Box>
  );
}

export default HeroSection;
