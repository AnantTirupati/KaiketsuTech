import { MetadataRoute } from 'next'

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
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }))
}
