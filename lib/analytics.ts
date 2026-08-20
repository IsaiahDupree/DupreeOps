import { trackStoryPageView } from './story-attribution'

// Lightweight UI event tracking. Story landing-page attribution is delivered
// through the real Airtime endpoint in trackPageView below.

type EventName = 
  | 'page_view'
  | 'theme_toggle'
  | 'link_click'
  | 'email_click'
  | 'back_to_home'
  | 'product_click'
  | 'legal_page_view'

interface EventData {
  [key: string]: string | number | boolean | undefined
}

// Track events
export function trackEvent(eventName: EventName, data?: EventData) {
  // Only track in browser
  if (typeof window === 'undefined') return

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, data || '')
  }

}

// Track page views
export function trackPageView(path: string) {
  trackEvent('page_view', {
    path,
    title: document.title,
  })

  void trackStoryPageView(path)
}

// Track link clicks
export function trackLinkClick(url: string, text?: string) {
  trackEvent('link_click', {
    url,
    link_text: text,
  })
}

// Track email clicks
export function trackEmailClick(email: string) {
  trackEvent('email_click', {
    email,
  })
}

// Track theme toggles
export function trackThemeToggle(theme: 'light' | 'dark') {
  trackEvent('theme_toggle', {
    theme,
  })
}

// Track product clicks
export function trackProductClick(productName: string, url: string) {
  trackEvent('product_click', {
    product_name: productName,
    url,
  })
}
