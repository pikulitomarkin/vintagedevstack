import React from 'react'
import HeroSection from './components/HeroSection'
import PortfolioSection from './components/PortfolioSection'
import ServicesSection from './components/ServicesSection'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'

function App() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PortfolioSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </div>
  )
}

export default App

