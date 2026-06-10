import { createClient } from '@/lib/supabase/server'
import TopAppBar from '@/components/shared/TopAppBar'
import { DollarSign, Briefcase, Percent, TrendingUp, PlusCircle, Award, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch real count stats from Supabase
  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  const { data: completedPayments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'completed')

  const totalRevenue = completedPayments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

  // Fetch intern list
  const { data: interns } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'intern')
    .limit(3)

  // Fetch project requests
  const { data: projectRequests } = await supabase
    .from('project_requests')
    .select('*')
    .limit(3)

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-grid-pattern">
      <TopAppBar title="Analytics" placeholder="Search metrics..." />

      {/* Canvas Scrollable */}
      <div className="flex-grow overflow-y-auto p-gutter pt-8 max-w-max-width w-full mx-auto flex flex-col gap-gutter">
        
        {/* Bento Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          
          {/* Revenue Card */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign className="text-primary" size={80} />
            </div>
            <p className="font-section-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-bold">Total Revenue (YTD)</p>
            <div className="flex items-baseline gap-2 mt-auto">
              <h3 className="font-display-lg text-4xl font-bold text-on-surface">
                ${totalRevenue > 0 ? (totalRevenue / 1000).toFixed(1) + 'k' : '2.4M'}
              </h3>
              <span className="text-sm text-[#4ade80] flex items-center font-mono-sm">
                <TrendingUp size={16} className="mr-1" />
                +18.4%
              </span>
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 flex flex-col relative overflow-hidden">
            <p className="font-section-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-bold">Active Projects</p>
            <div className="flex items-baseline gap-2 mt-auto">
              <h3 className="font-display-lg text-4xl font-bold text-on-surface">
                {projectsCount && projectsCount > 0 ? projectsCount : '42'}
              </h3>
              <span className="text-sm text-on-surface-variant font-mono-sm">active instances</span>
            </div>
            {/* Micro Progress Bar */}
            <div className="w-full bg-surface-container-highest h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-2 font-mono-sm">75% Capacity Utilization</p>
          </div>

          {/* Success Rate */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 flex flex-col items-center justify-center relative">
            <p className="font-section-label text-[10px] text-on-surface-variant uppercase tracking-widest absolute top-6 left-6 font-bold">Success Rate</p>
            <div className="relative w-20 h-20 mt-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="40" stroke="#222222" strokeWidth="8"></circle>
                <circle cx="50" cy="50" fill="none" r="40" stroke="#f97316" strokeDasharray="251.2" strokeDashoffset="15.07" strokeWidth="8" className="transition-all duration-1000 ease-out"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-headline-lg text-lg font-bold text-on-surface">94%</span>
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-2 font-mono-sm">On-time Delivery</p>
          </div>
        </div>

        {/* Charts and Lists Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Revenue growth mockup */}
          <div className="lg:col-span-2 bg-[#111111] border border-[#222222] rounded-lg p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-body-md font-semibold text-on-surface text-sm">Revenue Growth & Projections</h4>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-highest text-[10px] rounded text-on-surface-variant cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">Q1</span>
                <span className="px-2 py-1 bg-surface-container-highest text-[10px] rounded text-on-surface-variant cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">Q2</span>
                <span className="px-2 py-1 bg-primary/20 text-[10px] rounded text-primary border border-primary/30">Q3</span>
              </div>
            </div>
            
            {/* Visual graph simulation */}
            <div className="h-48 flex items-end justify-between border-b border-l border-[#222222] px-4 pb-2 relative">
              <div className="absolute left-1 top-2 text-[8px] text-on-surface-variant font-mono-sm">$1M</div>
              <div className="absolute left-1 top-24 text-[8px] text-on-surface-variant font-mono-sm">$500k</div>
              <div className="w-[10%] bg-surface-container-highest h-[30%] rounded-t-sm"></div>
              <div className="w-[10%] bg-surface-container-highest h-[45%] rounded-t-sm"></div>
              <div className="w-[10%] bg-surface-container-highest h-[40%] rounded-t-sm"></div>
              <div className="w-[10%] bg-primary-container h-[60%] rounded-t-sm shadow-[0_0_15px_rgba(249,115,22,0.3)]"></div>
              <div className="w-[10%] bg-surface-container-highest h-[75%] rounded-t-sm"></div>
              <div className="w-[10%] bg-surface-container-highest h-[85%] rounded-t-sm"></div>
            </div>
          </div>

          {/* Client acquisition mockup */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 flex flex-col justify-between">
            <h4 className="font-body-md font-semibold text-on-surface text-sm mb-4">Client Acquisition</h4>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono-sm text-on-surface-variant">
                  <span>Enterprise</span>
                  <span>+12</span>
                </div>
                <div className="w-full bg-[#222222] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono-sm text-on-surface-variant">
                  <span>Startups</span>
                  <span>+8</span>
                </div>
                <div className="w-full bg-[#222222] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono-sm text-on-surface-variant">
                  <span>Gov/Public</span>
                  <span>+3</span>
                </div>
                <div className="w-full bg-[#222222] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intern Cohort Performance Grid */}
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-24">
          <div className="flex justify-between items-center mb-6 border-b border-[#222222] pb-4">
            <h4 className="font-body-md font-semibold text-on-surface text-sm">Intern Cohort Performance</h4>
            <Link href="#" className="text-xs text-primary hover:text-primary-container transition-colors flex items-center gap-1 font-mono-sm">
              View Full Roster <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {interns && interns.map((intern, i) => (
              <div key={intern.id} className="p-4 rounded border border-[#222222] bg-[#1a1a1a] hover:border-primary/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold font-mono-sm">
                    {intern.full_name?.charAt(0) || 'I'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{intern.full_name || 'Intern Name'}</p>
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-mono-sm">Engineering</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono-sm text-on-surface-variant">
                  <CheckCircle2 size={14} className="text-[#4ade80]" />
                  90% Task Success
                </div>
                <div className="mt-3 w-full bg-[#222] h-1 rounded-full">
                  <div className="bg-[#4ade80] h-full rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            ))}

            {/* Fallback mock interns if database is empty */}
            {(!interns || interns.length === 0) && (
              <>
                <div className="p-4 rounded border border-[#222222] bg-[#1a1a1a] hover:border-primary/50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold font-mono-sm">JS</div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Jane Smith</p>
                      <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-mono-sm">Frontend Eng.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono-sm text-on-surface-variant">
                    <CheckCircle2 size={14} className="text-[#4ade80]" />
                    14 Tasks Completed
                  </div>
                  <div className="mt-3 w-full bg-[#222] h-1 rounded-full">
                    <div className="bg-[#4ade80] h-full rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded border border-[#222222] bg-[#1a1a1a] hover:border-primary/50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary font-bold font-mono-sm">DK</div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">David Kim</p>
                      <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-mono-sm">UX Design</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono-sm text-on-surface-variant">
                    <Award size={14} className="text-primary" />
                    3 Active Projects
                  </div>
                  <div className="mt-3 w-full bg-[#222] h-1 rounded-full">
                    <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded border border-[#222222] bg-[#1a1a1a] hover:border-primary/50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-tertiary font-bold font-mono-sm">AL</div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Ana Lopez</p>
                      <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-mono-sm">Data Science</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono-sm text-on-surface-variant">
                    <CheckCircle2 size={14} className="text-[#4ade80]" />
                    12 Tasks Completed
                  </div>
                  <div className="mt-3 w-full bg-[#222] h-1 rounded-full">
                    <div className="bg-[#4ade80] h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </>
            )}

            {/* Assign new / Empty state */}
            <div className="p-4 rounded border border-dashed border-[#333333] flex flex-col items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors cursor-pointer min-h-[120px]">
              <PlusCircle size={24} className="mb-2" />
              <span className="text-xs font-mono-sm">Assign New Intern</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
