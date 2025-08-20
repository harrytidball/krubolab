import React from 'react';
import Header from './Header';
import Hero from './Hero';
import ServicesSection from './ServicesSection';
import FeaturedWorks from './FeaturedWorks';
import Materials from './Materials';
import WhyChooseUs from './WhyChooseUs';
import QuoteSection from './QuoteSection';

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <ServicesSection />
      <FeaturedWorks />
      <Materials />
      <WhyChooseUs />
      <QuoteSection />
    </div>
  );
}

export default LandingPage; 