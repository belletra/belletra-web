type AnalyticsParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

export function trackCheckout(plan: 'month' | 'year' | 'lifetime', location: 'paywall' | 'account') {
  const value = plan === 'month' ? 5.99 : plan === 'year' ? 39.99 : 129
  trackEvent('begin_checkout', {
    currency: 'USD',
    value,
    plan,
    checkout_location: location,
  })
}
