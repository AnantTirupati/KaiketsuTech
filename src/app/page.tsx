'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import DashboardShowcase from '@/components/shared/DashboardShowcase'
import { WebDevMockup, ECommerceMockup, PlatformsMockup } from '@/components/shared/ServiceIllustrations'

export default function Home() {
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
    <div className="bg-background text-on-surface font-body-md antialiased overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop w-full grid grid-cols-1 lg:grid-cols-2 gap-stack-lg lg:gap-gutter items-center z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col gap-stack-md max-w-2xl"
          >
            <motion.p 
              variants={itemVariants}
              className="font-section-label text-section-label text-primary uppercase tracking-widest flex items-center gap-2"
            >
              <span className="w-8 h-px bg-primary"></span>
              Elevate Digital Experiences
            </motion.p>
            <motion.h1 
              variants={itemVariants}
              className="font-display-lg text-5xl md:text-7xl lg:text-5xl font-bold text-on-surface"
            >
              Building Digital Experiences That Drive Business Growth
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="font-body-lg text-body-lg text-on-surface-variant max-w-xl"
            >
              We engineer premium software solutions tailored for high-end enterprises. Precision, scalability, and relentless innovation are the core of our technical DNA.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <Link 
                className="inline-flex items-center justify-center bg-primary-container text-white px-8 py-4 rounded font-label-md text-label-md font-semibold hover:bg-opacity-95 transition-all shadow-[0_4px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_4px_30px_rgba(249,115,22,0.4)]" 
                href="/start-project"
              >
                Start a Project
              </Link>
              <Link 
                className="inline-flex items-center justify-center bg-transparent border border-outline-variant text-on-surface px-8 py-4 rounded font-label-md text-label-md font-medium hover:border-primary hover:text-primary transition-all" 
                href="/portfolio"
              >
                View Portfolio
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative w-full flex items-center justify-center lg:justify-end"
          >
            <DashboardShowcase />
          </motion.div>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-section-gap bg-surface-container-lowest relative" id="services">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-section-label text-section-label text-primary uppercase tracking-widest mb-4">Our Expertise</h2>
            <h3 className="font-display-lg text-5xl md:text-7xl lg:text-6xl font-bold text-on-surface">Precision Engineering for Modern Demands</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group bg-surface p-8 rounded-lg border border-outline-variant hover:border-primary transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(249,115,22,0.1)] flex flex-col h-full"
            >
              <WebDevMockup />
              <h4 className="font-headline-lg text-headline-lg text-on-surface mb-3 text-3xl">Website Development</h4>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                Immersive, high-performance web platforms built with cutting-edge frameworks ensuring seamless user experiences.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group bg-surface p-8 rounded-lg border border-outline-variant hover:border-primary transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(249,115,22,0.1)] flex flex-col h-full"
            >
              <ECommerceMockup />
              <h4 className="font-headline-lg text-headline-lg text-on-surface mb-3 text-3xl">E-Commerce</h4>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                Scalable, secure, and conversion-optimized digital storefronts tailored for complex enterprise inventories.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group bg-surface p-8 rounded-lg border border-outline-variant hover:border-primary transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(249,115,22,0.1)] flex flex-col h-full"
            >
              <PlatformsMockup />
              <h4 className="font-headline-lg text-headline-lg text-on-surface mb-3 text-3xl">Business Platforms</h4>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                Custom internal tools and dashboards designed to streamline operations and enhance data visibility.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
