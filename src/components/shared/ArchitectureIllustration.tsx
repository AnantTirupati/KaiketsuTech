'use client'

import { motion } from 'framer-motion'
import { Monitor, ShieldCheck, Cpu, Database, Server } from 'lucide-react'

export default function ArchitectureIllustration() {
  return (
    <div className="w-full h-full min-h-[360px] bg-[#0B0B0B] border border-outline-variant/20 rounded-xl p-5 flex flex-col justify-between font-mono-sm text-[10px] text-on-surface-variant/70 relative overflow-hidden select-none">
      {/* Decorative Blueprint Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      {/* Diagram Title Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/15 pb-2 relative z-10">
        <div className="flex items-center gap-1.5 font-bold text-on-surface uppercase text-[9px] tracking-wider">
          <Server size={12} className="text-primary" />
          <span>System Topology Diagram</span>
        </div>
        <span className="text-[8px] bg-primary-container/20 px-2 py-0.5 rounded text-primary font-semibold">
          Active SLA: 99.99%
        </span>
      </div>

      {/* Diagram Body */}
      <div className="flex-grow flex flex-col justify-between items-center py-6 gap-3 relative z-10">
        
        {/* Layer 1: Client Gateway */}
        <div className="flex flex-col items-center w-full">
          <div className="bg-[#111] border border-outline-variant/20 rounded-lg p-2.5 flex items-center gap-2.5 w-48 shadow-md">
            <Monitor size={14} className="text-on-surface-variant/50" />
            <div className="flex-grow">
              <div className="text-on-surface font-semibold text-[9px]">Client Gateway</div>
              <div className="text-[8px] text-on-surface-variant/40">TLS 1.3 | port: 443</div>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></span>
          </div>
          
          {/* Connector Line down */}
          <div className="w-0.5 h-6 bg-outline-variant/20 relative">
            <div className="absolute inset-0 bg-primary-container/40 animate-pulse"></div>
          </div>
        </div>

        {/* Layer 2: API & Load Balancing Router */}
        <div className="flex flex-col items-center w-full">
          <div className="bg-[#111] border border-primary-container/30 rounded-lg p-2.5 flex items-center gap-2.5 w-48 shadow-md relative">
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary-container rounded-full flex items-center justify-center text-[7px] text-white font-bold">1</div>
            <ShieldCheck size={14} className="text-primary" />
            <div className="flex-grow">
              <div className="text-on-surface font-semibold text-[9px]">API Gateway / Router</div>
              <div className="text-[8px] text-on-surface-variant/40">Rate-Limited | auth proxy</div>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
          </div>

          {/* Branching Connectors down */}
          <svg className="w-72 h-8" viewBox="0 0 288 32" fill="none">
            <path d="M144 0 V12 H24 V32 M144 12 H264 V32 M144 0 V32" stroke="rgba(88, 66, 55, 0.3)" strokeWidth="1" />
            {/* Subtle animated path flow dashes */}
            <path d="M144 0 V12 H24 V32 M144 12 H264 V32 M144 0 V32" stroke="#f97316" strokeWidth="1" strokeDasharray="6 20" strokeDashoffset="0" className="animate-[dash_4s_linear_infinite]" />
          </svg>
        </div>

        {/* Layer 3: Replicated Microservices */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          
          {/* Node 1 */}
          <div className="bg-[#111] border border-outline-variant/20 rounded-lg p-2 flex flex-col justify-between h-16 shadow">
            <div className="flex justify-between items-center">
              <Cpu size={12} className="text-on-surface-variant/40" />
              <span className="w-1 h-1 rounded-full bg-[#4ade80]"></span>
            </div>
            <div>
              <div className="text-on-surface font-semibold text-[8px]">auth-srv</div>
              <div className="text-[7px] text-on-surface-variant/40">port: 8081</div>
            </div>
          </div>

          {/* Node 2 */}
          <div className="bg-[#111] border border-outline-variant/20 rounded-lg p-2 flex flex-col justify-between h-16 shadow">
            <div className="flex justify-between items-center">
              <Cpu size={12} className="text-on-surface-variant/40" />
              <span className="w-1 h-1 rounded-full bg-[#4ade80]"></span>
            </div>
            <div>
              <div className="text-on-surface font-semibold text-[8px]">project-api</div>
              <div className="text-[7px] text-on-surface-variant/40">port: 8082</div>
            </div>
          </div>

          {/* Node 3 */}
          <div className="bg-[#111] border border-outline-variant/20 rounded-lg p-2 flex flex-col justify-between h-16 shadow">
            <div className="flex justify-between items-center">
              <Cpu size={12} className="text-on-surface-variant/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
            </div>
            <div>
              <div className="text-on-surface font-semibold text-[8px]">payment-srv</div>
              <div className="text-[7px] text-on-surface-variant/40">port: 8083</div>
            </div>
          </div>

        </div>

        {/* Connecting Lines to Storage */}
        <svg className="w-72 h-8" viewBox="0 0 288 32" fill="none">
          <path d="M24 0 V16 H100 V32 M264 0 V16 H188 V32 M144 0 V32" stroke="rgba(88, 66, 55, 0.3)" strokeWidth="1" />
        </svg>

        {/* Layer 4: Storage Cluster */}
        <div className="flex justify-center gap-6 w-full">
          {/* Redis Cache */}
          <div className="bg-[#111] border border-outline-variant/20 rounded-lg p-2 flex items-center gap-2 w-32 shadow">
            <Database size={12} className="text-primary" />
            <div>
              <div className="text-on-surface font-semibold text-[8px]">Redis Cache</div>
              <div className="text-[7px] text-on-surface-variant/40">cluster: 6379</div>
            </div>
          </div>

          {/* Postgres DB */}
          <div className="bg-[#111] border border-outline-variant/20 rounded-lg p-2 flex items-center gap-2 w-36 shadow">
            <Database size={12} className="text-primary" />
            <div>
              <div className="text-on-surface font-semibold text-[8px]">PostgreSQL DB</div>
              <div className="text-[7px] text-on-surface-variant/40">master | port: 5432</div>
            </div>
          </div>
        </div>

      </div>

      {/* Deployment Status Footer */}
      <div className="border-t border-outline-variant/15 pt-2 flex justify-between items-center text-[8px] text-on-surface-variant/40">
        <div>Pipeline: deployment-k8s.yaml</div>
        <div>Build: v2.4.1-stable</div>
      </div>
    </div>
  )
}
