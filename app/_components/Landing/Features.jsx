"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Target, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Globe 
} from 'lucide-react'

const features = [
  {
    title: 'Instant AI Feedback',
    description: 'Get real-time critique on your technical accuracy, communication style, and confidence.',
    icon: Zap,
    color: 'bg-yellow-500'
  },
  {
    title: 'Tailored Questions',
    description: 'AI generates questions specific to your target job role, tech stack, and years of experience.',
    icon: Target,
    color: 'bg-blue-500'
  },
  {
    title: 'Realistic Simulation',
    description: 'Practice in an environment that mimics real technical interviews with video and audio support.',
    icon: MessageSquare,
    color: 'bg-indigo-500'
  },
  {
    title: 'Performance Analytics',
    description: 'Track your progress over time with detailed charts and historical interview data.',
    icon: BarChart3,
    color: 'bg-green-500'
  },
  {
    title: 'Industry Standards',
    description: 'Questions verified against top tech company standards (Google, Meta, Amazon).',
    icon: Shield,
    color: 'bg-purple-500'
  },
  {
    title: 'Practice Anywhere',
    description: 'Cloud-based platform accessible from any device, anytime, anywhere in the world.',
    icon: Globe,
    color: 'bg-red-500'
  }
]

function Features() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-3">Features</h2>
          <h3 className="text-4xl font-bold dark:text-white mb-6">Built for Serious Candidates</h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Stop guessing and start preparing with precision. Our AI-driven platform 
            provides everything you need to crush your next interview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all"
            >
              <div className={`w-12 h-12 ${feature.color} bg-opacity-10 rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className={`text-opacity-90`} size={24} style={{ color: feature.color.replace('bg-', '') }} />
              </div>
              <h4 className="text-xl font-bold dark:text-white mb-3">{feature.title}</h4>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
