import React from 'react';
import { Box, BoxProps, Container, Text, Title } from '@mantine/core';
import { motion } from 'motion/react';
import PhoneImg from '../../../assets/images/iphone/iphone-all-transparent.png';
import { reveal, rise, settle } from '../../../theme/motion';
import classes from './PhoneShowcase.module.css';

function PhoneShowcase({ ...props }: BoxProps) {
  return (
    <Box className={classes.root} {...props}>
      <Container size='xl'>
        <motion.div className={classes.copy} {...reveal} variants={rise}>
          <Title order={2}>The same board in your pocket.</Title>
          <Text className={classes.lede}>
            Sign up, sign in, open a project and drag cards with your thumb.
            Nothing is cut down for the small screen.
          </Text>
        </motion.div>
        <motion.div className={classes.rack} {...reveal} variants={settle}>
          <div className={classes.rail} aria-hidden>
            Small screen
            <span>390 px</span>
          </div>
          <div className={classes.sleeve}>
            <img
              src={PhoneImg}
              alt='agile tasker sign up, project, workspace and sign in screens on phones'
              className={classes.image}
              loading='lazy'
              decoding='async'
            />
          </div>
        </motion.div>
      </Container>
    </Box>
  );
}

export default PhoneShowcase;
