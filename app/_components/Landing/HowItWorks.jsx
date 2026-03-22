"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { UserPlus, MessageCircle, FileBarChart } from 'lucide-react'

const steps = [
  {
    title: 'Customize Your Profile',
    description: 'Upload your resume and paste the job description. Our AI will analyze them to create a unique interview persona.',
    icon: UserPlus,
    step: '01'
  },
  {
    title: 'Adaptive AI Simulation',
    description: 'Engage in a realistic 1-on-1 session. The AI adjusts difficulty and topics based on your real-time performance.',
    icon: MessageCircle,
    step: '02'
  },
  {
    title: 'Deep Insight Analysis',
    description: 'Receive a comprehensive breakdown of your performance with actionable tips to refine your delivery and technical skills.',
    icon: FileBarChart,
    step: '03'
  }
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase text-sm mb-3">Workflow</h2>
          <h3 className="text-4xl font-bold dark:text-white mb-6">How It Works</h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            A three-step process designed to take you from preparation to job offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 -z-10" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-500">
                  <step.icon className="text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" size={32} />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-sm border-4 border-white dark:border-gray-950 shadow-lg">
                  {step.step}
                </div>
              </div>
              <h4 className="text-xl font-bold dark:text-white mb-4 group-hover:text-indigo-600 transition-colors">{step.title}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
