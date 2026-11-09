import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getStickerBySlug } from '../data/stickers';
import { PAGE_META, DEFAULT_META } from '../data/seo';
import { applyMeta } from '../utils/seoMeta';

function resolveMeta(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  if (PAGE_META[path]) return PAGE_META[path];

  if (path.startsWith('/stickers/')) {
    const sticker = getStickerBySlug(path.split('/')[2]);
    if (sticker) {
      return {
        title: `${sticker.label} | Stickers | Krubo`,
        description: `${sticker.alt}. Sticker de la colección Krubo.`,
      };
    }
  }

  // Duplicated / transactional routes and anything unknown
  if (path.startsWith('/sitio')) return { ...DEFAULT_META, noindex: true };
  if (path.startsWith('/producto/')) return null; // ProductDetail sets its own
  return { ...DEFAULT_META, noindex: true };
}

// Keeps <title>, description, canonical, robots and Open Graph tags in sync with the route.
export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = resolveMeta(pathname);
    if (!meta) return; // e.g. product pages call applyMeta themselves once data loads
    applyMeta(meta, pathname);
  }, [pathname]);

  return null;
}
