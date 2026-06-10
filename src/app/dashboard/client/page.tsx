import { createClient } from '@/lib/supabase/server'
import TopAppBar from '@/components/shared/TopAppBar'
import { Rocket, Activity, CreditCard, Layers, Calendar, MessageSquare, Terminal } from 'lucide-react'
import Link from 'next/link'

export default async function ClientDashboard() {
  const supabase = await createClient()

  // Retrieve current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user?.id || '')

  // Fetch payments
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('client_id', user?.id || '')
    .eq('status', 'pending')

  const totalPending = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-grid-pattern">
      <TopAppBar title="Dashboard" placeholder="Search..." />

      {/* Canvas */}
      <div className="flex-grow overflow-y-auto p-gutter pt-8 max-w-max-width w-full mx-auto flex flex-col gap-gutter">
        
        {/* Top Row Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          
          {/* Current Velocity */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="text-primary" size={80} />
            </div>
            <div>
              <p className="font-section-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-bold">Current Velocity</p>
              <h3 className="font-display-lg text-4xl font-bold text-on-surface mt-2">
                94<span className="text-2xl text-primary">%</span>
              </h3>
            </div>
            <div className="mt-8 flex items-center gap-2 text-secondary font-mono-sm text-xs">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              +12% vs last month
            </div>
          </div>

          {/* Pending Invoices */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <CreditCard className="text-primary" size={80} />
            </div>
            <div>
              <p className="font-section-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-bold">Pending Invoices</p>
              <h3 className="font-display-lg text-4xl font-bold text-on-surface mt-2">
                ${totalPending > 0 ? totalPending.toLocaleString() : '24.5k'}
              </h3>
            </div>
            <div className="mt-8 flex items-center gap-2 text-on-surface-variant font-mono-sm text-xs">
              {payments && payments.length > 0 ? `${payments.length} Invoice(s) Awaiting` : 'No Invoices Awaiting'}
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-surface-container-high border border-outline-variant rounded-lg p-6 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-3 text-primary">
              <Rocket size={24} />
            </div>
            <h4 className="font-headline-lg text-base font-semibold text-on-surface mb-1">Deploy Phase 2</h4>
            <p className="font-body-md text-xs text-on-surface-variant mb-4 max-w-[200px]">Staging environment is ready for final review.</p>
            <button className="bg-primary-container text-white px-5 py-2 rounded-full font-label-md text-xs hover:bg-opacity-95 transition-all cursor-pointer">
              Review Build
            </button>
          </div>
        </div>

        {/* Deployments and Timelines Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Active Deployments */}
          <div className="lg:col-span-2 bg-[#111111] border border-[#222222] rounded-lg flex flex-col">
            <div className="p-4 border-b border-[#222222] flex justify-between items-center">
              <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest">Active Deployments</h3>
            </div>
            <div className="divide-y divide-[#222222]">
              {projects && projects.map((project) => (
                <div key={project.id} className="p-4 hover:bg-surface-container-low/30 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#222] flex items-center justify-center text-on-surface border border-[#333]">
                      <Layers size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-body-md font-semibold text-sm text-on-surface">{project.title}</h4>
                      <p className="font-mono-sm text-xs text-on-surface-variant">{project.status} • Next.js</p>
                    </div>
                  </div>
                  <div className="w-1/3 flex items-center gap-3">
                    <div className="flex-1 h-1 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container rounded-full" style={{ width: `${project.velocity || 70}%` }}></div>
                    </div>
                    <span className="font-mono-sm text-xs text-on-surface-variant">{project.velocity || 70}%</span>
                  </div>
                </div>
              ))}

              {/* Mock deployments if DB is empty */}
              {(!projects || projects.length === 0) && (
                <>
                  <div className="p-4 hover:bg-surface-container-low/30 transition-all flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#222] flex items-center justify-center text-on-surface border border-[#333]">
                        <Terminal size={18} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-body-md font-semibold text-sm text-on-surface">FinTech Core Revamp</h4>
                        <p className="font-mono-sm text-xs text-on-surface-variant">v2.4.0 • Next.js / Node</p>
                      </div>
                    </div>
                    <div className="w-1/3 flex items-center gap-3">
                      <div className="flex-1 h-1 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-primary-container w-[75%] rounded-full"></div>
                      </div>
                      <span className="font-mono-sm text-xs text-on-surface-variant">75%</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-surface-container-low/30 transition-all flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#222] flex items-center justify-center text-on-surface border border-[#333]">
                        <Terminal size={18} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-body-md font-semibold text-sm text-on-surface">Data Pipeline Migration</h4>
                        <p className="font-mono-sm text-xs text-on-surface-variant">AWS • Snowflake</p>
                      </div>
                    </div>
                    <div className="w-1/3 flex items-center gap-3">
                      <div className="flex-1 h-1 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[40%] rounded-full"></div>
                      </div>
                      <span className="font-mono-sm text-xs text-on-surface-variant">40%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg flex flex-col">
            <div className="p-4 border-b border-[#222222]">
              <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest">Upcoming Milestones</h3>
            </div>
            <div className="p-6 relative flex-1 flex flex-col gap-6">
              <div className="absolute left-7 top-8 bottom-8 w-px bg-outline-variant/30"></div>
              
              <div className="flex gap-4 relative z-10">
                <div className="w-3.5 h-3.5 rounded-full bg-primary-container border-4 border-[#111111] ring-1 ring-primary-container mt-1"></div>
                <div>
                  <h4 className="font-body-md font-medium text-sm text-on-surface">Security Audit Sign-off</h4>
                  <p className="font-mono-sm text-xs text-on-surface-variant mt-0.5">Oct 24 • Q4 Compliance</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-3.5 h-3.5 rounded-full bg-surface-container-highest border-4 border-[#111111] mt-1"></div>
                <div>
                  <h4 className="font-body-md font-medium text-sm text-on-surface-variant">Design System V2 Handover</h4>
                  <p className="font-mono-sm text-xs text-on-surface-variant mt-0.5">Oct 28 • Core Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Communications */}
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-24">
          <div className="flex justify-between items-center mb-6 border-b border-[#222222] pb-4">
            <h4 className="font-body-md font-semibold text-on-surface text-sm">Recent Communications</h4>
            <Link href="#" className="font-mono-sm text-primary text-xs hover:underline flex items-center gap-1">
              View Feed <MessageSquare size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded border border-[#222222] bg-[#1a1a1a] hover:border-primary-container transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">SC</div>
                <div>
                  <h5 className="font-label-md text-xs font-semibold text-on-surface">Sarah Chen</h5>
                  <p className="font-mono-sm text-[10px] text-on-surface-variant">2 hours ago</p>
                </div>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">
                The latest API endpoints are documented. Please review before the integration phase starts tomorrow.
              </p>
            </div>

            <div className="p-4 rounded border border-[#222222] bg-[#1a1a1a] hover:border-primary-container transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">CI</div>
                <div>
                  <h5 className="font-label-md text-xs font-semibold text-on-surface">CI/CD Bot</h5>
                  <p className="font-mono-sm text-[10px] text-on-surface-variant">4 hours ago</p>
                </div>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">
                Build #492 passed successfully. Deployed to staging environment in 4m 12s.
              </p>
            </div>

            <div className="p-4 rounded border border-[#222222] bg-[#1a1a1a] hover:border-primary-container transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">MR</div>
                <div>
                  <h5 className="font-label-md text-xs font-semibold text-on-surface">Marcus Reid</h5>
                  <p className="font-mono-sm text-[10px] text-on-surface-variant">Yesterday</p>
                </div>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">
                Invoice INV-2024-089 has been attached for the Q3 retainer. Let me know if you need any adjustments.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
