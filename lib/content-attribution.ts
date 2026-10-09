const ENDPOINT = 'https://hooklite.vercel.app/api/attribution/content-landing'
const CONTEXT_KEYS = [
  'cie_content_id', 'cie_iteration_id', 'cie_campaign_id', 'cie_experiment_id',
  'cie_variant_id', 'cie_offer_id', 'cie_product_id', 'cie_platform',
  'cie_account_id', 'cie_click_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
] as const
const REQUIRED = ['cie_content_id', 'cie_iteration_id', 'cie_campaign_id', 'cie_platform', 'cie_account_id', 'cie_click_id']
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/
const confirmed = new Set<string>()
const inFlight = new Map<string, Promise<boolean>>()

export function parseContentAttribution(path: string, origin: string) {
  try {
    const url = new URL(path, origin)
    if (url.origin !== origin || url.searchParams.getAll('cie_proof').length !== 1) return null
    const proof = url.searchParams.get('cie_proof') || ''
    if (proof.length > 2048 || !/^[A-Za-z0-9_-]+\.[a-f0-9]{64}$/.test(proof)) return null
    const context: Record<string, string> = {}
    for (const key of CONTEXT_KEYS) {
      if (!url.searchParams.has(key)) continue
      const value = url.searchParams.get(key) || ''
      if (url.searchParams.getAll(key).length !== 1 || !value || value.length > 512
        || (key.startsWith('cie_') && !ID.test(value))) return null
      context[key] = value
    }
    if (REQUIRED.some(key => !context[key]) || !UUID.test(context.cie_click_id)) return null
    return { proof, context, landing_path: url.pathname }
  } catch { return null }
}

export function redactContentProof(path: string) {
  return path.replace(/([?&]cie_proof=)[^&#]*/gi, '$1[redacted]')
}

function scrubProof() {
  try {
    const url = new URL(window.location.href)
    if (!url.searchParams.has('cie_proof')) return
    url.searchParams.delete('cie_proof')
    window.history.replaceState(window.history.state, '', url.toString())
  } catch { /* Browser history can be unavailable in a sandboxed context. */ }
}

/** Signed capability stays in memory; confirmed retries share the issuer's click key. */
export function trackContentLanding(path: string): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  // The Next router can still be hydrating. Capture the actual document's
  // capability before scrubbing it, even if its initial asPath lacks the query.
  const body = parseContentAttribution(window.location.href || path, window.location.origin)
  // Remove even malformed capabilities before analytics or outbound navigation.
  scrubProof()
  if (!body) return Promise.resolve(false)
  const click = body.context.cie_click_id
  const storageKey = 'dupreeops:content-landing:' + click
  try {
    if (window.sessionStorage.getItem(storageKey) === 'confirmed') confirmed.add(click)
  } catch { /* In-memory confirmation also supports disabled storage. */ }
  if (confirmed.has(click)) return Promise.resolve(true)
  const pending = inFlight.get(click)
  if (pending) return pending
  const send = async () => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true,
          body: JSON.stringify(body), signal: AbortSignal.timeout(8000),
        })
        const receipt = await response.json()
        if (response.ok && receipt.recorded === true && receipt.verified === true
          && receipt.issuer === 'hooklite' && receipt.proof_version === 1
          && receipt.click_id === click && UUID.test(receipt.event_id || '')
          && UUID.test(receipt.redirect_link_id || '')) {
          confirmed.add(click)
          try { window.sessionStorage.setItem(storageKey, 'confirmed') } catch { /* optional storage */ }
          return true
        }
        if (response.status < 500 && response.status !== 429) return false
      } catch { /* Retry the same click after a temporary network failure. */ }
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 500))
    }
    return false
  }
  const promise = send().finally(() => inFlight.delete(click))
  inFlight.set(click, promise)
  return promise
}
