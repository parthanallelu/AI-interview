"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/AuthContext'
import { ModeToggle } from '@/components/mode-toggle'
import { Sparkles, Menu, X } from 'lucide-react'

function Header() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-gray-800' 
        : 'py-6 bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter dark:text-white">
              AI<span className="text-indigo-600">PREP</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">How it works</a>
            <a href="/#testimonials" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">Testimonials</a>
            <a href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="font-semibold">Dashboard</Button>
                </Link>
                <Button 
                  onClick={logout}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 font-semibold shadow-md active:scale-95 transition-all"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 font-semibold shadow-md active:scale-95 transition-all">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800"
        >
          <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
            <a href="/#features" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="/#how-it-works" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>How it works</a>
            <a href="/#testimonials" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
            <a href="/#pricing" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
               <ModeToggle />
               {user ? (
                  <Button onClick={logout} className="w-full bg-indigo-600 font-bold">Logout</Button>
               ) : (
                  <Link href="/login" className="w-full">
                    <Button className="w-full bg-indigo-600 font-bold">Sign In</Button>
                  </Link>
               )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}

export default Header
