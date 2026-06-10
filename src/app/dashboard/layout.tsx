import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/shared/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Fetch profile details
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role || 'client'
  const userName = profile?.full_name || user.email?.split('@')[0] || 'Kaiketsu User'
  const userEmail = profile?.email || user.email || ''

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0B0B] text-on-surface antialiased">
      {/* Dynamic Role-Based Sidebar */}
      <Sidebar userRole={userRole} userName={userName} userEmail={userEmail} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden relative">
        {children}
      </div>
    </div>
  )
}
