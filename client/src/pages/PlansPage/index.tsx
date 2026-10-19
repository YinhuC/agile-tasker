import React from 'react';
import { Box } from '@mantine/core';
import Footer from '../../components/Footer';
import CtaBand from '../../components/CtaBand';
import PriceSection from './PriceSection';
import AccordionSection from './AccordionSection';
import marketing from '../../theme/styles/marketing.module.css';

function PlansPage() {
  return (
    <Box className={marketing.page}>
      <PriceSection />
      <AccordionSection />
      <CtaBand
        title="Didn't find what you were after?"
        buttonText='Make a suggestion'
        to='https://github.com/YinhuC/agile-tasker/issues'
      />
      <Footer />
    </Box>
  );
}

export default PlansPage;
