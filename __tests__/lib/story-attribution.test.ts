/** @jest-environment node */

import {
  createServer,
  type IncomingHttpHeaders,
  type IncomingMessage,
  type Server,
} from 'node:http'
import type { AddressInfo } from 'node:net'

type BrowserWindow = Window & typeof globalThis

interface ReceivedRequest {
  body: Record<string, unknown>
  headers: IncomingHttpHeaders
}

const receivedRequests: ReceivedRequest[] = []
const MEASUREMENT_TOKEN_A = 'a'.repeat(64)
const MEASUREMENT_TOKEN_B = 'b'.repeat(64)
const MEASUREMENT_TOKEN_C = 'c'.repeat(64)
const MEASUREMENT_TOKEN_D = 'd'.repeat(64)
let responseBodies: Array<Record<string, unknown>> = []
let responseStatuses: number[] = []
let server: Server
let endpoint: string

class SessionStorage implements Storage {
  private values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

function installBrowserSession() {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      location: { origin: 'https://www.dupreeops.com' },
      sessionStorage: new SessionStorage(),
    } as unknown as BrowserWindow,
  })

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { title: 'DupreeOps' },
  })
}

async function waitForRequestBody(request: IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of request) chunks.push(Buffer.from(chunk))
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>
}

async function waitForReceivedRequestCount(expected: number) {
  const deadline = Date.now() + 1_000
  while (receivedRequests.length < expected && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 5))
  }
}

beforeAll(async () => {
  server = createServer(async (request, response) => {
    receivedRequests.push({
      body: await waitForRequestBody(request),
      headers: request.headers,
    })

    const status = responseStatuses.shift() ?? 200
    const body = responseBodies.shift() ?? { ok: true, recorded: true, event_id: 'event-1' }
    response.writeHead(status, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(body))
  })

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address() as AddressInfo
  endpoint = `http://127.0.0.1:${address.port}/api/story-page-view`
})

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
})

beforeEach(() => {
  installBrowserSession()
  receivedRequests.length = 0
  responseBodies = []
  responseStatuses = []
  process.env.NEXT_PUBLIC_AIRTIME_STORY_EVENT_URL = endpoint
})

afterEach(() => {
  delete process.env.NEXT_PUBLIC_AIRTIME_STORY_EVENT_URL
})

