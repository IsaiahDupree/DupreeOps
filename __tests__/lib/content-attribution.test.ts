/** @jest-environment node */
import { randomBytes, randomUUID } from 'node:crypto'
import { parseContentAttribution, redactContentProof, trackContentLanding } from '@/lib/content-attribution'

const origin = 'https://www.dupreeops.com'
function incoming() {
  const context = { cie_content_id: randomUUID(), cie_iteration_id: randomUUID(),
    cie_campaign_id: randomUUID(), cie_platform: 'instagram', cie_account_id: '807',
    cie_click_id: randomUUID(), utm_source: 'codex_qa' }
  // Pure parser contract: only the server can authenticate the actual HMAC.
  const proof = randomBytes(30).toString('base64url') + '.' + randomBytes(32).toString('hex')
  return { context, proof, path: '/?' + new URLSearchParams({ ...context, cie_proof: proof }) }
}

it('carries only explicit attribution, proof and the pathname', () => {
  const { context, proof, path } = incoming()
  expect(parseContentAttribution(path + '&email=private%40example.com#fragment', origin))
    .toEqual({ context, proof, landing_path: '/' })
  expect(redactContentProof(path)).not.toContain(proof)
})

it('rejects incomplete, duplicate, malformed and foreign-origin input', () => {
  const { path, proof } = incoming()
  for (const input of [path + '&cie_account_id=228', path + '&cie_proof=' + proof,
    path.replace(/cie_click_id=[^&]+/, 'cie_click_id=bad'), path.replace(proof, 'invalid'),
    'https://example.org' + path, '/?utm_source=instagram', '/']) {
    expect(parseContentAttribution(input, origin)).toBeNull()
  }
})

it('does not collect from server rendering', async () => {
  await expect(trackContentLanding(incoming().path)).resolves.toBe(false)
})
