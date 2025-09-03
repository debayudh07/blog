'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import NavbarNew from '@/components/functions/NavbarNew'
import DarkVeil from '@/components/ui/darkveil'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

export default function HomePage() {
  const words = "Welcome to My Blog Space";

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden">
      {/* DarkVeil Background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil 
          hueShift={42}
          speed={2.5}
          noiseIntensity={0.02}
          scanlineIntensity={0.1}
          scanlineFrequency={1}
          warpAmount={1.7}
          resolutionScale={1}
        />
      </div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Navbar */}
        <NavbarNew />

        {/* Hero Section */}
        <main className="flex-grow flex items-center min-h-[80vh] pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-2xl"
                >
                  <TextGenerateEffect
                    words={words}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-2xl"
                    filter={true}
                    duration={0.8}
                  />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-medium text-white drop-shadow-lg"
                >
                  by <span className="text-primary font-bold">Debayudh Basu</span>
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed drop-shadow-lg"
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
                    <Link href="/viewpost">
                      <HoverBorderGradient
                        containerClassName="rounded-xl"
                        className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20 backdrop-blur-lg border border-blue-300/30 text-white px-8 py-4 rounded-xl font-medium text-lg inline-flex items-center shadow-lg shadow-blue-500/20 hover:shadow-blue-400/30 transition-all duration-300"
                        duration={1.5}
                        clockwise={true}
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
                      </HoverBorderGradient>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="/createblog" 
                      className="inline-flex items-center bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                    >
                      Start Writing
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </main>


      </div>
    </div>
  )
}