describe('Story landing-page attribution', () => {
  it('parses only complete attribution and excludes query data from landing_path', async () => {
    const { parseStoryAttribution, redactStoryMeasurementToken } = await import(
      '@/lib/story-attribution'
    )

    expect(
      parseStoryAttribution(
        `/services?story_redirect=ai-audit&utm_content=story-42&story_creative=creative-9&story_measure=${MEASUREMENT_TOKEN_A}&email=private%40example.com#pricing`
      )
    ).toEqual({
      slug: 'ai-audit',
      storyId: 'story-42',
      creativeId: 'creative-9',
      measurementToken: MEASUREMENT_TOKEN_A,
      landingPath: '/services',
    })

    expect(
      parseStoryAttribution('/services?story_redirect=ai-audit&utm_content=story-42')
    ).toBeNull()
    expect(
      parseStoryAttribution(
        `https://example.com/private?story_redirect=ai-audit&utm_content=story-42&story_creative=creative-9&story_measure=${MEASUREMENT_TOKEN_A}`
      )
    ).toBeNull()
    expect(
      parseStoryAttribution(
        `/services?story_redirect=ai-audit&utm_content=story-42&story_creative=creative-9&story_measure=${'A'.repeat(64)}`
      )
    ).toBeNull()
    expect(
      redactStoryMeasurementToken(
        `/services?story_measure=${MEASUREMENT_TOKEN_A}&utm_content=story-42`
      )
    ).toBe('/services?story_measure=[redacted]&utm_content=story-42')
  })

  it('sends one real HTTP request for a complete Story landing and no PII/referrer', async () => {
    const { trackStoryPageView } = await import('@/lib/story-attribution')
    const path =
      `/services?story_redirect=ai-audit&utm_content=story-42&story_creative=creative-9&story_measure=${MEASUREMENT_TOKEN_A}&email=private%40example.com`

    const [firstResult, concurrentResult] = await Promise.all([
      trackStoryPageView(path),
      trackStoryPageView(path),
    ])
    expect(firstResult).toBe(true)
    expect(concurrentResult).toBe(true)
    await expect(trackStoryPageView(path)).resolves.toBe(true)

    expect(receivedRequests).toHaveLength(1)
    expect(receivedRequests[0].body).toEqual({
      slug: 'ai-audit',
      story_id: 'story-42',
      creative_id: 'creative-9',
      measurement_token: MEASUREMENT_TOKEN_A,
      visit_id: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      ),
      landing_path: '/services',
    })
    expect(receivedRequests[0].body).not.toHaveProperty('email')
    expect(receivedRequests[0].body).not.toHaveProperty('referrer')
    expect(receivedRequests[0].headers.cookie).toBeUndefined()
    expect(receivedRequests[0].headers.authorization).toBeUndefined()
    const storageKeys = Array.from(
      { length: window.sessionStorage.length },
      (_, index) => window.sessionStorage.key(index)
    )
    expect(storageKeys.join(':')).not.toContain(MEASUREMENT_TOKEN_A)
  })

  it('does not request the endpoint for an ordinary page view', async () => {
    const { trackStoryPageView } = await import('@/lib/story-attribution')

    await expect(trackStoryPageView('/services?utm_source=instagram')).resolves.toBe(false)
    await expect(
      trackStoryPageView(
        '/services?story_redirect=unsigned&utm_content=story-unsigned&story_creative=creative-unsigned'
      )
    ).resolves.toBe(false)
    expect(receivedRequests).toHaveLength(0)
  })

  it('is invoked by the application page-view tracker', async () => {
    const { trackPageView } = await import('@/lib/analytics')

    trackPageView(
      `/services?story_redirect=analytics-hook&utm_content=story-hook&story_creative=creative-hook&story_measure=${MEASUREMENT_TOKEN_B}`
    )
    await waitForReceivedRequestCount(1)

    expect(receivedRequests).toHaveLength(1)
    expect(receivedRequests[0].body).toMatchObject({
      slug: 'analytics-hook',
      story_id: 'story-hook',
      creative_id: 'creative-hook',
      measurement_token: MEASUREMENT_TOKEN_B,
      landing_path: '/services',
    })
  })

  it('retries an unconfirmed response with the same visit ID and accepts a duplicate', async () => {
    const { trackStoryPageView } = await import('@/lib/story-attribution')
    const path =
      `/contact?story_redirect=ai-audit-retry&utm_content=story-retry&story_creative=creative-retry&story_measure=${MEASUREMENT_TOKEN_C}`
    responseBodies = [{ ok: true }, { ok: true, duplicate: true }]

    await expect(trackStoryPageView(path)).resolves.toBe(false)
    await expect(trackStoryPageView(path)).resolves.toBe(true)
    await expect(trackStoryPageView(path)).resolves.toBe(true)

    expect(receivedRequests).toHaveLength(2)
    expect(receivedRequests[0].body.visit_id).toBe(receivedRequests[1].body.visit_id)
  })

  it('does not mark a non-2xx recorded response as sent', async () => {
    const { trackStoryPageView } = await import('@/lib/story-attribution')
    const path =
      `/?story_redirect=ai-audit-status&utm_content=story-status&story_creative=creative-status&story_measure=${MEASUREMENT_TOKEN_D}`
    responseStatuses = [503]
    responseBodies = [{ recorded: true }, { recorded: true }]

    await expect(trackStoryPageView(path)).resolves.toBe(false)
    await expect(trackStoryPageView(path)).resolves.toBe(true)

    expect(receivedRequests).toHaveLength(2)
  })
})
