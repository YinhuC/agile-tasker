import React from 'react';
import { Box, BoxProps, Button, Container, Text, Title } from '@mantine/core';
import { motion } from 'motion/react';
import { FaGithub } from 'react-icons/fa';
import { GITHUB_URL } from '../../../utils/links';
import { reveal, rise, stagger } from '../../../theme/motion';
import classes from './BuildSection.module.css';

const layers = [
  {
    name: 'Client',
    items: [
      'React 19 and Vite',
      'Mantine UI',
      'Redux Toolkit',
      'Drag and drop with hello-pangea/dnd',
      'Motion',
    ],
  },
  {
    name: 'API',
    items: [
      'NestJS',
      'Passport local strategy',
      'Session cookies',
      'class-validator DTOs',
    ],
  },
  {
    name: 'Data',
    items: [
      'PostgreSQL',
      'TypeORM entities and migrations',
      'Seeded demo account',
    ],
  },
  {
    name: 'Quality',
    items: [
      'Vitest and Testing Library',
      'Jest on the API',
      'Hosted on Render',
      'MIT licence',
    ],
  },
];

function BuildSection({ ...props }: BoxProps) {
  return (
    <Box id='build' className={classes.root} {...props}>
      <Container size='xl'>
        <motion.div className={classes.head} {...reveal} variants={rise}>
          <Title order={2} c='white'>
            Built end to end.
          </Title>
          <Text className={classes.lede}>
            A React client talks to a NestJS API over a session cookie, and
            TypeORM keeps it all in PostgreSQL. Every layer is in one public
            repository.
          </Text>
        </motion.div>
        <motion.div
          className={classes.layers}
          {...reveal}
          variants={stagger(0.08)}
        >
          {layers.map((layer) => (
            <motion.section
              key={layer.name}
              className={classes.layer}
              variants={rise}
            >
              <h3 className={classes.layerName}>{layer.name}</h3>
              <ul>
                {layer.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.section>
          ))}
        </motion.div>
        <Button
          component='a'
          href={GITHUB_URL}
          target='_blank'
          rel='noreferrer'
          size='lg'
          leftSection={<FaGithub aria-hidden />}
          mt={{ base: 40, sm: 56 }}
        >
          Read the source on GitHub
        </Button>
      </Container>
    </Box>
  );
}

export default BuildSection;
