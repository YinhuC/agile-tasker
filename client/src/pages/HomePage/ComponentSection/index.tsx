import React from 'react';
import {
  Container,
  Flex,
  Title,
  Text,
  BoxProps,
  Stack,
  Card,
  SimpleGrid,
  Box,
} from '@mantine/core';

function ComponentSection({ ...props }: BoxProps) {
  return (
    <Box
      mt={{ base: 300, xxs: 250, sm: 180, md: 200, lg: 140 }}
      style={{
        background:
          'linear-gradient(180deg, #fff 0%, var(--mantine-color-cyan-0) 100%)',
      }}
      {...props}
    >
      <Container
        size='lg'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Flex>
          <Stack justify='center' gap={5} mx={20}>
            <Text tt='uppercase' fw={700}>
              Simplifying collaboration
            </Text>
            <Title order={1} mb={10}>
              Scalable project workflows for all types of endeavors.
            </Title>

            <SimpleGrid
              cols={{ base: 1, xs: 2, sm: 3 }}
              spacing={{ base: 'sm', sm: 'md', md: 'lg' }}
              my={30}
            >
              <Card shadow='md' padding='lg' radius='md' withBorder>
                <Title order={2} mb={10} c='pink.9'>
                  Boards
                </Title>
                <Text c='dimmed' size='sm'>
                  Where tasks find order and progress never stalls. From
                  'to-dos' to 'heck yeah, done!'—it's all in one glance.
                </Text>
              </Card>
              <Card shadow='sm' padding='lg' radius='md' withBorder>
                <Title order={2} mb={10} c='teal.9'>
                  Lists
                </Title>
                <Text c='dimmed' size='sm'>
                  Task stages simplified: Start with To Do, Doing, or Done—or
                  craft a custom workflow tailored to your team. With Agile
                  Tasker, there's no wrong approach.
                </Text>
              </Card>
              <Card shadow='sm' padding='lg' radius='md' withBorder>
                <Title order={2} mb={10} c='blue.9'>
                  Cards
                </Title>
                <Text c='dimmed' size='sm'>
                  Cards are the essence of tasks and ideas, containing all
                  details to drive completion. Progress seamlessly by moving
                  cards across lists.
                </Text>
              </Card>
            </SimpleGrid>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}

export default ComponentSection;
