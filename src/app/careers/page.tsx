import Link from 'next/link'
import TopNavBar from '@/components/shared/TopNavBar'
import Footer from '@/components/shared/Footer'
import { Briefcase, ArrowRight, ShieldCheck, Terminal, Cpu, LayoutTemplate } from 'lucide-react'

export default function CareersPage() {
  const openRoles = [
    {
      id: 'software-engineer',
      title: 'Software Engineer Intern',
      track: 'Engineering',
      description: 'Develop production-grade React components, API route handlers, and data sync workers in TypeScript and Next.js.',
      requirements: ['TypeScript / React', 'Next.js App Router', 'REST & GraphQL APIs', 'Basic SQL / Postgres'],
      icon: <Terminal className="text-primary" size={24} />
    },
    {
      id: 'product-designer',
      title: 'Product Design Intern',
      track: 'Design Systems',
      description: 'Architect typography scales, color palettes, and glassmorphic dashboards. Wire up Framer Motion micro-animations.',
      requirements: ['Figma / UI Design', 'CSS Grid & Flexbox', 'Tailwind CSS v4', 'Framer Motion'],
      icon: <LayoutTemplate className="text-primary" size={24} />
    },
    {
      id: 'solutions-architect',
      title: 'Solutions Architect Intern',
      track: 'Infrastructure',
      description: 'Map database schemas, write system flow triggers, and configure Supabase RLS security policies.',
      requirements: ['PostgreSQL / SQL', 'Database Migrations', 'RLS Security Rules', 'CI/CD & Docker'],
      icon: <Cpu className="text-primary" size={24} />
    }
  ]

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-md antialiased">
      <TopNavBar />

      <main className="flex-grow pt-32 pb-24">
        {/* Careers Hero */}
        <section className="relative py-20 flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-container/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="font-section-label text-section-label text-primary mb-stack-md uppercase tracking-widest font-bold">Join the Squad</div>
          <h1 className="font-display-lg text-4xl md:text-6xl lg:text-7xl font-bold text-on-surface mb-stack-md tracking-tight">
            Build the Future of Enterprise.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            We work at the edge of complexity. If you want to develop deep technical capabilities and build mission-critical solutions, join our cohort.
          </p>
        </section>

        {/* Roles Section */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12">
          <h2 className="font-headline-xl text-2xl md:text-3xl font-bold text-on-surface mb-8 border-b border-[#222222] pb-4">
            Active Intern Openings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {openRoles.map((role) => (
              <div key={role.id} className="bg-[#111111] border border-[#222222] rounded-lg p-6 flex flex-col justify-between hover:border-primary/50 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded bg-[#1a1a1a] border border-[#333333] flex items-center justify-center">
                      {role.icon}
                    </div>
                    <span className="font-mono-sm text-[10px] uppercase tracking-widest text-on-surface-variant/70 bg-[#222] px-2.5 py-1 rounded">
                      {role.track}
                    </span>
                  </div>
                  <h3 className="font-headline-lg text-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <p className="font-body-md text-xs text-on-surface-variant mb-6 leading-relaxed">
                    {role.description}
                  </p>
                  
                  <div className="mb-8">
                    <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-3 font-semibold">Technologies / Skills</p>
                    <ul className="flex flex-wrap gap-2">
                      {role.requirements.map((req, index) => (
                        <li key={index} className="text-[10px] font-mono-sm bg-[#1a1a1a] border border-[#222] text-on-surface px-2.5 py-1 rounded">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link 
                  href={`/apply?role=${role.id}`}
                  className="w-full bg-primary-container text-white py-3 rounded font-label-md text-xs hover:bg-[#d8600d] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Apply For Role
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Panel */}
        <section className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop mt-16 text-center">
          <div className="bg-surface-container-low border border-outline-variant p-10 rounded-lg relative overflow-hidden">
            <h3 className="font-headline-xl text-xl md:text-2xl font-bold mb-2">Our Engineering Philosophy</h3>
            <p className="font-body-md text-xs text-on-surface-variant max-w-lg mx-auto mb-6">
              We do not write boilerplate code. Every squad member exercises extreme architectural ownership, deploying modular code and automated tests daily.
            </p>
            <div className="flex justify-center items-center gap-2 text-on-surface-variant/70">
              <ShieldCheck size={16} />
              <span className="font-mono-sm text-xs">Accelerated mentorship model</span>
            </div>
          </div>
        </section>
      </main>

      
    </div>
  )
}
