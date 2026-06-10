'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { initiateCheckout } from '@/lib/payments/checkout'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Check, HelpCircle } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import confetti from 'canvas-confetti'

export default function Pricing() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
          .then(({ data: p }) => setProfile(p))
      }
    })
  }, [supabase])

  const handleCheckout = async (packageName: string, amountUSD: number) => {
    if (!user) {
      toast('Please sign in or register to initiate a project checkout.', 'warning')
      router.push('/auth/signin')
      return
    }

    setLoadingCheckout(packageName)
    toast(`Initiating secure checkout for ${packageName}...`, 'info')

    // Amount in cents / paise. Let's convert USD to paise (1 USD = 80 INR or just treat USD in cents)
    // Razorpay supports USD. Amount is in cents.
    const amountCents = amountUSD * 100

    try {
      await initiateCheckout({
        amount: amountCents,
        currency: 'USD',
        packageName,
        clientName: profile?.full_name || user.email || 'Client',
        clientEmail: user.email || '',
        onSuccess: async (paymentId, orderId, signature) => {
          // Verify on the server
          try {
            const res = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: orderId,
                razorpay_payment_id: paymentId,
                razorpay_signature: signature,
              }),
            })

            if (res.ok) {
              toast(`Payment verified successfully! Welcome to ${packageName}.`, 'success')
              // Trigger confetti celebration!
              confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
              })
              router.push('/dashboard/client')
            } else {
              toast('Payment signature verification failed. Please contact support.', 'error')
            }
          } catch (err) {
            toast('Failed to verify payment on server.', 'error')
          } finally {
            setLoadingCheckout(null)
          }
        },
        onError: (error) => {
          toast(error.message || 'Checkout error occurred.', 'error')
          setLoadingCheckout(null)
        },
      })
    } catch (err: any) {
      toast(err.message || 'Checkout failed', 'error')
      setLoadingCheckout(null)
    }
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      <main className="flex-grow pt-[100px]">
        {/* Pricing Hero */}
        <section className="relative pt-24 pb-8 flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-container/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h1 className="font-display-lg text-5xl md:text-7xl lg:text-7xl font-bold text-on-surface mb-stack-md relative z-10">
            Precision Scalability.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto relative z-10">
            Enterprise-grade architecture tailored to your operational complexity. Choose the tier that aligns with your digital transformation phase.
          </p>
        </section>

        {/* Pricing Packages Grid */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">
            {/* Starter Package */}
            <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg flex flex-col transition-all duration-300 hover:border-outline">
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm text-2xl font-bold">Starter</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg flex-grow">
                Essential digital infrastructure for focused operational upgrades.
              </p>
              <div className="mb-stack-lg">
                <span className="font-display-lg-mobile md:font-headline-xl text-3xl md:text-4xl font-bold text-on-surface">$4,000</span>
                <span className="font-body-md text-body-md text-on-surface-variant">/mo</span>
              </div>
              <ul className="flex flex-col gap-stack-md mb-stack-lg font-body-md text-body-md text-on-surface-variant">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5" /> Core API Integrations
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5" /> Standard SLA (48hr)
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5" /> 2 Analytics Dashboards
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('Starter', 4000)}
                disabled={loadingCheckout !== null}
                className="w-full py-3 bg-surface-container-low border border-outline-variant text-on-surface font-label-md text-label-md rounded hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container disabled:opacity-50 cursor-pointer"
              >
                {loadingCheckout === 'Starter' ? 'Processing...' : 'Select Starter'}
              </button>
            </div>

            {/* Enterprise Package (Highlighted) */}
            <div className="bg-surface-container border border-primary-container p-stack-lg flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-primary-container/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-container font-section-label text-section-label px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
                Recommended
              </div>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-stack-sm text-2xl font-bold mt-2">Enterprise</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg flex-grow">
                Bespoke architecture, dedicated engineering squads, and limitless scale.
              </p>
              <div className="mb-stack-lg">
                <span className="font-display-lg-mobile md:font-headline-xl text-3xl md:text-4xl font-bold text-on-surface">Custom</span>
              </div>
              <ul className="flex flex-col gap-stack-md mb-stack-lg font-body-md text-body-md text-on-surface">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-primary-container mt-0.5" /> Dedicated Engineering Squad
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-primary-container mt-0.5" /> Custom Architecture Design
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-primary-container mt-0.5" /> 24/7 Priority SLA (1hr)
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-primary-container mt-0.5" /> Unlimited Data Pipelines
                </li>
              </ul>
              <button
                onClick={() => router.push('/contact?subject=consulting')}
                className="w-full py-3 bg-primary-container text-on-primary-container font-label-md text-label-md rounded hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-container cursor-pointer"
              >
                Contact Sales
              </button>
            </div>

            {/* Business Package */}
            <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg flex flex-col transition-all duration-300 hover:border-outline">
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm text-2xl font-bold">Business</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg flex-grow">
                Advanced workflows and multi-system orchestration for growing teams.
              </p>
              <div className="mb-stack-lg">
                <span className="font-display-lg-mobile md:font-headline-xl text-3xl md:text-4xl font-bold text-on-surface">$12,000</span>
                <span className="font-body-md text-body-md text-on-surface-variant">/mo</span>
              </div>
              <ul className="flex flex-col gap-stack-md mb-stack-lg font-body-md text-body-md text-on-surface-variant">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5" /> Multi-system Orchestration
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5" /> Priority SLA (12hr)
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5" /> Custom ETL Pipelines
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5" /> SSO & Advanced Security
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('Business', 12000)}
                disabled={loadingCheckout !== null}
                className="w-full py-3 bg-surface-container-low border border-outline-variant text-on-surface font-label-md text-label-md rounded hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container disabled:opacity-50 cursor-pointer"
              >
                {loadingCheckout === 'Business' ? 'Processing...' : 'Select Business'}
              </button>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop mb-16 overflow-x-auto">
          <h2 className="font-headline-xl text-headline-xl text-on-surface mb-stack-lg text-5xl font-bold">Feature Comparison</h2>
          <div className="min-w-[800px] border border-outline-variant/20 rounded-lg p-6 bg-surface-container-lowest">
            <div className="grid grid-cols-4 border-b border-outline-variant pb-stack-sm mb-stack-sm font-section-label text-[11px] text-on-surface-variant uppercase tracking-widest font-bold">
              <div className="col-span-1">Features</div>
              <div className="col-span-1 text-center">Starter</div>
              <div className="col-span-1 text-center">Business</div>
              <div className="col-span-1 text-center text-primary">Enterprise</div>
            </div>
            <div className="grid grid-cols-4 border-b border-surface-container-highest py-3 items-center font-body-md text-sm text-on-surface hover:bg-surface-container-low/50 transition-colors">
              <div className="col-span-1 text-on-surface-variant">API Requests/mo</div>
              <div className="col-span-1 text-center">1 Million</div>
              <div className="col-span-1 text-center">10 Million</div>
              <div className="col-span-1 text-center font-semibold text-primary">Unlimited</div>
            </div>
            <div className="grid grid-cols-4 border-b border-surface-container-highest py-3 items-center font-body-md text-sm text-on-surface hover:bg-surface-container-low/50 transition-colors">
              <div className="col-span-1 text-on-surface-variant">Data Retention</div>
              <div className="col-span-1 text-center">30 Days</div>
              <div className="col-span-1 text-center">1 Year</div>
              <div className="col-span-1 text-center font-semibold text-primary">Indefinite</div>
            </div>
            <div className="grid grid-cols-4 border-b border-surface-container-highest py-3 items-center font-body-md text-sm text-on-surface hover:bg-surface-container-low/50 transition-colors">
              <div className="col-span-1 text-on-surface-variant">Custom Webhooks</div>
              <div className="col-span-1 text-center text-outline-variant">—</div>
              <div className="col-span-1 text-center text-on-surface">✓</div>
              <div className="col-span-1 text-center text-primary font-semibold">✓</div>
            </div>
            <div className="grid grid-cols-4 py-3 items-center font-body-md text-sm text-on-surface hover:bg-surface-container-low/50 transition-colors">
              <div className="col-span-1 text-on-surface-variant">Dedicated Account Manager</div>
              <div className="col-span-1 text-center text-outline-variant">—</div>
              <div className="col-span-1 text-center text-outline-variant">—</div>
              <div className="col-span-1 text-center text-primary font-semibold">✓</div>
            </div>
          </div>
        </section>

        {/* Consultation CTA */}
        <section className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop mb-24 text-center">
          <div className="bg-surface-container-low border border-outline-variant p-12 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent pointer-events-none"></div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface mb-stack-md text-xl md:text-5xl font-bold relative z-10">Unsure of your architectural needs?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto relative z-10">
              Speak directly with a Principal Engineer to map out a deployment strategy that fits your precise requirements.
            </p>
            <button
              onClick={() => router.push('/contact?subject=consulting')}
              className="relative z-10 px-8 py-4 bg-primary-container text-on-primary-container font-label-md text-label-md font-bold tracking-wider hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-container-low focus:ring-primary-container cursor-pointer"
            >
              Schedule Technical Consultation
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
