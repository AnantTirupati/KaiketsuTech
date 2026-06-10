'use client'

import { motion } from 'framer-motion'
import { Terminal, Database, CreditCard, ArrowUpRight } from 'lucide-react'

// 1. Web Development Illustration: Code Workspace to Browser Preview
export function WebDevMockup() {
  return (
    <div className="w-full h-36 bg-[#0B0B0B] border border-outline-variant/15 rounded-lg overflow-hidden relative flex p-3 gap-3 font-mono-sm text-[10px] text-on-surface-variant/70">
      {/* Code Editor Mockup Side */}
      <div className="flex-1 border-r border-outline-variant/10 pr-2 flex flex-col justify-between select-none">
        <div className="flex items-center gap-1.5 opacity-45 pb-1 border-b border-outline-variant/10">
          <Terminal size={10} />
          <span className="text-[8px]">index.tsx</span>
        </div>
        <div className="flex-grow flex flex-col gap-1 pt-2 font-mono text-[9px] leading-tight">
          <div className="text-on-surface-variant/40">import {'{ motion }'} from 'framer'</div>
          <div className="text-primary-container">const App = () =&gt; {'{'}</div>
          <div className="pl-2 text-on-surface-variant/60">return (</div>
          <div className="pl-4 text-[#ffdcc3]">&lt;motion.div</div>
          <div className="pl-6 text-primary-container">layout</div>
          <div className="pl-4 text-[#ffdcc3]">&gt;Deploying&lt;/div&gt;</div>
        </div>
      </div>

      {/* Browser Preview Side */}
      <div className="flex-1 flex flex-col select-none">
        <div className="flex items-center justify-between pb-1 border-b border-outline-variant/10 text-[8px] opacity-45">
          <span>localhost:3000</span>
          <ArrowUpRight size={8} />
        </div>
        <div className="flex-grow flex flex-col gap-2 pt-2 justify-center">
          {/* Card Mockup */}
          <div className="border border-outline-variant/20 bg-[#161616] p-2 rounded flex flex-col gap-1.5">
            <div className="w-1/2 h-1.5 bg-on-surface-variant/40 rounded"></div>
            <div className="w-full h-1 bg-on-surface-variant/20 rounded"></div>
            <div className="flex justify-between items-center pt-1">
              <div className="w-8 h-2.5 bg-primary-container/20 rounded border border-primary-container/30"></div>
              <div className="w-4 h-1 bg-on-surface-variant/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 2. E-Commerce Illustration: Real Checkout Flow & Transaction Ledger
export function ECommerceMockup() {
  return (
    <div className="w-full h-36 bg-[#0B0B0B] border border-outline-variant/15 rounded-lg overflow-hidden relative p-3 flex flex-col justify-between font-mono-sm text-[10px] text-on-surface-variant/70 select-none">
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-1">
        <div className="flex items-center gap-1">
          <CreditCard size={12} className="text-primary" />
          <span className="font-bold text-[9px] uppercase tracking-wider">Payment Ledger</span>
        </div>
        <span className="text-[8px] text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 px-1 rounded font-semibold">API: Live</span>
      </div>

      {/* Transaction Records */}
      <div className="flex-grow flex flex-col gap-2 justify-center">
        <div className="flex items-center justify-between bg-[#111] border border-outline-variant/10 p-2 rounded">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-on-surface">txn_9281a8c</span>
            <span className="text-[8px] text-on-surface-variant/40">Client: Stripe Inc.</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-[#4ade80] font-sans">+$4,820.00</span>
            <div className="text-[8px] text-[#4ade80]">Succeeded</div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#111] border border-outline-variant/10 p-2 rounded opacity-65">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-on-surface">txn_9281a8b</span>
            <span className="text-[8px] text-on-surface-variant/40">Client: Vercel Pro</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-on-surface font-sans">+$250.00</span>
            <div className="text-[8px] text-on-surface-variant/40">Succeeded</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 3. Business Platforms / API Routing & Database Clusters
export function PlatformsMockup() {
  return (
    <div className="w-full h-36 bg-[#0B0B0B] border border-outline-variant/15 rounded-lg overflow-hidden relative p-3 flex gap-3 font-mono-sm text-[10px] text-on-surface-variant/70 select-none">
      {/* Cluster Node Rack */}
      <div className="flex-1 border-r border-outline-variant/10 pr-2 flex flex-col gap-2">
        <div className="flex items-center gap-1 opacity-45 border-b border-outline-variant/10 pb-1">
          <Database size={12} />
          <span className="text-[8px] uppercase tracking-wider font-bold">Node Rack</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between bg-[#111] border border-[#222] px-2 py-1 rounded">
            <span>srv-01</span>
            <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse"></span>
          </div>
          <div className="flex items-center justify-between bg-[#111] border border-[#222] px-2 py-1 rounded">
            <span>srv-02</span>
            <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse"></span>
          </div>
          <div className="flex items-center justify-between bg-[#111] border border-[#222] px-2 py-1 rounded">
            <span>srv-03</span>
            <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full"></span>
          </div>
        </div>
      </div>

      {/* API Gateway Router Visual */}
      <div className="flex-grow flex flex-col justify-between">
        <div className="opacity-45 border-b border-outline-variant/10 pb-1 text-[8px] uppercase tracking-wider font-bold">
          API Router
        </div>
        <div className="flex-grow flex flex-col gap-1 pt-1.5">
          <div className="flex justify-between items-center text-[8px]">
            <span>GET /v1/health</span>
            <span className="text-[#4ade80] font-sans font-semibold">200 OK</span>
          </div>
          <div className="flex justify-between items-center text-[8px]">
            <span>POST /v1/orders</span>
            <span className="text-[#4ade80] font-sans font-semibold">201 OK</span>
          </div>
          <div className="flex justify-between items-center text-[8px] opacity-50">
            <span>GET /v1/metrics</span>
            <span className="text-[#4ade80] font-sans font-semibold">200 OK</span>
          </div>
        </div>
      </div>
    </div>
  )
}
