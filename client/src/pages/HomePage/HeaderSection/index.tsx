import React from 'react';
import {
  Center,
  Container,
  Flex,
  Stack,
  Title,
  Text,
  Button,
} from '@mantine/core';

function HeaderSection() {
  return (
    <Container size='xl'>
      <Flex
        direction='row'
        justify='center'
        align='center'
        gap={50}
        sx={{ width: '100%' }}
      >
        <Stack sx={{ width: '45%' }}>
          <Title order={1} mb={10}>
            Unmatched Project Efficiency.
          </Title>
          <Text sx={{ lineHeight: '160%' }} size={18} mb={20}>
            Seamlessly Manage Projects and Foster Team Collaboration, Regardless
            of Physical Proximity.
          </Text>
          <Flex>
            <Button size='md' mr='0.5rem'>
              Puchase Now
            </Button>
            <Button size='md' variant='white'>
              Learn More
            </Button>
          </Flex>
        </Stack>
        <Center sx={{ width: '45%' }}>Image</Center>
      </Flex>
    </Container>
  );
}

export default HeaderSection;
