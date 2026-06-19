'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function TopNavBar() {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let active = true

    async function fetchRole(userId: string) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single()
        if (active && data) {
          setRole(data.role)
        }
      } catch (err) {
        console.error('Error fetching role in navbar:', err)
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      if (data.user) {
        setUser(data.user)
        const userRole = data.user.user_metadata?.role
        if (userRole) {
          setRole(userRole)
        } else {
          fetchRole(data.user.id)
        }
      } else {
        setUser(null)
        setRole(null)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (session?.user) {
        setUser(session.user)
        const userRole = session.user.user_metadata?.role
        if (userRole) {
          setRole(userRole)
        } else {
          fetchRole(session.user.id)
        }
      } else {
        setUser(null)
        setRole(null)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Hide nav bar on auth screens and dashboard screens
  if (pathname.startsWith('/auth') || pathname.startsWith('/dashboard')) {
    return null
  }

  return (
    <nav className="bg-background/80 backdrop-blur-md text-primary font-body-md text-body-md fixed top-0 w-full z-50 border-b border-outline-variant/20 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center gap-4 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop h-20">
        <Link href="/" className="hover:opacity-90 transition-opacity shrink-0">
          <img src="/weblogo.svg" alt="KaiketsuTech Logo" className="h-12 w-auto" />
        </Link>
        
        <ul className="hidden lg:flex gap-4 xl:gap-8 items-center shrink-0">
          <li>
            <Link href="/services" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
              Services
            </Link>
          </li>
          <li>
            <Link href="/portfolio" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
              Portfolio
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
              About
            </Link>
          </li>
          <li>
            <Link href="/careers" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
              Careers
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
              Contact
            </Link>
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-2.5 xl:gap-4 shrink-0">
          {user ? (
            <>
              <Link href={`/dashboard/${role || 'client'}`} className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md whitespace-nowrap">
                Dashboard
              </Link>
              <button 
                onClick={handleSignOut} 
                className="text-on-surface-variant hover:text-error transition-colors duration-200 font-label-md text-label-md whitespace-nowrap"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md whitespace-nowrap">
                Sign In
              </Link>
              <Link 
                href="/request-project" 
                className="inline-flex items-center justify-center bg-primary-container text-white px-6 py-2.5 rounded font-label-md text-label-md font-medium hover:bg-opacity-90 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.2)] whitespace-nowrap"
              >
                Request a Project
              </Link>
            </>
          )}
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="lg:hidden text-on-surface p-2 focus:outline-none"
        >
          <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-b border-outline-variant/20 px-margin-mobile py-4 space-y-4">
          <ul className="space-y-3">
            <li>
              <Link 
                href="/services" 
                onClick={() => setIsMenuOpen(false)} 
                className="block text-on-surface-variant hover:text-primary py-2 border-b border-outline-variant/10"
              >
                Services
              </Link>
            </li>
            <li>
              <Link 
                href="/portfolio" 
                onClick={() => setIsMenuOpen(false)} 
                className="block text-on-surface-variant hover:text-primary py-2 border-b border-outline-variant/10"
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link 
                href="/pricing" 
                onClick={() => setIsMenuOpen(false)} 
                className="block text-on-surface-variant hover:text-primary py-2 border-b border-outline-variant/10"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                onClick={() => setIsMenuOpen(false)} 
                className="block text-on-surface-variant hover:text-primary py-2 border-b border-outline-variant/10"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/careers" 
                onClick={() => setIsMenuOpen(false)} 
                className="block text-on-surface-variant hover:text-primary py-2 border-b border-outline-variant/10"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                onClick={() => setIsMenuOpen(false)} 
                className="block text-on-surface-variant hover:text-primary py-2 border-b border-outline-variant/10"
              >
                Contact
              </Link>
            </li>
          </ul>
          <div className="flex flex-col gap-3 pt-2">
            {user ? (
              <>
                <Link 
                  href={`/dashboard/${role || 'client'}`}
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-center text-on-surface-variant hover:text-primary py-2 font-medium"
                >
                  Go to Dashboard
                </Link>
                <button 
                  onClick={() => { setIsMenuOpen(false); handleSignOut(); }} 
                  className="text-center text-error py-2 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-center text-on-surface-variant hover:text-primary py-2 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/request-project" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block text-center bg-primary-container text-white py-3 rounded font-medium"
                >
                  Request a Project
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
