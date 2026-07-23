# DupreeOps Email — Runbook

How email works for **dupreeops.com**: what receives mail, what sends it, where the
credentials live, and how to fix it when something breaks. Set up 2026-07-22.

> **No secrets in this file.** Keys/passwords live in `~/.env` and the Vercel/Resend
> dashboards — this doc only says *where*. Never paste key values here.

---

## TL;DR

`hello@dupreeops.com` and `support@dupreeops.com` are fully functional — you can
**receive** and **send** from both, all inside your Gmail (`isaiahdupree33@gmail.com`).

| Capability | Provider | Notes |
|---|---|---|
| **Receive** (hello@, support@) | ForwardEmail (free, DNS-only) | Forwards into your Gmail |
| **Send from the website** (contact form) | Resend — *dupreeops* account | Lead notifications come **from** `hello@dupreeops.com` |
| **Send/reply as a human** (Gmail) | Resend SMTP + Gmail "Send mail as" | Pick `hello@dupreeops.com` in Gmail's From dropdown |

---

## Architecture

```
INBOUND                                        OUTBOUND (website)
someone → hello@dupreeops.com                  contact form (dupreeops.com/contact)
   │  MX → mx1/mx2.forwardemail.net               │  POST /api/contact
   │  (ForwardEmail reads forward-email TXT)      │  → Supabase insert (source of truth)
   ▼                                              │  → Resend API (dupreeops account)
isaiahdupree33@gmail.com  ◄─────────────────────  └─→ email FROM hello@dupreeops.com
                                                       TO isaiahdupree33@gmail.com
OUTBOUND (human)                                       Reply-To: the prospect
Gmail "Send mail as hello@dupreeops.com"
   → smtp.resend.com:587 (user resend)
   → delivered as hello@dupreeops.com
```

---

## DNS records (all in the Vercel DNS zone for dupreeops.com)

Manage at: Vercel → project `dupreeops` → Settings → Domains, or `npx vercel dns ls dupreeops.com`.

| Host | Type | Value | Purpose |
|---|---|---|---|
| `@` | MX | `mx1.forwardemail.net` (pri 0) | inbound (ForwardEmail) |
| `@` | MX | `mx2.forwardemail.net` (pri 0) | inbound (ForwardEmail) |
| `@` | TXT | `forward-email=hello:isaiahdupree33@gmail.com,support:isaiahdupree33@gmail.com` | inbound routing |
| `@` | TXT | `v=spf1 a include:spf.forwardemail.net -all` | inbound SPF |
| `send` | MX | `feedback-smtp.us-east-1.amazonses.com` (pri 10) | Resend sending (bounce path) |
| `send` | TXT | `v=spf1 include:amazonses.com ~all` | Resend sending SPF |
| `resend._domainkey` | TXT | `p=MIGf…` (DKIM public key) | Resend sending DKIM |

Inbound records are on the **apex**; sending records are on **subdomains** (`send.`,
`resend._domainkey.`) so the two never conflict.

⚠️ The `forward-email=` TXT record **publicly exposes** the Gmail target (visible via
`dig TXT dupreeops.com`). Acceptable for now; ForwardEmail's paid tier encrypts it.

---

## Accounts & credentials (locations only)

- **ForwardEmail** — no account; configured entirely via the DNS records above.
- **Resend, "dupreeops" account** — login `support@dupreeops.com` (forwards to Gmail).
  Password: in your password manager — **rotate the auto-generated one**. Dashboard: https://resend.com
  - `dupreeops.com` is a **verified** sending domain here (Resend domain id `bb255a1d-…`).
  - Keys in `~/.env`: `RESEND_DUPREEOPS_API_KEY` (send-only, also the Gmail SMTP password)
    and `RESEND_DUPREEOPS_ADMIN_KEY` (full access, for domain management).
- **Resend, "everreach" account** — the original account; `everreach.app` verified there.
  Key `RESEND_API_KEY` in `~/.env`. Not used by DupreeOps anymore (the site was switched
  to the dupreeops account/sender).
- **Vercel env** (project `dupreeops`, production + preview): `RESEND_API_KEY` (= the
  dupreeops send key), `CONTACT_FROM_EMAIL`, `CONTACT_NOTIFY_EMAIL`, plus the Supabase vars.
  Manage at Vercel → project → Settings → Environment Variables.

> Two Resend accounts because the free plan allows **1 verified domain per account**, and
> the everreach account's slot was taken. A separate account per distinct brand is fine.

---

## The contact form

`pages/api/contact.ts` → on submit:
1. Insert into Supabase table `contact_submissions` (project `gqjgxltroyysjoxswbmn`, via the
   anon key + the "Allow anonymous insert" RLS policy — **source of truth**).
2. Best-effort lead email via `lib/email.ts` → Resend: **from** `hello@dupreeops.com`,
   **to** `CONTACT_NOTIFY_EMAIL` (isaiahdupree33@gmail.com), **Reply-To** = the prospect's
   own email (so hitting Reply answers the lead directly).

Email failure never fails the submission. Env-driven: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`,
`CONTACT_NOTIFY_EMAIL`.

---

## Using "Send mail as" in Gmail

Already configured. In Gmail → **Compose** (or Reply) → **From** dropdown → pick
`hello@dupreeops.com`. If you ever need to re-add it (Gmail → Settings → Accounts →
"Send mail as" → Add another email address):

- SMTP server `smtp.resend.com`, port `587`, TLS
- Username `resend`
- Password = the `RESEND_DUPREEOPS_API_KEY` value from `~/.env`

Gmail emails a confirmation link to `hello@` → it forwards into the inbox → click it.

---

## Troubleshooting

- **A lead didn't email me.** The row still saved to Supabase (`contact_submissions`).
  Check Resend → https://resend.com/emails (dupreeops account) for the send + status.
  If the domain shows unverified, re-run verification (see below).
- **Mail to hello@ bounces.** Check MX is live: `dig MX dupreeops.com` → should be
  `mx1/mx2.forwardemail.net`. If empty, the apex MX records were removed.
- **Send-as broke in Gmail.** The `RESEND_DUPREEOPS_API_KEY` may have been rotated/revoked
  — create a new send key in Resend and update Gmail's "Send mail as" SMTP password + the
  Vercel `RESEND_API_KEY`.
- **Deploys.** The `dupreeops` Vercel project is **CLI-only** (not git-auto-deploy):
  `cd DupreeOpsLLC && npx vercel --prod --yes`. Env changes take effect on next deploy.
- **Re-verify the sending domain:**
  `curl -s -X POST https://api.resend.com/domains/bb255a1d-.../verify -H "Authorization: Bearer $RESEND_DUPREEOPS_ADMIN_KEY"`

---

## Replicate for another brand/domain

The whole flow is automated by the **chrome-bridge browser-automation toolkit**
(`~/Documents/Chrome/chrome-bridge/automations/setup-brand-email.mjs`):

```bash
# needs: npx vercel authed to the domain's DNS team; a Resend account (free = new
# account per brand) with a full-access key + a send key in ~/.env
node automations/setup-brand-email.mjs --domain <brand>.com \
  --forward-to isaiahdupree33@gmail.com \
  --admin-key-env RESEND_<BRAND>_ADMIN_KEY --send-key-env RESEND_<BRAND>_API_KEY
# --only inbound   to just set up forwarding (no Resend account needed)
```

Verified end-to-end on velvethold.com (inbound leg). See `chrome-bridge/TOOLKIT.md`.
