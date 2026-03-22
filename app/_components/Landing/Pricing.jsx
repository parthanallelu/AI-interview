"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started with AI prep.',
    features: [
      '3 Interviews per month',
      'Basic AI Feedback',
      'Standard Questions',
      '7 Days History'
    ],
    buttonText: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    description: 'Best for candidates actively interviewing.',
    features: [
      'Unlimited Interviews',
      'Advanced AI Feedback',
      'Company-specific tracks',
      'Full History Access',
      'Video Analytics',
      'Priority Support'
    ],
    buttonText: 'Go Pro',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For coding bootcamps and universities.',
    features: [
      'Team Management',
      'Custom AI Training',
      'White-labeled Portal',
      'Detailed API Access',
      'Dedicated Manager'
    ],
    buttonText: 'Contact Sales',
    popular: false
  }
]

function Pricing() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase text-sm mb-3">Pricing</h2>
          <h3 className="text-4xl font-bold dark:text-white mb-6">Invest in Your Career</h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choose the plan that fits your preparation stage. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-10 rounded-3xl border ${
                plan.popular 
                  ? 'border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-100 dark:shadow-none bg-indigo-50/10 dark:bg-indigo-900/10 relative overflow-hidden' 
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                  Popular
                </div>
              )}
              <h4 className="text-xl font-bold dark:text-white mb-2">{plan.name}</h4>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold dark:text-white">{plan.price}</span>
                {plan.period && <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                {plan.description}
              </p>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <Check className="text-green-600 dark:text-green-400" size={12} />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.popular ? 'default' : 'outline'} 
                className={`w-full h-12 rounded-xl font-bold transition-all ${
                  plan.popular 
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/25' 
                    : ''
                }`}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
