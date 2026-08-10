import type { NextApiRequest, NextApiResponse } from 'next'

const CLIENT_KEY = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || ''
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || ''

function htmlPage(title: string, body: string, ok: boolean) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { background: #0a0a0a; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
    .card { max-width: 480px; padding: 32px; text-align: center; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;
              background: ${ok ? '#0f5132' : '#5c1a1a'}; color: ${ok ? '#75f0a8' : '#ff9b9b'}; margin-bottom: 16px; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    pre { text-align: left; background: #151515; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
    a { color: #6cb8ff; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${ok ? 'TikTok OAuth Success' : 'TikTok OAuth Error'}</div>
    ${body}
  </div>
</body>
</html>`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state, error, error_description: errorDescription } = req.query

  if (error) {
    res.status(400).send(
      htmlPage(
        'TikTok Login — Error',
        `<h1>Login was not completed</h1><p>${error}: ${errorDescription || ''}</p>`,
        false
      )
    )
    return
  }

  const cookieHeader = req.headers.cookie || ''
  const stateCookie = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('tiktok_oauth_state='))
    ?.split('=')[1]

  if (!code || typeof code !== 'string') {
    res.status(400).send(htmlPage('TikTok Login — Error', '<h1>Missing authorization code</h1>', false))
    return
  }

  if (stateCookie && state && stateCookie !== state) {
    res.status(400).send(htmlPage('TikTok Login — Error', '<h1>State mismatch (possible CSRF)</h1>', false))
    return
  }

  const redirectUri = process.env.TIKTOK_REDIRECT_URI || `https://${req.headers.host}/api/tiktok/callback`

  try {
    const tokenResp = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: new URLSearchParams({
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResp.json()

    if (!tokenResp.ok || tokenData.error) {
      res.status(502).send(
        htmlPage(
          'TikTok Login — Token Exchange Failed',
          `<h1>Token exchange failed</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre>`,
          false
        )
      )
      return
    }

    const accessToken = tokenData.access_token

    const userResp = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,display_name,avatar_url',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
    const userData = await userResp.json()
    const user = userData?.data?.user || {}

    res.status(200).send(
      htmlPage(
        'TikTok Login — Success',
        `
        <h1>Signed in with TikTok</h1>
        ${user.avatar_url ? `<img src="${user.avatar_url}" width="72" height="72" style="border-radius:50%;margin:12px 0" />` : ''}
        <p><strong>${user.display_name || '(no display name returned)'}</strong></p>
        <p style="color:#888;font-size:13px">open_id: ${user.open_id || tokenData.open_id || 'n/a'}</p>
        <p style="color:#888;font-size:13px">scope granted: ${tokenData.scope}</p>
        <p style="color:#888;font-size:12px">${new Date().toISOString()}</p>
        `,
        true
      )
    )
  } catch (err) {
    res.status(500).send(
      htmlPage(
        'TikTok Login — Error',
        `<h1>Unexpected error</h1><pre>${err instanceof Error ? err.message : String(err)}</pre>`,
        false
      )
    )
  }
}
