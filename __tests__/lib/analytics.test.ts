jest.mock('@/lib/story-attribution', () => ({
  redactStoryMeasurementToken: (value: string) => value,
  trackStoryPageView: jest.fn(),
}))
jest.mock('@/lib/content-attribution', () => ({
  redactContentProof: (value: string) => value,
  trackContentLanding: jest.fn(),
}))

describe('optional GA4 analytics', () => {
  const originalMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  beforeEach(() => {
    jest.resetModules()
    localStorage.clear()
    delete window.gtag
    delete window.dataLayer
    document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').forEach((script) => script.remove())
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST12345'
  })

  afterAll(() => {
    if (originalMeasurementId === undefined) delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    else process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalMeasurementId
  })

  it('does not send before consent and never includes email recipients or form values', async () => {
    const analytics = await import('@/lib/analytics')

    analytics.trackEmailClick('person@example.com')
    analytics.trackEvent('contact_form_submitted', {
      name: 'Person Name',
      email: 'person@example.com',
      message: 'Private details',
    })
    expect(document.querySelector('script[src*="googletagmanager.com/gtag/js"]')).toBeNull()

    analytics.setAnalyticsConsent(true)
    analytics.initializeAnalyticsTag()
    const tag = document.querySelector('script[src*="googletagmanager.com/gtag/js"]')
    expect(tag).not.toBeNull()
    tag?.dispatchEvent(new Event('load'))
    window.dataLayer = []

    analytics.trackEmailClick('person@example.com')
    analytics.trackEvent('contact_form_submitted', {
      name: 'Person Name',
      email: 'person@example.com',
      message: 'Private details',
    })

    const calls = (window.dataLayer || []).map((call) => Array.from(call as IArguments))
    expect(calls).toContainEqual(['event', 'email_click', { contact_method: 'email' }])
    expect(calls).toContainEqual(['event', 'contact_form_submitted', {
      form_type: 'contact',
      page_path: '/',
    }])
    expect(JSON.stringify(calls)).not.toContain('person@example.com')
    expect(JSON.stringify(calls)).not.toContain('Private details')
  })

  it('remembers a rejection so the consent prompt is not repeated on each visit', async () => {
    const analytics = await import('@/lib/analytics')
    expect(analytics.hasAnalyticsConsentChoice()).toBe(false)

    analytics.setAnalyticsConsent(false)

    expect(analytics.hasAnalyticsConsent()).toBe(false)
    expect(analytics.hasAnalyticsConsentChoice()).toBe(true)
  })

  it('strips query strings and fragments from page views', async () => {
    const analytics = await import('@/lib/analytics')
    analytics.setAnalyticsConsent(true)
    analytics.initializeAnalyticsTag()
    document.querySelector('script[src*="googletagmanager.com/gtag/js"]')?.dispatchEvent(new Event('load'))
    window.dataLayer = []

    analytics.trackPageView('/contact?email=person%40example.com#form')

    const calls = (window.dataLayer || []).map((call) => Array.from(call as IArguments))
    expect(calls).toContainEqual(['event', 'page_view', {
      page_path: '/contact',
      page_title: document.title,
    }])
    expect(JSON.stringify(calls)).not.toContain('person@example.com')
  })

  it('waits for the tag to become ready before sending the initial route once', async () => {
    const analytics = await import('@/lib/analytics')
    analytics.setAnalyticsConsent(true)
    analytics.initializeAnalyticsTag()
    analytics.trackPageView('/contact?campaign=spring')
    analytics.trackPageView('/services?campaign=spring')

    const tag = document.querySelector('script[src*="googletagmanager.com/gtag/js"]')
    tag?.dispatchEvent(new Event('load'))
    const calls = (window.dataLayer || []).map((call) => Array.from(call as IArguments))
    const pageViews = calls.filter((call) => call[0] === 'event' && call[1] === 'page_view')

    expect(pageViews).toHaveLength(1)
    expect(pageViews[0]).toEqual(['event', 'page_view', {
      page_path: window.location.pathname,
      page_title: document.title,
    }])
  })
})
