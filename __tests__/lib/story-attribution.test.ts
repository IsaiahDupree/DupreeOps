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
    const { parseStoryAttribution } = await import('@/lib/story-attribution')

    expect(
      parseStoryAttribution(
        '/services?story_redirect=ai-audit&utm_content=story-42&story_creative=creative-9&email=private%40example.com#pricing'
      )
    ).toEqual({
      slug: 'ai-audit',
      storyId: 'story-42',
      creativeId: 'creative-9',
      landingPath: '/services',
    })

    expect(
      parseStoryAttribution('/services?story_redirect=ai-audit&utm_content=story-42')
    ).toBeNull()
    expect(
      parseStoryAttribution(
        'https://example.com/private?story_redirect=ai-audit&utm_content=story-42&story_creative=creative-9'
      )
    ).toBeNull()
  })

  it('sends one real HTTP request for a complete Story landing and no PII/referrer', async () => {
    const { trackStoryPageView } = await import('@/lib/story-attribution')
    const path =
      '/services?story_redirect=ai-audit&utm_content=story-42&story_creative=creative-9&email=private%40example.com'

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
      visit_id: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      ),
      landing_path: '/services',
    })
    expect(receivedRequests[0].body).not.toHaveProperty('email')
    expect(receivedRequests[0].body).not.toHaveProperty('referrer')
    expect(receivedRequests[0].headers.cookie).toBeUndefined()
    expect(receivedRequests[0].headers.authorization).toBeUndefined()
  })

  it('does not request the endpoint for an ordinary page view', async () => {
    const { trackStoryPageView } = await import('@/lib/story-attribution')

    await expect(trackStoryPageView('/services?utm_source=instagram')).resolves.toBe(false)
    expect(receivedRequests).toHaveLength(0)
  })

  it('is invoked by the application page-view tracker', async () => {
    const { trackPageView } = await import('@/lib/analytics')

    trackPageView(
      '/services?story_redirect=analytics-hook&utm_content=story-hook&story_creative=creative-hook'
    )
    await waitForReceivedRequestCount(1)

    expect(receivedRequests).toHaveLength(1)
    expect(receivedRequests[0].body).toMatchObject({
      slug: 'analytics-hook',
      story_id: 'story-hook',
      creative_id: 'creative-hook',
      landing_path: '/services',
    })
  })

  it('retries an unconfirmed response with the same visit ID and accepts a duplicate', async () => {
    const { trackStoryPageView } = await import('@/lib/story-attribution')
    const path =
      '/contact?story_redirect=ai-audit-retry&utm_content=story-retry&story_creative=creative-retry'
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
      '/?story_redirect=ai-audit-status&utm_content=story-status&story_creative=creative-status'
    responseStatuses = [503]
    responseBodies = [{ recorded: true }, { recorded: true }]

    await expect(trackStoryPageView(path)).resolves.toBe(false)
    await expect(trackStoryPageView(path)).resolves.toBe(true)

    expect(receivedRequests).toHaveLength(2)
  })
})
