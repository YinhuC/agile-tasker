import React, { useRef, useState } from 'react';
import {
  Container,
  ContainerProps,
  Image,
  Center,
  BackgroundImage,
  Skeleton,
} from '@mantine/core';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import LaptopImage from '../../../assets/images/mac/mac-board.png';
import BackgroundWaveImage from '../../../assets/images/wave.svg?no-inline';
import classes from './LaptopSection.module.css';

/** The laptop grows onto the wave as it scrolls up out of the hero. */
function LaptopSection({ ...props }: ContainerProps) {
  const [loading, setLoading] = useState(true);
  const still = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 30%'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  return (
    <BackgroundImage src={BackgroundWaveImage}>
      <Container size='xl' py={{ base: 32, sm: 48 }} {...props}>
        <Center>
          <motion.div
            ref={ref}
            className={classes.laptop}
            style={still ? undefined : { scale, y }}
          >
            {loading && (
              <Skeleton
                radius={12}
                w='100%'
                style={{ aspectRatio: '1114 / 670' }}
              />
            )}
            <Image
              src={LaptopImage}
              w='100%'
              display={loading ? 'none' : 'block'}
              alt='Agile Tasker workspaces on a MacBook'
              onLoad={() => setLoading(false)}
            />
          </motion.div>
        </Center>
      </Container>
    </BackgroundImage>
  );
}

export default LaptopSection;
