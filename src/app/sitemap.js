import { createClient } from '@supabase/supabase-js';

const BASE = 'https://www.thecostumeloop.co.nz';

// Re-export ISR so the sitemap refreshes daily rather than being fully static.
export const revalidate = 86400;

const staticRoutes = [
  { path: '/',            changeFrequency: 'daily',   priority: 1.0 },
  { path: '/browse',      changeFrequency: 'hourly',  priority: 0.9 },
  { path: '/list',        changeFrequency: 'monthly', priority: 0.7 },
  { path: '/for-studios', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/about',       changeFrequency: 'monthly', priority: 0.5 },
  { path: '/faq',         changeFrequency: 'monthly', priority: 0.5 },
  { path: '/login',       changeFrequency: 'yearly',  priority: 0.3 },
  { path: '/privacy',     changeFrequency: 'yearly',  priority: 0.2 },
  { path: '/terms',       changeFrequency: 'yearly',  priority: 0.2 },
];

export default async function sitemap() {
  const now = new Date();
  const entries = staticRoutes.map(r => ({
    url: BASE + r.path,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Best-effort fetch of active listings — don't let a DB hiccup break the sitemap.
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const supabase = createClient(url, key);
      const { data } = await supabase
        .from('listings')
        .select('id, updated_at, created_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5000);

      if (Array.isArray(data)) {
        for (const l of data) {
          entries.push({
            url: `${BASE}/listings/${l.id}`,
            lastModified: new Date(l.updated_at || l.created_at || now),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }
  } catch (err) {
    console.error('sitemap: failed to fetch listings', err);
  }

  return entries;
}
