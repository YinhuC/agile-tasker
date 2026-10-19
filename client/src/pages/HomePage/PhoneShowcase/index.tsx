import React, { useRef } from 'react';
import { Box, BoxProps, Container, Text, Title } from '@mantine/core';
import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import PhoneLogin from '../../../assets/images/screens/phone-login.webp';
import PhoneWorkspaces from '../../../assets/images/screens/phone-workspaces.webp';
import PhoneBoard from '../../../assets/images/screens/phone-board.webp';
import PhoneCard from '../../../assets/images/screens/phone-card.webp';
import ScreenFrame from '../../../components/ScreenFrame';
import { reveal, rise, settle, stagger } from '../../../theme/motion';
import classes from './PhoneShowcase.module.css';

const phones = [
  {
    label: 'Sign in',
    src: PhoneLogin,
    alt: 'The sign in screen with the demo account filled in',
    travel: 40,
  },
  {
    label: 'Workspaces',
    src: PhoneWorkspaces,
    alt: 'Workspaces and their projects on a phone',
    travel: -30,
  },
  {
    label: 'Board',
    src: PhoneBoard,
    alt: 'The Portfolio board with its To do list on a phone',
    travel: 60,
  },
  {
    label: 'Edit card',
    src: PhoneCard,
    alt: 'Editing a card name and description on a phone',
    travel: -10,
  },
];

type PhoneProps = (typeof phones)[number] & {
  index: number;
  progress: MotionValue<number>;
  still: boolean;
};

/** One labelled phone; travel is how far it drifts against the scroll, in px. */
function Phone({
  label,
  src,
  alt,
  travel,
  index,
  progress,
  still,
}: PhoneProps) {
  const y = useTransform(progress, [0, 1], [travel, -travel]);

  return (
    <motion.figure className={classes.phone} variants={settle}>
      <div className={classes.slot} aria-hidden>
        {label}
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <motion.div style={still ? undefined : { y }}>
        <ScreenFrame kind='phone'>
          <img src={src} width={780} height={1688} alt={alt} loading='lazy' />
        </ScreenFrame>
      </motion.div>
    </motion.figure>
  );
}

function PhoneShowcase({ ...props }: BoxProps) {
  const still = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return (
    <Box className={classes.root} {...props}>
      <Container size='xl'>
        <motion.div className={classes.copy} {...reveal} variants={rise}>
          <Title order={2}>The same board in your pocket.</Title>
          <Text className={classes.lede}>
            Sign in, open a project and drag cards with your thumb. Nothing is
            cut down for the small screen.
          </Text>
        </motion.div>
        <motion.div
          ref={ref}
          className={classes.rack}
          {...reveal}
          variants={stagger(0.08)}
        >
          {phones.map((phone, index) => (
            <Phone
              key={phone.label}
              {...phone}
              index={index}
              progress={scrollYProgress}
              still={still}
            />
          ))}
        </motion.div>
      </Container>
    </Box>
  );
}

export default PhoneShowcase;
