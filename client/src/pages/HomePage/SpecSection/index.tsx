import React, { useRef } from 'react';
import { Box, BoxProps, Container, Title } from '@mantine/core';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import LaptopImage from '../../../assets/images/mac/mac-board.png';
import StockCard from '../../../components/StockCard';
import { reveal, rise, stagger } from '../../../theme/motion';
import classes from './SpecSection.module.css';

const specs = [
  {
    name: 'Accounts',
    detail: 'Register, sign in and sign out. Sessions live in a secure cookie.',
  },
  {
    name: 'Workspaces',
    detail: 'Keep projects grouped. Create, rename or delete them.',
  },
  {
    name: 'Projects',
    detail: 'A name and a short description, inside a workspace.',
  },
  {
    name: 'Lists',
    detail: 'Your stages. Add, rename and drag them into any order.',
  },
  {
    name: 'Cards',
    detail:
      'A name and a description. Create, edit, delete and drag them between lists.',
  },
  {
    name: 'Phones',
    detail: 'Every screen works on a small screen, the board included.',
  },
];

/** Honest feature sheet beside the desktop screenshot, which settles into its frame on scroll. */
function SpecSection({ ...props }: BoxProps) {
  const still = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 30%'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <Box className={classes.root} {...props}>
      <Container size='xl'>
        <StockCard stock='blue' className={classes.layout}>
          <div>
            <motion.div {...reveal} variants={rise}>
              <Title order={2} className={classes.title}>
                Everything it does, and nothing it doesn’t.
              </Title>
            </motion.div>
            <motion.dl
              className={classes.sheet}
              {...reveal}
              variants={stagger(0.06)}
            >
              {specs.map((spec) => (
                <motion.div
                  key={spec.name}
                  className={classes.row}
                  variants={rise}
                >
                  <dt>{spec.name}</dt>
                  <dd>{spec.detail}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
          <motion.figure
            ref={ref}
            className={classes.figure}
            style={still ? undefined : { scale, y }}
          >
            <img
              src={LaptopImage}
              alt='Workspaces and their projects in agile tasker on a laptop'
              loading='lazy'
            />
            <figcaption>Workspaces and their projects, on desktop.</figcaption>
          </motion.figure>
        </StockCard>
      </Container>
    </Box>
  );
}

export default SpecSection;
