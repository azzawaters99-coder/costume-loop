const BASE = 'https://www.thecostumeloop.co.nz';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/inbox', '/profile', '/my-listings', '/reset-password'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
