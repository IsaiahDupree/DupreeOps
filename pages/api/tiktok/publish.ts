import type { NextApiRequest, NextApiResponse } from 'next'

function htmlPage(title: string, body: string, ok: boolean) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { background: #0a0a0a; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
    .card { max-width: 520px; padding: 32px; text-align: center; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;
              background: ${ok ? '#0f5132' : '#5c1a1a'}; color: ${ok ? '#75f0a8' : '#ff9b9b'}; margin-bottom: 16px; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    pre { text-align: left; background: #151515; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 12px; white-space: pre-wrap; word-break: break-word; }
    a { color: #6cb8ff; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${ok ? 'Content Posting API — post initiated' : 'Content Posting API — error'}</div>
    ${body}
  </div>
</body>
</html>`
}

function readCookie(req: NextApiRequest, name: string): string | undefined {
  const header = req.headers.cookie || ''
  return header
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.split('=')[1]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accessToken = readCookie(req, 'tiktok_access_token')

  if (!accessToken) {
    res.status(401).send(
      htmlPage('Content Posting API — Error', '<h1>No access token found</h1><p>Sign in again from the demo page first.</p>', false)
    )
    return
  }

  try {
    // 1. Query creator info (required before Direct Post, per TikTok docs)
    const creatorResp = await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
    const creatorData = await creatorResp.json()
    if (!creatorResp.ok || creatorData.error?.code !== 'ok') {
      res.status(502).send(
        htmlPage('Content Posting API — Error', `<h1>Query Creator Info failed</h1><pre>${JSON.stringify(creatorData, null, 2)}</pre>`, false)
      )
      return
    }

    // 2. Fetch the bundled test video bytes from our own public folder
    const videoUrl = `https://${req.headers.host}/tiktok-test-video.mp4`
    const videoResp = await fetch(videoUrl)
    const videoBuffer = Buffer.from(await videoResp.arrayBuffer())

    // 3. Initiate direct post (FILE_UPLOAD, single chunk — video is small)
    const initResp = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        post_info: {
          title: 'Dupree Ops Content Posting API test post (private)',
          privacy_level: 'SELF_ONLY',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000,
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: videoBuffer.byteLength,
          chunk_size: videoBuffer.byteLength,
          total_chunk_count: 1,
        },
      }),
    })
    const initData = await initResp.json()
    if (!initResp.ok || initData.error?.code !== 'ok') {
      res.status(502).send(
        htmlPage('Content Posting API — Error', `<h1>Video init failed</h1><pre>${JSON.stringify(initData, null, 2)}</pre>`, false)
      )
      return
    }

    const { publish_id: publishId, upload_url: uploadUrl } = initData.data

    // 4. Upload the video bytes
    const uploadResp = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Range': `bytes 0-${videoBuffer.byteLength - 1}/${videoBuffer.byteLength}`,
      },
      body: videoBuffer,
    })

    if (!uploadResp.ok) {
      const uploadErrText = await uploadResp.text()
      res.status(502).send(
        htmlPage('Content Posting API — Error', `<h1>Video upload failed (${uploadResp.status})</h1><pre>${uploadErrText}</pre>`, false)
      )
      return
    }

    // 5. Poll status a few times (video processing is async)
    let statusData: any = null
    for (let attempt = 0; attempt < 5; attempt++) {
      await new Promise((r) => setTimeout(r, 2000))
      const statusResp = await fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ publish_id: publishId }),
      })
      statusData = await statusResp.json()
      const status = statusData?.data?.status
      if (status && status !== 'PROCESSING_UPLOAD' && status !== 'PROCESSING_DOWNLOAD') break
    }

    res.status(200).send(
      htmlPage(
        'Content Posting API — Success',
        `
        <h1>Video submitted via Content Posting API</h1>
        <p style="color:#888;font-size:13px">creator: ${creatorData.data.creator_nickname} (@${creatorData.data.creator_username})</p>
        <p style="color:#888;font-size:13px">publish_id: ${publishId}</p>
        <p style="color:#888;font-size:13px">privacy_level: SELF_ONLY (private — visible only to the account owner)</p>
        <p style="color:#888;font-size:13px">status: ${statusData?.data?.status || 'unknown'}</p>
        <p style="color:#888;font-size:12px">${new Date().toISOString()}</p>
        <pre>${JSON.stringify(statusData, null, 2)}</pre>
        `,
        true
      )
    )
  } catch (err) {
    res.status(500).send(
      htmlPage('Content Posting API — Error', `<h1>Unexpected error</h1><pre>${err instanceof Error ? err.message : String(err)}</pre>`, false)
    )
  }
}
