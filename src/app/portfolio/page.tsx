'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { NexusBankingPreview, MediTrackPreview, AuraRetailPreview, VanguardRoutingPreview } from '@/components/shared/PortfolioPreviews'

interface Project {
  title: string
  subtitle: string
  category: 'FinTech' | 'Healthcare' | 'E-Commerce' | 'Logistics'
  year: string
  description: string
  tags: string[]
  stats: { value: string; label: string }[]
  size: 'large' | 'small'
}

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'FinTech' | 'Healthcare' | 'E-Commerce' | 'Logistics'>('All')

  const projects: Project[] = [
    {
      title: 'Nexus Banking Platform',
      subtitle: 'Nexus Banking Platform',
      category: 'FinTech',
      year: '2023 - Q4',
      description: 'High-performance web applications built on modern JavaScript frameworks. Optimized for speed and scalability.',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      stats: [
        { value: '3x', label: 'Speed Increase' },
        { value: '45%', label: 'Conversion Lift' },
        { value: 'Zero', label: 'Downtime' },
      ],
      size: 'large',
    },
    {
      title: 'MediTrack Systems',
      subtitle: 'MediTrack Systems',
      category: 'Healthcare',
      year: '2023 - Q3',
      description: 'A robust supply chain tracking system designed to ensure compliance and real-time visibility for critical medical supplies.',
      tags: ['Vue.js', 'Python', 'AWS'],
      stats: [],
      size: 'small',
    },
    {
      title: 'Aura Retail API',
      subtitle: 'Aura Retail API',
      category: 'E-Commerce',
      year: '2023 - Q4',
      description: 'Scalable microservices architecture supporting high-volume transaction processing during peak retail events.',
      tags: ['Go', 'AWS', 'Redis'],
      stats: [],
      size: 'small',
    },
    {
      title: 'Vanguard Routing Engine',
      subtitle: 'Vanguard Routing Engine',
      category: 'Logistics',
      year: '2024 - Q1',
      description: 'Global route optimization engine for large fleets, utilizing machine learning algorithms for traffic and delivery windows.',
      tags: ['Rust', 'GraphQL', 'Kafka'],
      stats: [
        { value: '12M+', label: 'Daily Routes' },
        { value: '99.99%', label: 'Uptime SLA' },
        { value: '18%', label: 'Cost Reduction' },
      ],
      size: 'large',
    },
  ]

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter)

  return (
    <div className="bg-background text-on-surface antialiased overflow-x-hidden min-h-screen">
      <main className="flex-grow pt-32 pb-section-gap flex flex-col gap-12">
        {/* Hero Section */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display-lg text-5xl md:text-7xl lg:text-7xl font-bold text-on-surface mb-stack-md"
          >
            ELEVATE DIGITAL EXPERIENCES
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto"
          >
            Precision engineering for digital leaders. We build resilient, scalable architectures that drive measurable business impact.
          </motion.p>
        </section>

        {/* Filter Section */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop flex flex-wrap justify-center gap-stack-sm">
          {(['All', 'FinTech', 'Healthcare', 'E-Commerce', 'Logistics'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all border cursor-pointer ${
                activeFilter === filter
                  ? 'bg-primary-container text-white border-primary-container shadow-[0_0_15px_rgba(249,115,22,0.25)]'
                  : 'bg-[#111111] text-on-surface-variant border-[#222222] hover:bg-[#251913] hover:text-on-surface'
              }`}
            >
              {filter}
            </button>
          ))}
        </section>

        {/* Featured Projects Bento Grid */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  layout
                  key={project.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className={`bg-[#111111] border border-[#222222] rounded-lg overflow-hidden group flex flex-col justify-between ${
                    project.size === 'large' ? 'col-span-12 md:col-span-8' : 'col-span-12 md:col-span-4'
                  }`}
                >
                  <div className="relative h-60 w-full overflow-hidden bg-[#0B0B0B] border-b border-outline-variant/10 p-4 flex items-center justify-center">
                    {project.category === 'FinTech' && <NexusBankingPreview />}
                    {project.category === 'Healthcare' && <MediTrackPreview />}
                    {project.category === 'E-Commerce' && <AuraRetailPreview />}
                    {project.category === 'Logistics' && <VanguardRoutingPreview />}
                  </div>

                  <div className="p-stack-lg flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-stack-md">
                        <div>
                          <span className="font-section-label text-section-label uppercase text-primary tracking-widest block mb-2">
                            {project.category}
                          </span>
                          <h3 className="font-headline-lg text-headline-lg text-on-surface text-xl md:text-2xl">{project.title}</h3>
                        </div>
                        <span className="font-mono-sm text-mono-sm text-on-surface-variant bg-[#222222] px-3 py-1 rounded">
                          {project.year}
                        </span>
                      </div>
                      
                      <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">
                        {project.description}
                      </p>

                      <div className="flex gap-2 mb-stack-lg flex-wrap">
                        {project.tags.map(tag => (
                          <span key={tag} className="font-mono-sm text-mono-sm text-on-surface bg-[#222222] px-3 py-1 rounded border border-[#333333]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {project.stats.length > 0 && (
                      <div className="grid grid-cols-3 gap-stack-md pt-stack-md border-t border-[#222222] mt-auto">
                        {project.stats.map(stat => (
                          <div key={stat.label}>
                            <div className="font-headline-xl text-headline-xl text-primary mb-1 text-2xl md:text-3xl">{stat.value}</div>
                            <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[10px]">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg w-full">
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-stack-lg md:p-[64px] flex flex-col md:flex-row items-center justify-between gap-stack-lg">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="font-display-lg text-5xl md:text-7xl lg:text-7xl font-bold text-on-surface mb-stack-md">Ready to Architect Your Future?</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Partner with KaiketsuTech to engineer systems that scale, secure, and succeed.</p>
            </div>
            <div className="flex gap-stack-md flex-wrap justify-center">
              <Link href="/contact" className="bg-primary-container text-white px-8 py-4 rounded font-label-md text-label-md uppercase tracking-wider hover:bg-opacity-95 transition-all">
                Initiate Contact
              </Link>
              <Link href="/services" className="bg-[#111111] border border-[#333333] text-white px-8 py-4 rounded font-label-md text-label-md uppercase tracking-wider hover:border-primary transition-all">
                View Ecosystem
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
