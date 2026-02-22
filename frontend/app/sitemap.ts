import { MetadataRoute } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onderemlakmarmaris.com';
  const locales = ['en', 'tr'];

  const routes = [
    { path: '', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/properties', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  // Fetch all published properties and add individual URLs
  try {
    const res = await fetch(`${API_BASE_URL}/properties?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const properties: { _id: string; updatedAt?: string }[] = json.data || [];
      for (const property of properties) {
        for (const locale of locales) {
          entries.push({
            url: `${baseUrl}/${locale}/properties/${property._id}`,
            lastModified: property.updatedAt ? new Date(property.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }
  } catch {
    // If the API is unreachable, still return static routes
  }

  return entries;
}
