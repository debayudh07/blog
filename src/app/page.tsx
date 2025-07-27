'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/functions/Navbar'

export default function HomePage() {

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex items-center min-h-[80vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
              >
                Welcome to
                <span className="block bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                  My Blog Space
                </span>
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-300"
              >
                by <span className="text-primary font-bold">Debayudh Basu</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl leading-relaxed"
              >
                Dive into a world of thoughts, ideas, and stories. 
                Exploring technology, creativity, and everything in between.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/viewpost" 
                    className="inline-flex items-center bg-gradient-to-r from-primary to-emerald-400 text-black px-8 py-4 rounded-xl font-medium text-lg hover:from-emerald-400 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-primary/30"
                  >
                    Explore Posts
                    <motion.span
                      className="ml-2"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/createblog" 
                    className="inline-flex items-center bg-transparent border-2 border-primary text-primary px-8 py-4 rounded-xl font-medium text-lg hover:bg-primary hover:text-black transition-all duration-300"
                  >
                    Start Writing
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            <p className="text-gray-400 mb-4 md:mb-0">&copy; 2023 My Blog. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors duration-300 hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors duration-300 hover:underline">
                Terms of Service
              </Link>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}