import React from 'react';
import Header from './Header';
import Hero from './Hero';
import ServicesSection from './ServicesSection';
import FeaturedWorks from './FeaturedWorks';
import Materials from './Materials';
import WorkshopProducts from './WorkshopProducts';
import WhyChooseUs from './WhyChooseUs';
import QuoteSection from './QuoteSection';
import Footer from './Footer';

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <ServicesSection />
      <FeaturedWorks />
      <Materials />
      <WorkshopProducts />
      <WhyChooseUs />
      <QuoteSection />
      <Footer />
    </div>
  );
}

export default LandingPage; 