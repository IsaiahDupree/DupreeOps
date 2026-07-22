/**
 * Lead-notification email via Resend (https://resend.com).
 *
 * Interim sender config: emails are sent FROM the already-verified `everreach.app`
 * Resend domain with `Reply-To: hello@dupreeops.com`, so replies go to DupreeOps.
 * To send FROM an @dupreeops.com address, add dupreeops.com to Resend (Pro plan) and
 * point CONTACT_FROM_EMAIL at it — no other code change required.
 *
 * All sends are BEST-EFFORT: a failure here never breaks the contact-form request.
 * The Supabase `contact_submissions` row is the source of truth; this is a notification.
 */

export interface LeadNotification {
  name: string
  email: string
  message: string
  submissionId?: string
}

export interface EmailResult {
  sent: boolean
  id?: string
  error?: string
}

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const SEND_TIMEOUT_MS = 8000

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendLeadNotification(lead: LeadNotification): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL || 'DupreeOps <notifications@everreach.app>'
  const to = process.env.CONTACT_NOTIFY_EMAIL
  // Reply-To is the prospect's own address so hitting "Reply" on the notification
  // emails them directly. Do NOT use hello@dupreeops.com here — it forwards back to
  // this same inbox via ForwardEmail, which would loop replies to yourself.
  const replyTo = lead.email

  // Fail soft: if email isn't configured, skip silently so the form still succeeds.
  if (!apiKey || !to) {
    return {
      sent: false,
      error: 'email not configured (RESEND_API_KEY / CONTACT_NOTIFY_EMAIL missing)',
    }
  }

  const name = escapeHtml(lead.name)
  const email = escapeHtml(lead.email)
  const message = escapeHtml(lead.message).replace(/\n/g, '<br>')

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;color:#111">
      <h2 style="margin:0 0 4px">New DupreeOps contact form lead</h2>
      <p style="color:#666;margin:0 0 16px">Submitted via dupreeops.com/contact</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 0;color:#888;width:90px;vertical-align:top">Name</td><td style="padding:6px 0"><strong>${name}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#888;vertical-align:top">Email</td><td style="padding:6px 0"><a href="mailto:${email}">${email}</a></td></tr>
      </table>
      <p style="color:#888;margin:16px 0 4px">Message</p>
      <div style="padding:12px 16px;background:#f6f7f9;border-radius:8px;white-space:pre-wrap">${message}</div>
      ${lead.submissionId ? `<p style="color:#aaa;font-size:12px;margin-top:16px">Submission ID: ${escapeHtml(lead.submissionId)}</p>` : ''}
      <p style="color:#aaa;font-size:12px">Reply directly to this email to respond to ${name}.</p>
    </div>`

  const text = [
    'New DupreeOps contact form lead',
    'Submitted via dupreeops.com/contact',
    '',
    `Name:  ${lead.name}`,
    `Email: ${lead.email}`,
    '',
    'Message:',
    lead.message,
    '',
    lead.submissionId ? `Submission ID: ${lead.submissionId}` : '',
    'Reply directly to this email to respond.',
  ]
    .filter(Boolean)
    .join('\n')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS)

  try {
    const resp = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: replyTo,
        subject: `[DupreeOps] New lead from ${lead.name}`,
        html,
        text,
      }),
      signal: controller.signal,
    })

    if (!resp.ok) {
      const body = await resp.text().catch(() => '')
      return { sent: false, error: `resend ${resp.status}: ${body.slice(0, 200)}` }
    }

    const data = (await resp.json().catch(() => ({}))) as { id?: string }
    return { sent: true, id: data.id }
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : 'unknown email send error',
    }
  } finally {
    clearTimeout(timer)
  }
}
