const DEFAULT_STORY_EVENT_URL =
  'https://airtime-cloud-isaiahduprees-projects.vercel.app/api/story-page-view'

const STORAGE_PREFIX = 'dupreeops:story-attribution'
const MAX_ATTRIBUTION_VALUE_LENGTH = 200

interface StoryAttribution {
  slug: string
  storyId: string
  creativeId: string
  landingPath: string
}

interface StoryEventResponse {
  recorded?: boolean
  duplicate?: boolean
}

const memoryStorage = new Map<string, string>()
const inFlightRequests = new Map<string, Promise<boolean>>()

function requiredAttributionValue(value: string | null): string | null {
  if (value === null) return null

  const normalized = value.trim()
  if (
    normalized.length === 0 ||
    normalized.length > MAX_ATTRIBUTION_VALUE_LENGTH
  ) {
    return null
  }

  return normalized
}

export function parseStoryAttribution(
  path: string,
  origin = typeof window === 'undefined' ? 'https://www.dupreeops.com' : window.location.origin
): StoryAttribution | null {
  let url: URL

  try {
    url = new URL(path, origin)
    if (url.origin !== new URL(origin).origin) return null
  } catch {
    return null
  }

  const slug = requiredAttributionValue(url.searchParams.get('story_redirect'))
  const storyId = requiredAttributionValue(url.searchParams.get('utm_content'))
  const creativeId = requiredAttributionValue(url.searchParams.get('story_creative'))

  if (!slug || !storyId || !creativeId) return null

  return {
    slug,
    storyId,
    creativeId,
    // Deliberately exclude the query string, hash, and referrer. The Story IDs
    // above are the only campaign context the measurement endpoint receives.
    landingPath: url.pathname,
  }
}

function attributionStorageKey(attribution: StoryAttribution): string {
  return [
    STORAGE_PREFIX,
    encodeURIComponent(attribution.slug),
    encodeURIComponent(attribution.storyId),
    encodeURIComponent(attribution.creativeId),
  ].join(':')
}

function readSessionValue(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key) ?? memoryStorage.get(key) ?? null
  } catch {
    return memoryStorage.get(key) ?? null
  }
}

function writeSessionValue(key: string, value: string): void {
  memoryStorage.set(key, value)

  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // The in-memory value still prevents duplicate requests in browsers that
    // disable sessionStorage for privacy or quota reasons.
  }
}

async function postStoryPageView(
  attribution: StoryAttribution,
  visitId: string
): Promise<boolean> {
  const endpoint =
    process.env.NEXT_PUBLIC_AIRTIME_STORY_EVENT_URL || DEFAULT_STORY_EVENT_URL

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      keepalive: true,
      body: JSON.stringify({
        slug: attribution.slug,
        story_id: attribution.storyId,
        creative_id: attribution.creativeId,
        visit_id: visitId,
        landing_path: attribution.landingPath,
      }),
    })

    if (!response.ok) return false

    const result = (await response.json()) as StoryEventResponse
    return result.recorded === true || result.duplicate === true
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Story Attribution Error]', error)
    }
    return false
  }
}

/**
 * Records the landing page reached through a measured Airtime Story redirect.
 * A confirmed event is sent once per browser tab/session and attribution tuple.
 * Failed or unconfirmed requests retain the same visit ID and may be retried.
 */
export function trackStoryPageView(path: string): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)

  const attribution = parseStoryAttribution(path)
  if (!attribution) return Promise.resolve(false)

  const baseKey = attributionStorageKey(attribution)
  const sentKey = `${baseKey}:sent`
  const visitKey = `${baseKey}:visit`

  if (readSessionValue(sentKey) === 'true') return Promise.resolve(true)

  const existingRequest = inFlightRequests.get(baseKey)
  if (existingRequest) return existingRequest

  let visitId = readSessionValue(visitKey)
  if (!visitId) {
    visitId = crypto.randomUUID()
    writeSessionValue(visitKey, visitId)
  }

  const request = postStoryPageView(attribution, visitId)
    .then((confirmed) => {
      if (confirmed) writeSessionValue(sentKey, 'true')
      return confirmed
    })
    .finally(() => {
      inFlightRequests.delete(baseKey)
    })

  inFlightRequests.set(baseKey, request)
  return request
}
