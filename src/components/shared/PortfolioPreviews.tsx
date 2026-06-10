'use client'

import { motion } from 'framer-motion'
import { Landmark, Activity, ShoppingBag, Truck, CheckCircle, Database } from 'lucide-react'

// 1. FinTech: Nexus Banking Platform
export function NexusBankingPreview() {
  return (
    <div className="w-full h-full bg-[#0E0E0E] border border-outline-variant/15 p-4 flex flex-col justify-between font-mono-sm text-[9px] text-on-surface-variant/60 relative overflow-hidden select-none">
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-1.5">
        <div className="flex items-center gap-1">
          <Landmark size={12} className="text-primary" />
          <span className="font-bold text-[8px] uppercase tracking-wider text-on-surface">Nexus Client Console</span>
        </div>
        <span className="text-[7px] text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 px-1 rounded">Vault: Connected</span>
      </div>

      {/* Account Info Card */}
      <div className="bg-[#141414] border border-outline-variant/10 rounded p-2 flex justify-between items-center my-1.5">
        <div>
          <span className="text-[7px] text-on-surface-variant/40 block uppercase">Net Liquidity</span>
          <span className="text-sm font-bold text-on-surface font-sans">$318,450.00</span>
        </div>
        <div className="w-12 h-7 bg-[#1c1c1c] border border-outline-variant/20 rounded-md p-1 flex flex-col justify-between relative">
          <div className="w-2 h-2 rounded bg-primary-container"></div>
          <div className="text-[5px] text-on-surface-variant/40 text-right">**** 4291</div>
        </div>
      </div>

      {/* Ledger Entries */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center py-1 border-b border-outline-variant/5">
          <span>Kaiketsu Tech Invoice</span>
          <span className="text-[#ef4444] font-sans">-$14,500.00</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-outline-variant/5">
          <span>Strype Platform Payout</span>
          <span className="text-[#4ade80] font-sans">+$84,200.00</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-outline-variant/5">
          <span>AWS Cloud Hosting</span>
          <span className="text-[#ef4444] font-sans">-$1,240.00</span>
        </div>
      </div>
    </div>
  )
}

// 2. Healthcare: MediTrack Systems
export function MediTrackPreview() {
  return (
    <div className="w-full h-full bg-[#0E0E0E] border border-outline-variant/15 p-4 flex flex-col justify-between font-mono-sm text-[9px] text-on-surface-variant/60 relative overflow-hidden select-none">
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-1.5">
        <div className="flex items-center gap-1">
          <Activity size={12} className="text-[#00a2f4]" />
          <span className="font-bold text-[8px] uppercase tracking-wider text-on-surface">MediTrack Node Monitor</span>
        </div>
        <span className="text-[7px] text-[#4ade80] font-semibold flex items-center gap-1">
          <span className="w-1 h-1 bg-[#4ade80] rounded-full animate-pulse"></span>
          ACTIVE
        </span>
      </div>

      {/* Shipment Tracker Metrics */}
      <div className="grid grid-cols-2 gap-1.5 my-1.5">
        <div className="bg-[#141414] border border-outline-variant/10 p-1.5 rounded">
          <div className="text-[7px] text-on-surface-variant/40 uppercase">SLA Success</div>
          <div className="text-xs font-bold text-on-surface font-sans">99.88%</div>
        </div>
        <div className="bg-[#141414] border border-outline-variant/10 p-1.5 rounded">
          <div className="text-[7px] text-on-surface-variant/40 uppercase">Cold Chain</div>
          <div className="text-xs font-bold text-[#4ade80] font-sans">-74°C avg</div>
        </div>
      </div>

      {/* Active Batches */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center bg-[#111] px-2 py-1 border border-outline-variant/5 rounded">
          <div className="flex flex-col">
            <span className="text-on-surface font-semibold">BATCH_B204</span>
            <span className="text-[6px] text-on-surface-variant/40">Pfizer Comirnaty</span>
          </div>
          <span className="text-[#4ade80] text-[8px] bg-[#4ade80]/10 px-1 rounded border border-[#4ade80]/20 font-semibold">Delivered</span>
        </div>
        <div className="flex justify-between items-center bg-[#111] px-2 py-1 border border-outline-variant/5 rounded">
          <div className="flex flex-col">
            <span className="text-on-surface font-semibold">BATCH_B205</span>
            <span className="text-[6px] text-on-surface-variant/40">Moderna Spikevax</span>
          </div>
          <span className="text-primary-container text-[8px] bg-primary-container/10 px-1 rounded border border-primary-container/20 font-semibold">In Transit</span>
        </div>
      </div>
    </div>
  )
}

// 3. E-Commerce: Aura Retail API
export function AuraRetailPreview() {
  return (
    <div className="w-full h-full bg-[#0E0E0E] border border-outline-variant/15 p-4 flex flex-col justify-between font-mono-sm text-[9px] text-on-surface-variant/60 relative overflow-hidden select-none">
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-1.5">
        <div className="flex items-center gap-1">
          <ShoppingBag size={12} className="text-primary" />
          <span className="font-bold text-[8px] uppercase tracking-wider text-on-surface">Aura API Logs</span>
        </div>
        <span className="text-[7px] text-on-surface-variant/40 font-mono-sm">v2.4-stable</span>
      </div>

      {/* Response Metrics Graph simulation */}
      <div className="bg-[#141414] border border-outline-variant/10 p-2 rounded my-1.5 flex justify-between items-center">
        <div>
          <span className="text-[7px] text-on-surface-variant/40 block uppercase">Gateway Latency</span>
          <span className="text-xs font-bold text-[#4ade80] font-sans">14ms p95</span>
        </div>
        {/* Simple inline line graph */}
        <svg className="w-16 h-6" viewBox="0 0 60 20">
          <path d="M0 18 L10 12 L20 15 L30 8 L40 10 L50 2 L60 4" fill="none" stroke="#f97316" strokeWidth="1.5" />
        </svg>
      </div>

      {/* API Calls Logger */}
      <div className="flex flex-col gap-1 font-mono text-[7px] leading-tight">
        <div className="flex justify-between items-center text-on-surface-variant/50">
          <span>GET /v2/products?limit=25</span>
          <span className="text-[#4ade80] font-bold">200 OK (8ms)</span>
        </div>
        <div className="flex justify-between items-center text-on-surface-variant/50">
          <span>POST /v2/checkout/session</span>
          <span className="text-[#4ade80] font-bold">201 OK (18ms)</span>
        </div>
        <div className="flex justify-between items-center text-on-surface-variant/50">
          <span>GET /v2/webhooks/stripe</span>
          <span className="text-[#4ade80] font-bold">200 OK (11ms)</span>
        </div>
      </div>
    </div>
  )
}

// 4. Logistics: Vanguard Routing Engine
export function VanguardRoutingPreview() {
  return (
    <div className="w-full h-full bg-[#0E0E0E] border border-outline-variant/15 p-4 flex flex-col justify-between font-mono-sm text-[9px] text-on-surface-variant/60 relative overflow-hidden select-none">
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-1.5">
        <div className="flex items-center gap-1">
          <Truck size={12} className="text-primary" />
          <span className="font-bold text-[8px] uppercase tracking-wider text-on-surface">Vanguard Map Router</span>
        </div>
        <span className="text-[7px] text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 px-1 rounded">Fleet: Online</span>
      </div>

      {/* SVG Map Path Grid Preview */}
      <div className="flex-grow my-2 bg-[#121212] border border-outline-variant/10 rounded relative h-20 overflow-hidden">
        {/* Simple map visual grid layout */}
        <svg className="w-full h-full" viewBox="0 0 200 80">
          {/* Map paths */}
          <path d="M20 20 Q100 10 180 30 M20 20 Q80 70 180 30 M80 70 Q130 40 180 30" fill="none" stroke="rgba(88, 66, 55, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M20 20 Q100 10 180 30" fill="none" stroke="#f97316" strokeWidth="1.2" strokeDasharray="5 15" strokeDashoffset="0" className="animate-[dash_6s_linear_infinite]" />
          
          {/* Node dots */}
          <circle cx="20" cy="20" r="3" fill="#ffdcc3" stroke="#f97316" strokeWidth="1" />
          <circle cx="180" cy="30" r="3" fill="#ffdcc3" stroke="#f97316" strokeWidth="1" />
          <circle cx="80" cy="70" r="3" fill="#ffdcc3" stroke="#f97316" strokeWidth="1" />
          
          {/* Active vehicle dot */}
          <circle cx="100" cy="21" r="2" fill="#4ade80" />
        </svg>
      </div>

      {/* Routing stats */}
      <div className="flex justify-between text-[8px] border-t border-outline-variant/10 pt-1 text-on-surface-variant/40">
        <span>Active Dispatch: 148 fleets</span>
        <span>ETA compliance: 98.4%</span>
      </div>
    </div>
  )
}
