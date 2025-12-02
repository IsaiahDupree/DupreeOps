// Simple analytics tracking utility
// You can replace this with Google Analytics, Plausible, or any other analytics service

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

  // You can integrate with analytics services here:
  // - Google Analytics: gtag('event', eventName, data)
  // - Plausible: plausible(eventName, { props: data })
  // - PostHog: posthog.capture(eventName, data)
  // - Custom endpoint: fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ eventName, data }) })

  // Example: Send to a custom endpoint
  try {
    // Uncomment and configure your analytics endpoint:
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     event: eventName,
    //     data: data || {},
    //     timestamp: new Date().toISOString(),
    //     url: window.location.href,
    //     path: window.location.pathname,
    //   }),
    // })
  } catch (error) {
    // Silently fail in production
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics Error]', error)
    }
  }
}

// Track page views
export function trackPageView(path: string) {
  trackEvent('page_view', {
    path,
    title: document.title,
  })
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

