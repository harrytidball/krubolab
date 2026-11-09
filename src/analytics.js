// Google Tag Manager. Enabled only when VITE_GTM_ID is set (e.g. GTM-XXXXXXX).
// GA4 and any other tags are configured inside the GTM container.
const GTM_ID = import.meta.env.VITE_GTM_ID;

export function initAnalytics() {
  if (!GTM_ID || typeof window === 'undefined') return;
  if (document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${GTM_ID}"]`)) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}

// Fired on every route change; GTM listens for the "virtual_page_view" event.
export function trackPageView(path) {
  if (!GTM_ID || typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'virtual_page_view',
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
