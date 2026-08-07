'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { initiateCheckout } from '@/lib/payments/checkout'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Check } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import confetti from 'canvas-confetti'
import Reveal from '@/components/marketing/Reveal'
import KineticText from '@/components/marketing/KineticText'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Profile = any

function PriceCard({
  name,
  description,
  price,
  suffix,
  features,
  highlighted,
  ctaLabel,
  onCta,
  loading,
}: {
  name: string
  description: string
  price: string
  suffix?: string
  features: string[]
  highlighted?: boolean
  ctaLabel: string
  onCta: () => void
  loading?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-5 border p-7 ${
        highlighted
          ? 'border-marketing-accent bg-marketing-bg-raised'
          : 'border-marketing-border bg-marketing-bg-raised'
      }`}
    >
      {highlighted && (
        <span className="w-fit rounded-full bg-marketing-accent px-3 py-1 font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-accent-ink">
          Most popular
        </span>
      )}
      <div>
        <h3 className="font-marketing-sans text-xl font-bold text-marketing-fg">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-marketing-muted">{description}</p>
      </div>
      <div>
        <span className="font-marketing-sans text-3xl font-bold text-marketing-fg">{price}</span>
        {suffix && <span className="ml-1 text-sm text-marketing-muted">{suffix}</span>}
      </div>
      <ul className="flex flex-1 flex-col gap-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-marketing-muted">
            <Check size={16} className="mt-0.5 shrink-0 text-marketing-accent" />
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={onCta}
        disabled={loading}
        className={`w-full py-3 font-marketing-mono text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
          highlighted
            ? 'bg-marketing-accent text-marketing-accent-ink hover:bg-marketing-fg'
            : 'border border-marketing-border text-marketing-fg hover:border-marketing-accent'
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  )
}

