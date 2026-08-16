export const STICKERS = [
  {
    slug: 'stickercrea',
    label: 'Crea',
    path: '/stickers/stickercrea',
    alt: 'Archivo #1 — Todo comienza con una idea',
  },
  {
    slug: 'stickerzona',
    label: 'Zona',
    path: '/stickers/stickerzona',
    alt: 'Archivo #2 — Entraste en la zona',
  },
  {
    slug: 'stickeridea',
    label: 'Idea',
    path: '/stickers/stickeridea',
    alt: 'Archivo #3 — Idea detectada',
  },
  {
    slug: 'stickerchat',
    label: 'Chat',
    path: '/stickers/stickerchat',
    alt: 'Archivo #4 — Conexión establecida',
  },
  {
    slug: 'stickerpieza',
    label: 'Pieza',
    path: '/stickers/stickerpieza',
    alt: 'Archivo #5 — Problema detectado',
  },
  {
    slug: 'stickerdibujo',
    label: 'Dibujo',
    path: '/stickers/stickerdibujo',
    alt: 'Archivo #6 — Listos para crear',
  },
];

export const getStickerBySlug = (slug) =>
  STICKERS.find((sticker) => sticker.slug === slug);
