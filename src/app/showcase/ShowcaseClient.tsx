'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Layers, User, ArrowRight } from 'lucide-react'

interface ShowcaseProject {
  id: string
  title: string
  description: string | null
  status: string | null
  showcase_image_url: string | null
  showcase_tags: string[] | null
  created_at: string | null
  project_contributors: Array<{
    role: string
    interns: {
      intern_id: string
      profiles: {
        full_name: string | null
        avatar_url: string | null
      } | null
    } | null
  }>
}

export default function ShowcaseClient({ projects }: { projects: ShowcaseProject[] }) {
  // Collect all unique tags
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.showcase_tags || []))
  )
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag
    ? projects.filter((p) => p.showcase_tags?.includes(activeTag))
    : projects

  return (
    <div className="bg-background text-on-surface antialiased overflow-x-hidden min-h-screen">
      <main className="flex-grow pt-32 pb-section-gap flex flex-col gap-12">
        {/* Hero */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display-lg text-5xl md:text-7xl font-bold text-on-surface mb-stack-md"
          >
            PROJECT SHOWCASE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto"
          >
            Real projects. Real impact. See what our team has built — complete with contributor credits.
          </motion.p>
        </section>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop flex flex-wrap justify-center gap-stack-sm">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-6 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all border cursor-pointer ${
                !activeTag
                  ? 'bg-primary-container text-white border-primary-container shadow-[0_0_15px_rgba(249,115,22,0.25)]'
                  : 'bg-[#111111] text-on-surface-variant border-[#222222] hover:bg-[#251913] hover:text-on-surface'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-6 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all border cursor-pointer ${
                  activeTag === tag
                    ? 'bg-primary-container text-white border-primary-container shadow-[0_0_15px_rgba(249,115,22,0.25)]'
                    : 'bg-[#111111] text-on-surface-variant border-[#222222] hover:bg-[#251913] hover:text-on-surface'
                }`}
              >
                {tag}
              </button>
            ))}
          </section>
        )}

        {/* Projects Grid */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              <AnimatePresence mode="popLayout">
                {filtered.map((project) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#111111] border border-[#222222] rounded-lg overflow-hidden group flex flex-col"
                  >
                    {/* Image */}
                    {project.showcase_image_url && (
                      <div className="h-48 overflow-hidden bg-[#0B0B0B]">
                        <img
                          src={project.showcase_image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    {!project.showcase_image_url && (
                      <div className="h-48 bg-[#0B0B0B] flex items-center justify-center border-b border-[#222222]">
                        <Layers size={48} className="text-outline-variant/30" />
                      </div>
                    )}

                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="font-headline-lg text-xl font-semibold text-on-surface mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-on-surface-variant text-sm mb-4 line-clamp-3 flex-grow">{project.description}</p>
                      )}

                      {/* Tags */}
                      {project.showcase_tags && project.showcase_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.showcase_tags.map((tag) => (
                            <span key={tag} className="bg-[#222222] text-on-surface px-2 py-0.5 rounded text-[10px] font-mono-sm border border-[#333333]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Contributors */}
                      {project.project_contributors.length > 0 && (
                        <div className="border-t border-[#222222] pt-4 mt-auto">
                          <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">Contributors</p>
                          <div className="flex flex-wrap gap-2">
                            {project.project_contributors.map((contrib, idx) => {
                              const intern = contrib.interns
                              if (!intern) return null
                              return (
                                <Link
                                  key={idx}
                                  href={`/intern/${intern.intern_id}`}
                                  className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#282828] rounded-full pl-1 pr-3 py-1 text-xs hover:border-primary-container/30 transition-colors"
                                >
                                  <div className="w-5 h-5 rounded-full bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
                                    {intern.profiles?.avatar_url ? (
                                      <img src={intern.profiles.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                      <User size={10} />
                                    )}
                                  </div>
                                  <span className="text-on-surface truncate max-w-[100px]">{intern.profiles?.full_name || intern.intern_id}</span>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20">
              <Layers size={48} className="text-outline-variant/30 mx-auto mb-4" />
              <p className="text-on-surface-variant text-lg">No showcase projects yet.</p>
              <p className="text-on-surface-variant/70 text-sm mt-2">Projects will appear here once they are marked for showcase.</p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop w-full">
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-headline-lg text-2xl font-bold text-on-surface mb-2">Want to work with us?</h2>
              <p className="text-on-surface-variant">Start a project or join our intern cohort.</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/request-project"
                className="bg-primary-container text-white px-6 py-3 rounded font-label-md text-label-md uppercase tracking-wider hover:bg-[#d8600d] transition-colors flex items-center gap-2"
              >
                Start a Project <ArrowRight size={16} />
              </Link>
              <Link
                href="/careers"
                className="bg-[#111111] border border-[#333333] text-white px-6 py-3 rounded font-label-md text-label-md uppercase tracking-wider hover:border-primary transition-colors"
              >
                Apply as Intern
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
