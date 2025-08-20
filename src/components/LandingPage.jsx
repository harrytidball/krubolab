import React from 'react';
import Header from './Header';
import Hero from './Hero';
import ServicesSection from './ServicesSection';
import FeaturedWorks from './FeaturedWorks';

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <ServicesSection />
      <FeaturedWorks />
    </div>
  );
}

export default LandingPage; 