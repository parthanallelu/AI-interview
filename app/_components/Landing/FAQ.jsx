"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: "How does the AI evaluatemy answers?",
    answer: "Our AI uses advanced natural language processing to analyze the technical accuracy, completeness, and clarity of your spoken or written responses. It compares your answer against industry-standard 'ideal' responses and provides constructive feedback for improvement."
  },
  {
    question: "Can I practice for specific companies like Google or Meta?",
    answer: "Yes! Our Pro plan includes company-specific interview tracks that use data from candidates who have recently interviewed at major tech firms to generate the most relevant questions."
  },
  {
    question: "Is there a limit to how many interviews I can record?",
    answer: "Free users get 3 full interview sessions per month. Pro users have unlimited access to all features, including infinite interview generations."
  },
  {
    question: "Do I need a webcam to use the platform?",
    answer: "While not strictly required (you can use text mode), we highly recommend using a webcam to simulate a real interview environment and get feedback on your non-verbal communication."
  }
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 bg-gray-50 dark:bg-gray-950/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-3">Support</h2>
          <h3 className="text-4xl font-bold dark:text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={false}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex justify-between items-center transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <span className="font-bold text-gray-800 dark:text-white">{faq.question}</span>
                <div className="shrink-0 ml-4">
                  {openIndex === index ? <Minus size={20} className="text-blue-600" /> : <Plus size={20} className="text-gray-400" />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-gray-500 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-50 dark:border-gray-800">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
