'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { WebDevMockup, ECommerceMockup, PlatformsMockup } from '@/components/shared/ServiceIllustrations'

export default function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const capabilities = [
    {
      title: 'Web Development',
      description: 'High-performance web applications built on modern JavaScript frameworks. Optimized for speed and scalability.',
      icon: <WebDevMockup />,
      href: '/contact?subject=software',
    },
    {
      title: 'E-Commerce',
      description: 'Robust digital storefronts tailored for conversion. Seamless integrations and frictionless checkout experiences.',
      icon: <ECommerceMockup />,
      href: '/contact?subject=software',
    },
    {
      title: 'Backend Systems',
      description: 'Secure, scalable, and resilient server-side architectures. API design and microservices orchestration.',
      icon: <PlatformsMockup />,
      href: '/contact?subject=infrastructure',
    },
  ]

  return (
    <div className="bg-background text-on-surface antialiased overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/background.png" 
            alt="Services background" 
            className="w-full h-full object-cover object-center scale-75 opacity-30"
          />
          {/* Radial mask to blend edges smoothly on all sides */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#1c110b_80%)]"></div>
          {/* Vertical gradient to blend with the page section below */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display-lg text-5xl md:text-7xl lg:text-7xl font-bold text-on-surface mb-stack-lg uppercase tracking-tight"
          >
            ELEVATE DIGITAL<br/>EXPERIENCES
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-stack-lg"
          >
            Precision engineering for modern enterprises. We construct scalable, performant, and deeply resilient software architectures.
          </motion.p>
          <motion.a 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            href="#capabilities"
            className="inline-flex items-center justify-center bg-primary-container text-white px-8 py-4 rounded font-label-md text-label-md font-semibold hover:bg-opacity-95 transition-all shadow-[0_4px_20px_rgba(249,115,22,0.2)]"
          >
            Explore Capabilities
            <ArrowRight size={18} className="ml-2" />
          </motion.a>
        </div>
      </section>

      {/* Service Categories (Grid) */}
      <section id="capabilities" className="py-section-gap">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-16 text-center">
            <h2 className="font-section-label text-section-label text-primary uppercase tracking-widest mb-stack-sm">Core Capabilities</h2>
            <h3 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface">Precision Engineered Solutions</h3>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
          >
            {capabilities.map((cap) => (
              <motion.div
                key={cap.title}
                variants={cardVariants}
                className="bg-[#111111] border border-[#222222] rounded-lg p-stack-lg hover:border-primary transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="mb-stack-lg">
                    {cap.icon}
                  </div>
                  <h4 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm text-xl">{cap.title}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">
                    {cap.description}
                  </p>
                </div>
                <Link 
                  className="font-label-md text-label-md text-primary uppercase flex items-center gap-2 mt-auto hover:text-opacity-80 transition-colors" 
                  href={cap.href}
                >
                  View Details 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
