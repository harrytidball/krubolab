export const SITE_URL = 'https://krubolab.com';
export const SITE_NAME = 'Krubo';
export const DEFAULT_IMAGE = `${SITE_URL}/images/krubo-logo.png`;

const DEFAULT_DESCRIPTION =
  'Krubo, laboratorio de diseño: corte y grabado láser, impresión 3D, diseño 2D y 3D, reparaciones y productos personalizados.';

// Meta for each public route. `noindex` pages are also blocked in robots.txt.
export const PAGE_META = {
  '/': {
    title: 'Krubo | Laboratorio de diseño, corte láser e impresión 3D',
    description: DEFAULT_DESCRIPTION,
  },
  '/corte-laser': {
    title: 'Corte y grabado láser | Krubo',
    description:
      'Servicio de corte y grabado láser en acrílico, madera y más. Piezas a medida para tus proyectos y productos personalizados.',
  },
  '/impresion-3d': {
    title: 'Impresión 3D | Krubo',
    description:
      'Impresión 3D de prototipos, piezas funcionales y objetos personalizados. Cuéntanos tu idea y la hacemos realidad.',
  },
  '/nuestros-proyectos': {
    title: 'Nuestros proyectos | Krubo',
    description:
      'Conoce los proyectos de diseño, corte láser e impresión 3D que hemos realizado en Krubo.',
  },
  '/nuestros-materiales': {
    title: 'Nuestra filosofía y materiales | Krubo',
    description:
      'Los materiales con los que trabajamos en Krubo y la filosofía detrás de cada pieza que diseñamos y fabricamos.',
  },
  '/reparaciones': {
    title: 'Reparaciones | Krubo',
    description:
      'Reparamos y restauramos piezas y objetos. Cuéntanos qué necesitas arreglar y te ayudamos.',
  },
  '/diseños-personalizados': {
    title: 'Diseños personalizados | Krubo',
    description:
      'Diseños y productos personalizados hechos a medida: regalos, objetos y piezas únicas diseñadas contigo.',
  },
  '/diseño-2d': {
    title: 'Diseño 2D y planos técnicos | Krubo',
    description:
      'Te ayudamos con diseño 2D y planos técnicos listos para corte láser y fabricación.',
  },
  '/diseño-3d': {
    title: 'Diseño y modelado 3D | Krubo',
    description:
      'Diseñamos y modelamos tus ideas en 3D, listas para impresión 3D y fabricación.',
  },
  '/stickers': {
    title: 'Stickers | Krubo',
    description: 'Colección de stickers de Krubo. Descubre y elige tus favoritos.',
  },
  // Private / transactional pages: keep out of search results
  '/carrito': { title: 'Carrito | Krubo', noindex: true },
  '/favoritos': { title: 'Favoritos | Krubo', noindex: true },
  '/confirmacion': { title: 'Confirmación de pedido | Krubo', noindex: true },
  '/administrador': { title: 'Administrador | Krubo', noindex: true },
  '/panel': { title: 'Panel | Krubo', noindex: true },
  '/404': { title: 'Página no encontrada | Krubo', noindex: true },
};

export const DEFAULT_META = {
  title: 'Krubo - Laboratorio de diseño',
  description: DEFAULT_DESCRIPTION,
};
