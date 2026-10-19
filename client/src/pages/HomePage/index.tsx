import React from 'react';
import { Box } from '@mantine/core';

import HeaderSection from './HeaderSection';
import PhoneSection from './PhoneSection';
import LaptopSection from './LaptopSection';
import ComponentSection from './ComponentSection';
import ViewSection from './ViewSection';
import PriceSection from './PriceSection';
import FeatureSection from './FeatureSection';
import RegisterSection from './RegisterSection';
import Footer from '../../components/Footer';
import classes from '../../theme/styles/marketing.module.css';

function HomePage() {
  return (
    <Box className={classes.page}>
      <HeaderSection />
      <LaptopSection />
      <PhoneSection />
      <ComponentSection />
      <FeatureSection />
      <ViewSection />
      <PriceSection />
      <RegisterSection />
      <Footer />
    </Box>
  );
}

export default HomePage;
