import React from 'react';
import {
  Container,
  Flex,
  Title,
  Text,
  Stack,
  Card,
  SimpleGrid,
  Button,
  ContainerProps,
} from '@mantine/core';

function FeatureSection({ ...props }: ContainerProps) {
  return (
    <Container size='lg' py={100} {...props}>
      <Flex>
        <Stack justify='center' gap={5} mx={20}>
          <Text tt='uppercase' fw={700}>
            Unlock powerful growth strategies.
          </Text>
          <Title order={1} mb={10}>
            Maximize your potential with Agile Tasker.
          </Title>
          <Text>
            Agile Tasker's intuitive features enable any team to swiftly
            establish and personalize workflows for virtually any task
          </Text>

          <SimpleGrid
            cols={{ base: 1, xs: 2, sm: 3 }}
            spacing={{ base: 'sm', sm: 'md', md: 'lg' }}
            my={30}
          >
            <Card
              padding='lg'
              radius='md'
              withBorder
              h='100%'
              bg='gray.1'
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Title order={2} mb={15}>
                Integrations
              </Title>
              <Text c='dimmed' size='sm' mb={20}>
                Easily integrate the apps your team relies on into your Agile
                workflow or enhance it with a Power-Up tailored to your unique
                requirements.
              </Text>
              <Button mt='auto' variant='outline'>
                Insepct Integrations
              </Button>
            </Card>
            <Card
              padding='lg'
              radius='md'
              withBorder
              h='100%'
              bg='gray.1'
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Title order={2} mb={15}>
                Automation
              </Title>
              <Text c='dimmed' size='sm' mb={20}>
                Every Tasker board comes with built-in no-code automation.
                Concentrate on your most important tasks while letting the
                robots handle the rest.
              </Text>
              <Button mt='auto' variant='outline'>
                Analyse Automations
              </Button>
            </Card>
            <Card
              padding='lg'
              radius='md'
              withBorder
              h='100%'
              bg='gray.1'
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Title order={2} mb={15}>
                Enterprise
              </Title>
              <Text c='dimmed' size='sm' mb={20}>
                The beloved productivity tool for teams, equipped with the
                features and security essential for scalability.
              </Text>
              <Button mt='auto' variant='outline'>
                Explore Enterprise
              </Button>
            </Card>
          </SimpleGrid>
        </Stack>
      </Flex>
    </Container>
  );
}

export default FeatureSection;
