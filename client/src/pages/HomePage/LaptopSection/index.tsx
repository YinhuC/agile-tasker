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
      <Container size='xl' py={30} {...props}>
        <Center>
          <Skeleton
            width={(window.innerWidth / 100) * 70}
            radius={12}
            height={(window.innerWidth / 100) * 45}
            display={loading ? 'block' : 'none'}
          />
          <Image
            src={LaptopImage}
            w='100%'
            miw={300}
            maw={1100}
            display={loading ? 'none' : 'block'}
            alt='agiler tasker on laptop'
            onLoad={() => setLoading(false)}
          />
        </Center>
      </Container>
    </BackgroundImage>
  );
}

export default LaptopSection;
