import { useState } from 'react'
import Head from 'next/head'

const CLIENT_KEY = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || ''

function randomState(): string {
  const bytes = new Uint8Array(16)
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(bytes)
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export default function TikTokDemoPage() {
  const [starting, setStarting] = useState(false)

  function startLogin() {
    setStarting(true)
    const state = randomState()
    document.cookie = `tiktok_oauth_state=${state}; path=/; max-age=600; SameSite=Lax`
    const redirectUri = `${window.location.origin}/api/tiktok/callback`
    const params = new URLSearchParams({
      client_key: CLIENT_KEY,
      scope: 'user.info.basic,video.publish',
      response_type: 'code',
      redirect_uri: redirectUri,
      state,
    })
    window.location.href = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      }}
    >
      <Head>
        <title>Dupree Ops — TikTok Login Kit Demo</title>
      </Head>
      <div style={{ textAlign: 'center', maxWidth: 420, padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Dupree Ops, LLC</h1>
        <p style={{ color: '#999', marginBottom: 32 }}>
          TikTok Login Kit — Sandbox integration demo
        </p>
        <button
          onClick={startLogin}
          disabled={starting || !CLIENT_KEY}
          style={{
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            padding: '14px 28px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {starting ? 'Redirecting to TikTok…' : 'Continue with TikTok'}
        </button>
        {!CLIENT_KEY && (
          <p style={{ color: '#f66', marginTop: 16 }}>
            Missing NEXT_PUBLIC_TIKTOK_CLIENT_KEY
          </p>
        )}
      </div>
    </div>
  )
}
