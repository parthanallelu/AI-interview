"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 pt-20 pb-10 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <Sparkles className="text-white" size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter dark:text-white">
                    AI<span className="text-indigo-600">PREP</span>
                </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Empowering candidates to master the art of technical interviews with cutting-edge AI technology.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all">
                <Github size={18} />
              </Link>
              <Link href="#" className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h5 className="font-bold dark:text-white mb-6">Product</h5>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">AI Engine</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Security</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold dark:text-white mb-6">Resources</h5>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Interview Tips</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold dark:text-white mb-6">Company</h5>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Join Team</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            © {currentYear} AI PREP. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Made with ❤️ for developers by Parthanallelu.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
