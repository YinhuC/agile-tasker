import React from 'react';
import {
  Container,
  Box,
  Title,
  Button,
  Stack,
} from '@mantine/core';
import Footer from '../../components/Footer';
import PriceSection from './PriceSection';
import AccordionSection from './AccordionSection';

function PlansPage() {
  return (
    <>
      <PriceSection />
      <AccordionSection />
      <Box
        style={{
          background:
            'linear-gradient(180deg, var(--mantine-color-pink-0) 0%, #fff 100%)',
        }}
      >
        <Container size='lg' py={80}>
          <Stack>
            <Title order={2} fw={500} mb={5} ta='center'>
              Didn't find what you were after?
            </Title>
            <Button m='auto' size='md'>
              Make a suggestion
            </Button>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default PlansPage;
