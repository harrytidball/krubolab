import { STICKERS } from '../src/data/stickers.js';

const SITE_URL = 'https://krubolab.com';

const STATIC_PATHS = [
  '/',
  '/corte-laser',
  '/impresion-3d',
  '/nuestros-proyectos',
  '/nuestros-materiales',
  '/reparaciones',
  '/diseños-personalizados',
  '/diseño-2d',
  '/diseño-3d',
  '/stickers',
  ...STICKERS.map((s: { path: string }) => s.path),
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const encodePath = (path: string) =>
  path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

type ProductRow = { id: string; updated_at?: string };

async function fetchProducts(env: { SUPABASE_URL?: string; DB_PASSWORD?: string }): Promise<ProductRow[]> {
  if (!env.SUPABASE_URL || !env.DB_PASSWORD) return [];
  try {
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/products?select=id,updated_at&order=created_at.desc`,
      { headers: { apikey: env.DB_PASSWORD, Authorization: `Bearer ${env.DB_PASSWORD}` } }
    );
    if (!res.ok) return [];
    return (await res.json()) as ProductRow[];
  } catch {
    return []; // never break the sitemap if the database is unreachable
  }
}

// Dynamic sitemap: static pages + one entry per product in Supabase.
export const onRequestGet = async (context: {
  env: { SUPABASE_URL?: string; DB_PASSWORD?: string };
}) => {
  const products = await fetchProducts(context.env);

  const entries = [
    ...STATIC_PATHS.map((path) => `  <url><loc>${escapeXml(SITE_URL + encodePath(path))}</loc></url>`),
    ...products
      .filter((p) => p && p.id)
      .map((p) => {
        const loc = escapeXml(`${SITE_URL}/producto/${encodeURIComponent(p.id)}`);
        const lastmod = p.updated_at ? `<lastmod>${escapeXml(p.updated_at.slice(0, 10))}</lastmod>` : '';
        return `  <url><loc>${loc}</loc>${lastmod}</url>`;
      }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
