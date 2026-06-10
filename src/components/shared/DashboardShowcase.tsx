'use client'

import { motion } from 'framer-motion'
import { Terminal, Activity, Server, Cpu, HardDrive, CheckCircle2, Play } from 'lucide-react'

export default function DashboardShowcase() {
  // SVG Chart path generation
  const chartPoints = [
    { x: 0, y: 120 },
    { x: 40, y: 110 },
    { x: 80, y: 130 },
    { x: 120, y: 80 },
    { x: 160, y: 95 },
    { x: 200, y: 60 },
    { x: 240, y: 70 },
    { x: 280, y: 45 },
    { x: 320, y: 50 },
    { x: 360, y: 30 },
    { x: 400, y: 35 },
    { x: 440, y: 15 },
  ]

  const linePath = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L 440 150 L 0 150 Z`

  return (
    <div className="w-full max-w-2xl rounded-xl border border-outline-variant/30 bg-[#0B0B0B]/85 backdrop-blur-xl shadow-2xl overflow-hidden font-mono-sm text-xs text-on-surface-variant/80 select-none">
      {/* OS Header Style */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-outline-variant/20">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/40"></div>
          <div className="w-3 h-3 rounded-full bg-[#eab308]/20 border border-[#eab308]/40"></div>
          <div className="w-3 h-3 rounded-full bg-[#22c55e]/20 border border-[#22c55e]/40"></div>
        </div>
        <div className="text-[10px] text-on-surface-variant/40 bg-[#0B0B0B] px-4 py-1 rounded border border-outline-variant/10 tracking-wide">
          console.kaiketsutech.com/clusters/main
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#4ade80] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
          ONLINE
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0B0B0B]/40">
        {/* Sidebar */}
        <div className="md:col-span-1 border-r border-outline-variant/10 pr-4 flex flex-col gap-3">
          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant/40 font-bold mb-1">Navigation</div>
          <div className="flex items-center gap-2 px-2 py-1.5 bg-[#1a1a1a] rounded text-on-surface border border-outline-variant/10 font-semibold cursor-pointer">
            <Activity size={14} className="text-primary" />
            <span>Overview</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#111111] hover:text-on-surface rounded transition-colors cursor-pointer">
            <Server size={14} />
            <span>Clusters</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#111111] hover:text-on-surface rounded transition-colors cursor-pointer">
            <Terminal size={14} />
            <span>Pipelines</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#111111] hover:text-on-surface rounded transition-colors cursor-pointer">
            <HardDrive size={14} />
            <span>Storage</span>
          </div>

          <div className="mt-auto pt-4 border-t border-outline-variant/10">
            <div className="text-[9px] uppercase tracking-wider text-on-surface-variant/40 font-bold mb-1">Active Region</div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              <span>us-west-2</span>
            </div>
          </div>
        </div>

        {/* Console Workspace */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#111111] border border-outline-variant/15 p-3 rounded flex flex-col gap-1">
              <span className="text-[9px] text-on-surface-variant/50 uppercase font-semibold">Total Requests</span>
              <span className="text-base font-bold text-on-surface font-sans">14,285 /s</span>
              <span className="text-[9px] text-[#4ade80]">+3.8% (1m)</span>
            </div>
            <div className="bg-[#111111] border border-outline-variant/15 p-3 rounded flex flex-col gap-1">
              <span className="text-[9px] text-on-surface-variant/50 uppercase font-semibold">P99 Latency</span>
              <span className="text-base font-bold text-on-surface font-sans">12.4 ms</span>
              <span className="text-[9px] text-on-surface-variant/40">Healthy</span>
            </div>
            <div className="bg-[#111111] border border-outline-variant/15 p-3 rounded flex flex-col gap-1">
              <span className="text-[9px] text-on-surface-variant/50 uppercase font-semibold">Error Rate</span>
              <span className="text-base font-bold text-[#4ade80] font-sans">0.00 %</span>
              <span className="text-[9px] text-on-surface-variant/40">Zero incidents</span>
            </div>
          </div>

          {/* SVG Traffic Chart */}
          <div className="bg-[#111111] border border-outline-variant/15 p-3 rounded flex flex-col gap-3 relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant/60">Network Throughput (MB/s)</span>
              <span className="text-[9px] text-on-surface-variant/40">Interval: 5s</span>
            </div>
            <div className="h-[120px] w-full relative">
              <svg className="w-full h-full" viewBox="0 0 440 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="30" x2="440" y2="30" stroke="#222" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="0" y1="60" x2="440" y2="60" stroke="#222" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="0" y1="90" x2="440" y2="90" stroke="#222" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="0" y1="120" x2="440" y2="120" stroke="#222" strokeWidth="0.5" strokeDasharray="2" />

                {/* Animated Line & Area */}
                <motion.path
                  d={areaPath}
                  fill="url(#areaGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
              </svg>
            </div>
          </div>

          {/* Micro Pipelines / Deployments List */}
          <div className="bg-[#111111] border border-outline-variant/15 rounded divide-y divide-outline-variant/10 overflow-hidden">
            <div className="px-3 py-2 bg-[#171717] flex justify-between items-center">
              <span className="text-[10px] font-bold text-on-surface uppercase">Active Services</span>
              <span className="text-[9px] text-on-surface-variant/50">3 Instances running</span>
            </div>
            
            <div className="px-3 py-2.5 flex items-center justify-between group hover:bg-[#161616] transition-colors">
              <div className="flex items-center gap-2">
                <Server size={12} className="text-on-surface-variant/40" />
                <span className="text-on-surface font-semibold">gateway-service</span>
                <span className="text-[9px] bg-outline-variant/20 px-1 rounded text-on-surface-variant/60">v1.4.2</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-on-surface-variant/50">CPU: 4.8%</span>
                <div className="flex items-center gap-1 text-[#4ade80] text-[10px] font-medium">
                  <CheckCircle2 size={12} />
                  <span>Healthy</span>
                </div>
              </div>
            </div>

            <div className="px-3 py-2.5 flex items-center justify-between group hover:bg-[#161616] transition-colors">
              <div className="flex items-center gap-2">
                <Cpu size={12} className="text-on-surface-variant/40" />
                <span className="text-on-surface font-semibold">api-handler-node</span>
                <span className="text-[9px] bg-outline-variant/20 px-1 rounded text-on-surface-variant/60">v2.1.0</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-on-surface-variant/50">CPU: 12.4%</span>
                <div className="flex items-center gap-1 text-[#4ade80] text-[10px] font-medium">
                  <CheckCircle2 size={12} />
                  <span>Healthy</span>
                </div>
              </div>
            </div>

            <div className="px-3 py-2.5 flex items-center justify-between group hover:bg-[#161616] transition-colors">
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-primary" />
                <span className="text-on-surface font-semibold">payment-worker</span>
                <span className="text-[9px] bg-primary-container/20 px-1 rounded text-primary">deploying</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 bg-outline-variant/10 h-1.5 rounded-full overflow-hidden relative">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: '84%' }}></div>
                </div>
                <span className="text-[9px] text-primary-container font-bold">84%</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
