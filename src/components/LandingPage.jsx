import React from 'react';
import Header from './Header';
import Hero from './Hero';
import ServicesSection from './ServicesSection';

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <ServicesSection />
    </div>
  );
}

export default LandingPage; 