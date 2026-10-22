import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  analyticsMeasurementConfigured,
  hasAnalyticsConsent,
  hasAnalyticsConsentChoice,
  initializeAnalyticsTag,
  setAnalyticsConsent,
} from '@/lib/analytics'

export default function AnalyticsConsentManager() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!analyticsMeasurementConfigured()) return

    setVisible(!hasAnalyticsConsentChoice())
    if (hasAnalyticsConsent()) initializeAnalyticsTag()

    const onConsentChange = () => {
      setVisible(false)
      if (hasAnalyticsConsent()) initializeAnalyticsTag()
    }
    const onPreferences = () => setVisible(true)
    window.addEventListener('dupreeops:analytics-consent', onConsentChange)
    window.addEventListener('dupreeops:analytics-preferences', onPreferences)
    return () => {
      window.removeEventListener('dupreeops:analytics-consent', onConsentChange)
      window.removeEventListener('dupreeops:analytics-preferences', onPreferences)
    }
  }, [])

  if (!visible) return null

  return (
    <aside
      aria-label="Optional analytics preferences"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-xl border border-slate-300 bg-white p-4 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:inset-x-6 sm:bottom-6 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6">
          Optional Google Analytics helps us understand which pages and contact paths are useful.
          It stays off unless you allow it. Contact form details are never sent to analytics.{' '}
          <Link className="underline" href="/privacy">Privacy policy</Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => { setAnalyticsConsent(false); setVisible(false) }}
            className="min-h-11 rounded-lg border border-slate-400 px-4 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => { setAnalyticsConsent(true); initializeAnalyticsTag(); setVisible(false) }}
            className="min-h-11 rounded-lg bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Allow analytics
          </button>
        </div>
      </div>
    </aside>
  )
}
