"use client"

import React from 'react'
import Header from './dashboard/_components/Header'
import Hero from './_components/Landing/Hero'
import Features from './_components/Landing/Features'
import HowItWorks from './_components/Landing/HowItWorks'
import Testimonials from './_components/Landing/Testimonials'
import Pricing from './_components/Landing/Pricing'
import FAQ from './_components/Landing/FAQ'
import Footer from './_components/Landing/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  )
}