export default function Pricing() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile>(null)
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

  // Untouched from the pre-port pricing page: real Razorpay checkout, wired
  // to exact package names the `payments` table's check constraint expects
  // (starter/business/enterprise/launch/growth/business_pro/care_plan). Do
  // not rename these or route new categories through this function — the
  // MLOps/AI/DevOps tiers below are consultation-routed instead, same as
  // "Business Pro" already was before this restyle.
  const handleCheckout = async (packageName: string, amountINR: number) => {
    if (!user) {
      toast('Please sign in or register to initiate a project checkout.', 'warning')
      router.push('/login')
      return
    }

    setLoadingCheckout(packageName)
    toast(`Initiating secure checkout for ${packageName}...`, 'info')

    const amountPaise = amountINR * 100

    try {
      await initiateCheckout({
        amount: amountPaise,
        currency: 'INR',
        packageName,
        clientName: profile?.full_name || user.email || 'Client',
        clientEmail: user.email || '',
        onSuccess: async (paymentId, orderId, signature) => {
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
              confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
              router.push('/dashboard/client')
            } else {
              toast('Payment signature verification failed. Please contact support.', 'error')
            }
          } catch {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err.message || 'Checkout failed', 'error')
      setLoadingCheckout(null)
    }
  }

  const goToConsult = (subject: string) => router.push(`/contact?subject=${subject}`)

  return (
    <>
      <section className="px-[6vw] pb-[6vh] pt-[12vh]">
        <Reveal>
          <div className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
            Pricing
          </div>
          <KineticText
            as="h1"
            className="max-w-[16ch] font-marketing-sans text-[clamp(36px,6vw,64px)] font-bold leading-[1.02]"
            text="Precision scalability."
          />
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-marketing-muted">
            Fixed packages for well-defined web work, and scoped engagements for everything more
            involved — custom software, AI-driven features, and the MLOps/DevOps foundation to run
            them reliably. Anything past a fixed package gets a real quote, not a guess.
          </p>
        </Reveal>
      </section>

      {/* Web packages — unchanged pricing/checkout logic, restyled only */}
      <section className="border-t border-marketing-border px-[6vw] py-[8vh]">
        <Reveal className="mb-8">
          <h2 className="font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
            Websites
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0.05}>
            <PriceCard
              name="Launch"
              description="Essential digital presence engineered for speed and responsiveness."
              price="₹9,999"
              suffix="/fixed"
              features={['5-page website', 'Mobile responsive', 'Contact form', 'Basic SEO setup']}
              ctaLabel={loadingCheckout === 'Launch' ? 'Processing…' : 'Select Launch'}
              loading={loadingCheckout !== null}
              onCta={() => handleCheckout('Launch', 9999)}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <PriceCard
              name="Growth"
              description="Complete platform with blog content and analytics."
              price="₹19,999"
              suffix="/fixed"
              highlighted
              features={['Up to 15 pages', 'Complete blog setup', 'Analytics integration', 'Speed optimization']}
              ctaLabel={loadingCheckout === 'Growth' ? 'Processing…' : 'Select Growth'}
              loading={loadingCheckout !== null}
              onCta={() => handleCheckout('Growth', 19999)}
            />
          </Reveal>
          <Reveal delay={0.15}>
            <PriceCard
              name="Business Pro"
              description="Custom functionality, API integrations, and advanced architecture."
              price="₹49,999+"
              features={['Custom functionality', 'Core API integrations', 'Advanced SEO optimization']}
              ctaLabel="Contact sales"
              onCta={() => goToConsult('consulting')}
            />
          </Reveal>
          <Reveal delay={0.2}>
            <PriceCard
              name="Care Plan"
              description="Continuous maintenance, priority support, backups, and security audits."
              price="₹2,999"
              suffix="/mo"
              features={['Hosting management', 'Regular core updates', 'Daily cloud backups', 'Priority technical support']}
              ctaLabel={loadingCheckout === 'Care_Plan' ? 'Processing…' : 'Select Care Plan'}
              loading={loadingCheckout !== null}
              onCta={() => handleCheckout('Care_Plan', 2999)}
            />
          </Reveal>
        </div>
      </section>

      {/* Custom software / MVP */}
      <section className="border-t border-marketing-border px-[6vw] py-[8vh]">
        <Reveal className="mb-8">
          <h2 className="font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
            Custom software &amp; MVP development
          </h2>
          <p className="mt-2 max-w-[60ch] text-sm text-marketing-muted">
            Full applications, not templated sites — scoped after a technical discovery call, priced
            below typical agency rates since we run lean.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Reveal delay={0.05}>
            <PriceCard
              name="MVP Sprint"
              description="A working first version — one core user flow, built to validate the idea fast."
              price="₹4,00,000+"
              features={['4–8 week build', 'One core product flow', 'Auth, database, deployment included', 'Fixed-scope, fixed-price']}
              ctaLabel="Scope a project"
              onCta={() => goToConsult('software')}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <PriceCard
              name="Custom Platform"
              description="Multi-feature web or mobile application with real integrations."
              price="₹9,00,000+"
              highlighted
              features={['8–16 week build', 'Multiple user roles/flows', 'Third-party API integrations', 'Automated test coverage']}
              ctaLabel="Scope a project"
              onCta={() => goToConsult('software')}
            />
          </Reveal>
          <Reveal delay={0.15}>
            <PriceCard
              name="Enterprise Build"
              description="Large-scale systems — legacy modernization, multi-service architecture."
              price="Custom quote"
              features={['Dedicated project team', 'Architecture & security review', 'Ongoing SLA available']}
              ctaLabel="Talk to engineering"
              onCta={() => goToConsult('consulting')}
            />
          </Reveal>
        </div>
      </section>

      {/* AI-driven solutions */}
      <section className="border-t border-marketing-border px-[6vw] py-[8vh]">
        <Reveal className="mb-8">
          <h2 className="font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
            AI-driven solutions
          </h2>
          <p className="mt-2 max-w-[60ch] text-sm text-marketing-muted">
            Built on established LLM/ML APIs and, where it earns its cost, custom models — not a
            chatbot widget with a markup.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Reveal delay={0.05}>
            <PriceCard
              name="AI Assistant"
              description="A support or sales assistant grounded in your own data — docs, catalog, or CRM."
              price="₹1,50,000+"
              features={['Retrieval over your own content', 'Web or in-app chat widget', 'Usage analytics dashboard']}
              ctaLabel="Scope a project"
              onCta={() => goToConsult('software')}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <PriceCard
              name="Custom AI Feature"
              description="A specific capability bolted onto an existing product — recommendations, search, scoring."
              price="₹3,50,000+"
              highlighted
              features={['Model selection & fine-tuning where warranted', 'Production inference pipeline', 'Evaluation harness, not vibes']}
              ctaLabel="Scope a project"
              onCta={() => goToConsult('software')}
            />
          </Reveal>
          <Reveal delay={0.15}>
            <PriceCard
              name="Enterprise AI System"
              description="Multi-model systems with compliance, audit trail, and human-in-the-loop review."
              price="Custom quote"
              features={['Security & compliance review (SOC 2 / GDPR-aware)', 'Human review workflows', 'Dedicated ML engineering team']}
              ctaLabel="Talk to engineering"
              onCta={() => goToConsult('consulting')}
            />
          </Reveal>
        </div>
      </section>

      {/* MLOps / DevOps / DataOps retainers */}
      <section className="border-t border-marketing-border px-[6vw] py-[8vh]">
        <Reveal className="mb-8">
          <h2 className="font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
            MLOps, DevOps &amp; DataOps
          </h2>
          <p className="mt-2 max-w-[60ch] text-sm text-marketing-muted">
            The infrastructure that keeps models and deployments reliable after the first ship —
            monthly retainers, not one-off setup and disappear.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Reveal delay={0.05}>
            <PriceCard
              name="DevOps Care"
              description="CI/CD, infrastructure-as-code, and cloud cost review for one production system."
              price="₹35,000+"
              suffix="/mo"
              features={['CI/CD pipeline ownership', 'Infra-as-code (Terraform/equivalent)', 'Monthly cloud cost review']}
              ctaLabel="Start a retainer"
              onCta={() => goToConsult('infrastructure')}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <PriceCard
              name="MLOps Foundation"
              description="Model registry, versioned pipelines, and monitoring for a production ML system."
              price="₹1,50,000+"
              suffix="/mo"
              highlighted
              features={['Model registry & versioning', 'Automated retraining pipeline', 'Drift & performance monitoring']}
              ctaLabel="Start a retainer"
              onCta={() => goToConsult('infrastructure')}
            />
          </Reveal>
          <Reveal delay={0.15}>
            <PriceCard
              name="Data Platform"
              description="Pipelines and warehousing for teams whose data has outgrown spreadsheets and cron jobs."
              price="Custom quote"
              features={['ETL/ELT pipeline design', 'Warehouse & access-control setup', 'On-call SLA available']}
              ctaLabel="Talk to engineering"
              onCta={() => goToConsult('consulting')}
            />
          </Reveal>
        </div>
        <p className="mt-6 text-xs text-marketing-muted-dim">
          Reference ranges: informed by 2026 published benchmarks for MLOps/platform engagements
          (typically $20k–60k per sprint at established consultancies) and managed DevOps retainers
          ($3k–15k/mo) — priced here for a smaller, earlier-stage engagement than those figures
          assume. Enterprise-scale work is quoted directly, not templated.
        </p>
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[10vh]">
        <Reveal className="mx-auto max-w-2xl border border-marketing-border bg-marketing-bg-raised p-10 text-center">
          <h2 className="mb-3 font-marketing-sans text-2xl font-bold text-marketing-fg">
            Unsure which one fits?
          </h2>
          <p className="mb-6 text-marketing-muted">
            Talk directly with the engineers who&rsquo;d build it — we&rsquo;ll help you find the
            right scope before you commit to one.
          </p>
          <button
            onClick={() => goToConsult('consulting')}
            className="rounded-full bg-marketing-accent px-7 py-3.5 text-sm font-semibold text-marketing-accent-ink transition-colors hover:bg-marketing-fg"
          >
            Schedule a consultation
          </button>
        </Reveal>
      </section>
    </>
  )
}
