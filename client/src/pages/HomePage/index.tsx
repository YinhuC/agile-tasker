import React from 'react';
import { MotionConfig } from 'motion/react';
import HeroSection from './HeroSection';
import HowSection from './HowSection';
import SpecSection from './SpecSection';
import PhoneShowcase from './PhoneShowcase';
import PricingSection from './PricingSection';
import DemoSection from './DemoSection';
import Footer from '../../components/Footer';

function HomePage() {
  return (
    <MotionConfig reducedMotion='user'>
      <HeroSection />
      <HowSection />
      <SpecSection />
      <PhoneShowcase />
      <PricingSection />
      <DemoSection />
      <Footer />
    </MotionConfig>
  );
}

export default HomePage;
