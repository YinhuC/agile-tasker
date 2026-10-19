import React, { useRef, useState } from 'react';
import { Box, BoxProps, Container, Text, Title } from '@mantine/core';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react';
import { EASE_OUT } from '../../../theme/motion';
import classes from './HowSection.module.css';

type DemoCard = { id: string; title: string };

const steps = [
  {
    title: 'Make a workspace, then a project.',
    body: 'Workspaces keep projects apart. Each project gets a name and a short description.',
  },
  {
    title: 'Add lists, then cards.',
    body: 'Lists are your stages, named however you work. Cards carry a name and a description you can edit at any time.',
  },
  {
    title: 'Drag the card to Done.',
    body: 'Move cards between lists or reorder them in place. The new order saves the moment you drop.',
  },
];

const columns: { name: string; cards: DemoCard[] }[] = [
  {
    name: 'To do',
    cards: [
      { id: '08', title: 'Plan sprint goals' },
      { id: '09', title: 'Book the retro' },
    ],
  },
  { name: 'Doing', cards: [{ id: '05', title: 'Design review' }] },
  {
    name: 'Done',
    cards: [
      { id: '02', title: 'Set up workspace' },
      { id: '03', title: 'Invite the team' },
    ],
  },
];

const TRAVELLER: DemoCard = { id: '07', title: 'Write release notes' };

function BoardCard({ card }: { card: DemoCard }) {
  return (
    <div className={classes.card}>
      <span className={classes.cardId}>#{card.id}</span>
      <span className={classes.cardTitle}>{card.title}</span>
    </div>
  );
}

/** Scroll carries one card from To do to Done; red marks it only while it moves. */
function HowSection({ ...props }: BoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion() ?? false;
  const [scrolledStep, setScrolledStep] = useState(0);
  const [moving, setMoving] = useState(false);
  const step = still ? steps.length - 1 : scrolledStep;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setScrolledStep(
      Math.min(steps.length - 1, Math.floor(progress * steps.length))
    );
  });

  return (
    <Box
      id='how'
      ref={ref}
      className={classes.root}
      data-still={still || undefined}
      {...props}
    >
      <div className={classes.sticky}>
        <Container size='xl' className={classes.layout}>
          <div>
            <Title order={2} className={classes.title}>
              One card, three moves.
            </Title>
            <ol className={classes.steps}>
              {steps.map((item, index) => (
                <li
                  key={item.title}
                  className={classes.step}
                  data-active={index === step || undefined}
                  data-done={index < step || undefined}
                >
                  <span className={classes.stepNo}>{index + 1}/3</span>
                  <div>
                    <Title order={3} className={classes.stepTitle}>
                      {item.title}
                    </Title>
                    <Text className={classes.stepBody}>{item.body}</Text>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div
            className={classes.board}
            role='img'
            aria-label='Example board: a card moves from To do through Doing to Done'
          >
            <LayoutGroup>
              {columns.map((column, index) => (
                <div key={column.name} className={classes.column}>
                  <div className={classes.columnHead}>
                    <span>{column.name}</span>
                    <span className={classes.count}>
                      {String(
                        column.cards.length + (step === index ? 1 : 0)
                      ).padStart(2, '0')}
                    </span>
                  </div>
                  <div className={classes.stack}>
                    {step === index && (
                      <motion.div
                        layoutId='traveller'
                        className={classes.traveller}
                        data-moving={moving || undefined}
                        transition={{
                          type: 'spring',
                          stiffness: 220,
                          damping: 28,
                        }}
                        onLayoutAnimationStart={() => setMoving(true)}
                        onLayoutAnimationComplete={() => setMoving(false)}
                      >
                        <BoardCard card={TRAVELLER} />
                        <AnimatePresence>
                          {index === columns.length - 1 && !moving && (
                            <motion.span
                              className={classes.stamp}
                              initial={{ opacity: 0, scale: 1.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.15 },
                              }}
                              transition={{ duration: 0.35, ease: EASE_OUT }}
                            >
                              Done
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                    {column.cards.map((card) => (
                      <motion.div key={card.id} layout='position'>
                        <BoardCard card={card} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </LayoutGroup>
          </div>
        </Container>
      </div>
    </Box>
  );
}

export default HowSection;
