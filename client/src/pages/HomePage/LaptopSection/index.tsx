import React, { useState } from 'react';
import {
  Container,
  ContainerProps,
  Image,
  Center,
  BackgroundImage,
  Skeleton,
} from '@mantine/core';
import LaptopImage from '../../../assets/images/mac/mac-board.png';
import BackgroundWaveImage from '../../../assets/images/wave.svg?no-inline';

function LaptopSection({ ...props }: ContainerProps) {
  const [loading, setLoading] = useState(true);

  return (
    <BackgroundImage src={BackgroundWaveImage}>
      <Container size='xl' py={{ base: 32, sm: 48 }} {...props}>
        <Center>
          {loading && (
            <Skeleton
              radius={12}
              w='100%'
              maw={1100}
              style={{ aspectRatio: '1114 / 670' }}
            />
          )}
          <Image
            src={LaptopImage}
            w='100%'
            miw={300}
            maw={1100}
            display={loading ? 'none' : 'block'}
            alt='Agile Tasker workspaces on a MacBook'
            onLoad={() => setLoading(false)}
          />
        </Center>
      </Container>
    </BackgroundImage>
  );
}

export default LaptopSection;
