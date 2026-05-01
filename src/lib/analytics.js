// Tiny helper to forward custom events to GA4 (configured in src/app/layout.js).
// Safe to call from anywhere — no-op if gtag hasn't loaded yet (e.g. SSR or ad-blocker).
export function track(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}
