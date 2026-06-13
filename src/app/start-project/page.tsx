'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StartProjectRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/request-project')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-mono-sm text-xs text-on-surface-variant">
      Redirecting to secure project request wizard...
    </div>
  )
}
