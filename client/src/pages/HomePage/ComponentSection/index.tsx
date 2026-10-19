import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  Title,
  Text,
  BoxProps,
  Stack,
  Box,
  Group,
} from '@mantine/core';
import { LayoutGroup, motion, useInView, useReducedMotion } from 'motion/react';
import { FaRegEdit } from 'react-icons/fa';
import classes from './ComponentSection.module.css';

const concepts = [
  {
    title: 'Boards',
    color: 'var(--mantine-color-pink-7)',
    description:
      "Where tasks find order and progress never stalls. From 'to-dos' to 'heck yeah, done!'—it's all in one glance.",
  },
  {
    title: 'Lists',
    color: 'var(--mantine-color-teal-7)',
    description:
      "Task stages simplified: Start with To Do, Doing, or Done—or craft a custom workflow tailored to your team. With Agile Tasker, there's no wrong approach.",
  },
  {
    title: 'Cards',
    color: 'var(--mantine-color-dark-6)',
    description:
      'Cards are the essence of tasks and ideas, containing all details to drive completion. Progress seamlessly by moving cards across lists.',
  },
];

const columns = [
  {
    name: 'To do',
    cards: [{ title: 'Plan sprint goals', body: 'Agree the three outcomes.' }],
  },
  {
    name: 'Doing',
    cards: [{ title: 'Design review', body: 'Walk through the new board.' }],
  },
  {
    name: 'Done',
    cards: [{ title: 'Set up workspace', body: 'Invite the team.' }],
  },
];

const MOVING_CARD = {
  title: 'Write release notes',
  body: 'Summarise what shipped.',
};
const STEP_MS = 2600;

type DemoCard = { title: string; body: string };

function BoardCard({
  card,
  highlight,
}: {
  card: DemoCard;
  highlight?: boolean;
}) {
  return (
    <Box className={classes.card} data-highlight={highlight || undefined}>
      <Group justify='space-between' align='flex-start' wrap='nowrap' gap='xs'>
        <Text className={classes.cardTitle}>{card.title}</Text>
        <FaRegEdit className={classes.cardIcon} aria-hidden />
      </Group>
      <Text size='xs' c='gray.6' mt={4}>
        {card.body}
      </Text>
    </Box>
  );
}

/** Synthetic three-list board whose highlighted card steps across the lists while in view. */
function MiniBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const still = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || still) {
      return;
    }
    const timer = window.setInterval(
      () => setStep((current) => (current + 1) % columns.length),
      STEP_MS
    );
    return () => window.clearInterval(timer);
  }, [inView, still]);

  return (
    <Box
      ref={ref}
      className={classes.board}
      aria-label='Example board'
      role='img'
    >
      <LayoutGroup>
        {columns.map((column, index) => (
          <Box key={column.name} className={classes.column}>
            <Group justify='space-between' className={classes.columnHead}>
              <Text className={classes.columnName}>{column.name}</Text>
              <FaRegEdit className={classes.cardIcon} aria-hidden />
            </Group>
            <Stack gap={10}>
              {step === index && (
                <motion.div
                  layoutId='moving-card'
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                >
                  <BoardCard card={MOVING_CARD} highlight />
                </motion.div>
              )}
              {column.cards.map((card) => (
                <motion.div key={card.title} layout='position'>
                  <BoardCard card={card} />
                </motion.div>
              ))}
            </Stack>
          </Box>
        ))}
      </LayoutGroup>
    </Box>
  );
}

function ComponentSection({ ...props }: BoxProps) {
  return (
    <Box className={classes.root} {...props}>
      <Container size='lg' py={{ base: 72, sm: 112 }}>
        <Box className={classes.layout}>
          <Stack gap='xl' justify='center'>
            <Title order={1} className={classes.title}>
              Scalable project workflows for all types of endeavors.
            </Title>
            <Stack gap='lg' component='dl' m={0}>
              {concepts.map((concept) => (
                <Box key={concept.title} className={classes.concept}>
                  <Title
                    order={3}
                    component='dt'
                    className={classes.conceptTitle}
                    style={{ '--concept-color': concept.color }}
                  >
                    {concept.title}
                  </Title>
                  <Text component='dd' m={0} c='gray.7' size='sm'>
                    {concept.description}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Stack>
          <MiniBoard />
        </Box>
      </Container>
    </Box>
  );
}

export default ComponentSection;
