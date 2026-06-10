'use client'

import { motion } from 'framer-motion'
import ArchitectureIllustration from '@/components/shared/ArchitectureIllustration'

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <div className="bg-background text-on-surface antialiased selection:bg-primary-container selection:text-white flex flex-col min-h-screen">
      <main className="flex-grow pt-32 pb-section-gap flex flex-col gap-section-gap">
        {/* Hero Section */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative w-full">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center"
          >
            <div className="lg:col-span-8 flex flex-col gap-stack-lg z-10">
              <motion.h1 
                variants={itemVariants}
                className="font-display-lg text-5xl md:text-7xl lg:text-7xl font-bold text-on-surface"
              >
                We Build Digital Solutions That <span className="text-primary-container text-glow">Scale</span>
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl"
              >
                At KaiketsuTech, we engineer precision software for modern enterprises. We don't just write code; we architect systems designed for longevity, performance, and impact.
              </motion.p>
            </div>
            
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-4 hidden lg:block"
            >
              <ArchitectureIllustration />
            </motion.div>
          </motion.div>
        </section>

        {/* Company Story */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-panel p-8 md:p-12 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <div className="flex flex-col gap-stack-md">
              <span className="font-section-label text-section-label text-primary-container uppercase tracking-wider block">The Genesis</span>
              <h2 className="font-display-lg text-5xl md:text-7xl lg:text-5xl font-bold text-on-surface">Built by Engineers, For Engineers.</h2>
            </div>
            <div className="flex flex-col gap-stack-lg font-body-md text-body-md text-on-surface-variant">
              <p>
                KaiketsuTech was founded on a simple premise: enterprise software doesn't have to be bloated, slow, or difficult to maintain. We saw a gap between visionary business goals and the technical execution required to achieve them.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-outline-variant/20">
                <div>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2 text-3xl">Mission</h3>
                  <p className="text-sm">To deliver uncompromising technical excellence that translates directly to business value.</p>
                </div>
                <div>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2 text-3xl">Vision</h3>
                  <p className="text-sm">To be the invisible engine powering the next generation of industry-defining platforms.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
