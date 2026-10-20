import React from 'react';
import { Box, BoxProps, Button, Container, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import StockCard from '../../../components/StockCard';
import { reveal, rise } from '../../../theme/motion';
import classes from './DemoSection.module.css';

function DemoSection({ ...props }: BoxProps) {
  return (
    <Box className={classes.root} {...props}>
      <Container size='xl'>
        <motion.div {...reveal} variants={rise}>
          <StockCard className={classes.inner}>
            <Title order={2} className={classes.title}>
              Start planning in a minute.
            </Title>
            <div>
              <Text className={classes.lede}>
                Free to start, no card needed. Only the frontend is hosted right
                now, so clone the repo to run the full app.
              </Text>
              <div className={classes.actions}>
                <Button component={Link} to='/register' variant='ink' size='lg'>
                  Start for free
                </Button>
                <Button
                  component={Link}
                  to='/login'
                  variant='outline'
                  size='lg'
                >
                  Sign in
                </Button>
              </div>
            </div>
          </StockCard>
        </motion.div>
      </Container>
    </Box>
  );
}

export default DemoSection;
