import React from 'react';
import HeroSection from './HeroSection';
import HowSection from './HowSection';
import SpecSection from './SpecSection';
import PhoneShowcase from './PhoneShowcase';
import BuildSection from './BuildSection';
import DemoSection from './DemoSection';
import Footer from '../../components/Footer';

function HomePage() {
  return (
    <>
      <HeroSection />
      <HowSection />
      <SpecSection />
      <PhoneShowcase />
      <BuildSection />
      <DemoSection />
      <Footer />
    </>
  );
}

export default HomePage;
