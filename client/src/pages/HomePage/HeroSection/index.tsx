import React, { useRef, useState } from 'react';
import {
  Container,
  Text,
  Title,
  Button,
  BoxProps,
  Box,
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
import { TbClockHour4 } from 'react-icons/tb';

import MacScreen from '../../../assets/images/parallax/project-parallax.png';
import PhoneScreen from '../../../assets/images/parallax/phone-parallax.png';
import IphoneProject from '../../../assets/images/iphone/iphone-project.png';
import StockCard from '../../../components/StockCard';
import { EASE_OUT, enter, rise, settle, stagger } from '../../../theme/motion';
import classes from './HeroSection.module.css';

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

const fields = [
  { label: 'Workspace', value: 'Personal' },
  { label: 'Project', value: 'Portfolio' },
  { label: 'List', value: 'Doing' },
  { label: 'Card', value: 'Ship the redesign' },
];

const slots = [
  { name: 'To do', count: '03' },
  { name: 'Doing', count: '01' },
  { name: 'Done', count: '05' },
];

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

function HeroSection({ ...props }: BoxProps) {
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
      <Container size='xl' className={classes.grid}>
        <motion.div className={classes.cardSlot} {...enter} variants={rise}>
          <StockCard className={classes.card}>
            <div className={classes.head}>
              <span className={classes.number} aria-hidden>
                01
              </span>
              <dl className={classes.meta}>
                <div>
                  <dt>Card type</dt>
                  <dd>Kanban board</dd>
                </div>
                <div>
                  <dt>Built with</dt>
                  <dd>React · NestJS · PostgreSQL</dd>
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
              A full-stack kanban board. Workspaces hold projects, projects hold
              lists, lists hold cards, and every card drags from To do to Done.
              Open the demo and move a few.
            </Text>
            <div className={classes.actions}>
              <Button component={Link} to='/login' variant='ink' size='lg'>
                Open the demo board
              </Button>
              <Button
                component={Link}
                to='/register'
                variant='outline'
                size='lg'
              >
                Create an account
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
                {!loaded && (
                  <Skeleton radius={10} className={classes.skeleton} />
                )}
                <ParallaxLayer
                  {...layerProps}
                  src={MacScreen}
                  alt='The agile tasker project board on desktop'
                  depth={10}
                  lift={0}
                  delay={0}
                  onLoad={() => setLoaded(true)}
                />
                {loaded && (
                  <ParallaxLayer
                    {...layerProps}
                    src={PhoneScreen}
                    alt=''
                    depth={28}
                    lift={60}
                    delay={0.15}
                  />
                )}
              </motion.div>
            </Box>
            <img
              src={IphoneProject}
              className={classes.phone}
              alt='The agile tasker project board on a phone'
            />
          </motion.div>

          <motion.p className={classes.note} variants={rise}>
            <TbClockHour4 aria-hidden />
            The demo account is filled in for you. The free server can take
            about 30 seconds to wake up on the first visit.
          </motion.p>
        </motion.div>
      </Container>
    </Box>
  );
}

export default HeroSection;
