"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Frontend Engineer @ Google',
    comment: 'The AI feedback was spookily accurate. It caught my tendency to over-explain code before I even realized it myself. Highly recommended!',
    image: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    name: 'Michael Chen',
    role: 'Full Stack Dev @ Meta',
    comment: 'I practiced for a week before my Meta loop. The system-design questions were spot on. Felt much more confident going in.',
    image: 'https://i.pravatar.cc/150?u=michael'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Junior Developer',
    comment: 'As a bootcamp grad, I was terrified of technical rounds. This platform gave me the safe space to fail and learn until I got it right.',
    image: 'https://i.pravatar.cc/150?u=elena'
  }
]

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase text-sm mb-3">Wall of Love</h2>
          <h3 className="text-4xl font-bold dark:text-white mb-6">Success Stories</h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Join thousands of developers who upgraded their interview game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-[40px] bg-gray-50 dark:bg-gray-900 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900 hover:bg-white dark:hover:bg-gray-800 transition-all group"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="relative mb-8 text-gray-600 dark:text-gray-300 italic">
                 <Quote className="absolute -top-4 -left-4 w-10 h-10 text-indigo-600/10 -z-10" />
                 "{t.comment}"
              </div>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" />
                <div>
                  <h5 className="font-bold dark:text-white text-sm">{t.name}</h5>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
