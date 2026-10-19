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
              Open the demo board.
            </Title>
            <div>
              <Text className={classes.lede}>
                The demo account is already filled in on the sign-in form. On
                the first visit, give the free server about 30 seconds to wake
                up.
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
              </div>
            </div>
          </StockCard>
        </motion.div>
      </Container>
    </Box>
  );
}

export default DemoSection;
