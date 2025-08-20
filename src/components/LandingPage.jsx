import React from 'react';
import Header from './Header';
import Hero from './Hero';
import ServicesSection from './ServicesSection';
import FeaturedWorks from './FeaturedWorks';
import Materials from './Materials';

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <ServicesSection />
      <FeaturedWorks />
      <Materials />
    </div>
  );
}

export default LandingPage; 