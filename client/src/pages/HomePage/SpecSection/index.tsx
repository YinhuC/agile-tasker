import React, { useEffect, useRef } from 'react';
import { Box, BoxProps, Container, Title } from '@mantine/core';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import BoardDemo from '../../../assets/video/board-demo.mp4';
import BoardDemoPoster from '../../../assets/images/screens/board-demo-poster.webp';
import ScreenFrame from '../../../components/ScreenFrame';
import StockCard from '../../../components/StockCard';
import { reveal, rise, stagger } from '../../../theme/motion';
import classes from './SpecSection.module.css';

const specs = [
  {
    name: 'Workspaces',
    detail:
      'Keep work, home and side projects apart, each with its own projects.',
  },
  {
    name: 'Boards',
    detail: 'Every project is a board of lists you name and order yourself.',
  },
  {
    name: 'Cards',
    detail:
      'Give each task a name and notes, then edit it whenever plans change.',
  },
  {
    name: 'Drag and drop',
    detail:
      'Move cards between lists or reorder them. Every drop saves instantly.',
  },
  {
    name: 'On your phone',
    detail: 'The whole board works on a small screen, drag and drop included.',
  },
  {
    name: 'Secure sign in',
    detail: 'Your own account, with sessions kept in a secure cookie.',
  },
];

/** Real recording of the board; plays only while on screen, and never under reduced motion. */
function BoardVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const still = useReducedMotion() ?? false;

  useEffect(() => {
    const video = ref.current;
    if (!video || still) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [still]);

  return (
    <video
      ref={ref}
      src={BoardDemo}
      poster={BoardDemoPoster}
      width={1600}
      height={1000}
      muted
      loop
      playsInline
      preload='metadata'
      controls={still}
      aria-label='Two cards dragged from Doing and Review into Done on the Portfolio board'
    />
  );
}

/** Feature sheet beside the board recording, which settles into place on scroll. */
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
    <Box id='features' className={classes.root} {...props}>
      <Container size='xl'>
        <StockCard stock='blue' className={classes.layout}>
          <div>
            <motion.div {...reveal} variants={rise}>
              <Title order={2} className={classes.title}>
                Everything you need to move work forward.
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
            <ScreenFrame kind='window' label='agile tasker / Portfolio'>
              <BoardVideo />
            </ScreenFrame>
            <figcaption>
              Recorded on the real board. Every drop saves the new order.
            </figcaption>
          </motion.figure>
        </StockCard>
      </Container>
    </Box>
  );
}

export default SpecSection;
