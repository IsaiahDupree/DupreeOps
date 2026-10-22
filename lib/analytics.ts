import {
  redactStoryMeasurementToken,
  trackStoryPageView,
} from './story-attribution'
import { redactContentProof, trackContentLanding } from './content-attribution'

type EventName =
  | 'page_view'
  | 'theme_toggle'
  | 'link_click'
  | 'email_click'
  | 'back_to_home'
  | 'product_click'
  | 'legal_page_view'
  | 'contact_form_submitted'

type EventData = Record<string, string | number | boolean | undefined>
type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: Gtag
    dataLayer?: unknown[]
  }
}

const CONSENT_KEY = 'dupreeops.analytics-consent.v1'
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
let scriptLoading = false
let scriptLoaded = false
let gaConfigured = false

function consentGranted() {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(CONSENT_KEY) === 'granted'
  } catch {
    return false
  }
}

function cleanPath(value: string) {
  try {
    const parsed = new URL(value, window.location.origin)
    if (parsed.origin !== window.location.origin) return '/'
    return parsed.pathname || '/'
  } catch {
    return '/'
  }
}

function send(name: EventName, data: EventData = {}) {
  if (!measurementId || !consentGranted() || typeof window === 'undefined' || !window.gtag || !gaConfigured) return
  window.gtag('event', name, data)
}

export function hasAnalyticsConsent() {
  return consentGranted()
}

export function hasAnalyticsConsentChoice() {
  if (typeof window === 'undefined') return false
  try {
    const choice = window.localStorage.getItem(CONSENT_KEY)
    return choice === 'granted' || choice === 'denied'
  } catch {
    return false
  }
}

export function analyticsMeasurementConfigured() {
  return Boolean(measurementId)
}

export function setAnalyticsConsent(granted: boolean) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied')
  } catch {
    // If the browser blocks storage, fail closed and do not enable analytics.
    return
  }
  window.dispatchEvent(new CustomEvent('dupreeops:analytics-consent'))
  if (!granted && window.gtag) {
    window.gtag('consent', 'update', { analytics_storage: 'denied' })
  }
}

export function requestAnalyticsPreferences() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dupreeops:analytics-preferences'))
  }
}

export function initializeAnalyticsTag() {
  if (!measurementId || !consentGranted() || typeof window === 'undefined') return

  if (window.gtag) {
    if (!scriptLoaded) return
    window.gtag('consent', 'update', { analytics_storage: 'granted' })
    if (!gaConfigured) {
      window.gtag('js', new Date())
      window.gtag('config', measurementId, { send_page_view: false })
      gaConfigured = true
    }
    sendPageView(window.location.pathname)
    return
  }

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments)
  }
  window.gtag('consent', 'default', { analytics_storage: 'denied' })

  if (scriptLoading) return
  scriptLoading = true
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  script.onload = () => {
    scriptLoading = false
    scriptLoaded = true
    if (!consentGranted() || !window.gtag) return
    window.gtag('consent', 'update', { analytics_storage: 'granted' })
    window.gtag('js', new Date())
    window.gtag('config', measurementId, { send_page_view: false })
    gaConfigured = true
    sendPageView(window.location.pathname)
  }
  script.onerror = () => {
    scriptLoading = false
    script.remove()
    window.gtag = undefined
    window.dataLayer = []
  }
  document.head.appendChild(script)
}

function sendPageView(path: string) {
  send('page_view', { page_path: cleanPath(path), page_title: document.title })
}

// Existing Story and HookLite attribution remains a separate first-party flow.
// GA4 receives only a clean path after optional analytics consent.
export function trackPageView(path: string) {
  void trackContentLanding(path)
  void trackStoryPageView(path)
  sendPageView(redactContentProof(redactStoryMeasurementToken(path)))
}

export function trackEvent(eventName: EventName, data?: EventData) {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName)
  }

  // Send only explicitly permitted, non-PII event fields to GA4.
  switch (eventName) {
    case 'theme_toggle':
      send(eventName, { theme: data?.theme === 'dark' ? 'dark' : 'light' })
      break
    case 'link_click':
      send(eventName, {
        link_url: cleanLink(data?.url),
        link_text: safeLabel(data?.link_text),
      })
      break
    case 'email_click':
      send(eventName, { contact_method: 'email' })
      break
    case 'product_click':
      send(eventName, {
        product_name: safeLabel(data?.product_name),
        link_url: cleanLink(data?.url),
      })
      break
    case 'contact_form_submitted':
      send(eventName, { form_type: 'contact', page_path: cleanPath(window.location.pathname) })
      break
    case 'back_to_home':
    case 'legal_page_view':
      send(eventName)
      break
    case 'page_view':
      sendPageView(window.location.pathname)
      break
  }
}

function safeLabel(value: unknown) {
  if (typeof value !== 'string' || value.includes('@')) return undefined
  return value.slice(0, 100)
}

function cleanLink(value: unknown) {
  if (typeof value !== 'string') return undefined
  if (/^mailto:/i.test(value)) return 'mailto:[redacted]'
  try {
    const parsed = new URL(value, window.location.origin)
    return `${parsed.origin}${parsed.pathname}`
  } catch {
    return undefined
  }
}

export function trackLinkClick(url: string, text?: string) {
  trackEvent('link_click', { url, link_text: text })
}

export function trackEmailClick(_email: string) {
  trackEvent('email_click')
}

export function trackThemeToggle(theme: 'light' | 'dark') {
  trackEvent('theme_toggle', { theme })
}

export function trackProductClick(productName: string, url: string) {
  trackEvent('product_click', { product_name: productName, url })
}
