import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.kaiketsutech.online'

  const routes = [
    '',
    '/about',
    '/services',
    '/pricing',
    '/portfolio',
    '/contact',
    '/careers',
    '/verify',
    '/showcase',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }))

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch active interns
    const { data: interns } = await supabase
      .from('interns')
      .select('intern_id')
      .is('deleted_at', null)

    if (interns) {
      interns.forEach((intern) => {
        sitemapEntries.push({
          url: `${baseUrl}/intern/${intern.intern_id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })
    }

    // Fetch active certificates
    const { data: certs } = await supabase
      .from('certificates')
      .select('certificate_id')
      .eq('status', 'active')

    if (certs) {
      certs.forEach((cert) => {
        sitemapEntries.push({
          url: `${baseUrl}/verify/${cert.certificate_id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.5,
        })
      })
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err)
  }

  return sitemapEntries
}

