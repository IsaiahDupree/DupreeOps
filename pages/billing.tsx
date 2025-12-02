import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import { trackThemeToggle, trackLinkClick, trackEmailClick } from '@/lib/analytics'

export default function Billing() {
  const { theme, toggleTheme, mounted } = useTheme()

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    toggleTheme()
    trackThemeToggle(newTheme)
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>Billing & Messaging Policy • Dupree Ops, LLC</title>
        <meta name="description" content="Billing and Messaging Policy for Dupree Ops, LLC and its products." />
      </Head>

      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
          {/* Header with theme toggle */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => trackLinkClick('/', 'Back to home')}
              className="text-sm md:text-base text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
            >
              [ ← Back to home ]
            </Link>
            <button
              type="button"
              onClick={handleThemeToggle}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-xs">{theme === 'dark' ? '🌙' : '☀️'}</span>
              <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white/90 p-4 md:p-6 dark:border-slate-800 dark:bg-slate-900/70">
            <AsciiHeading label="BILLING & MESSAGING POLICY" />

            <div className="mt-6 space-y-4 text-sm md:text-base text-slate-700 dark:text-slate-200">
              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Last Updated: {new Date().toLocaleDateString()}
                </p>
                <p>
                  This policy outlines how Dupree Ops, LLC handles billing, payments, refunds, and
                  messaging communications across our products and services.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Payment Processing
                </p>
                <p>
                  All payments are processed securely through Stripe. We do not store your full
                  credit card information on our servers. Payment data is encrypted and handled
                  in accordance with PCI DSS standards.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Billing Models
                </p>
                <p className="mb-2">Our services may use various billing models:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>▸ One-time purchases</li>
                  <li>▸ Monthly or annual subscriptions</li>
                  <li>▸ Usage-based billing</li>
                  <li>▸ Free tiers with optional premium features</li>
                </ul>
                <p className="mt-2">
                  Specific billing terms for each product are disclosed at the point of purchase.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Subscription Renewals
                </p>
                <p>
                  Subscriptions automatically renew at the end of each billing period unless
                  cancelled. You will be charged the then-current subscription fee. We will notify
                  you of upcoming renewals via email.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Cancellation
                </p>
                <p>
                  You may cancel your subscription at any time through your account settings or by
                  contacting support. Cancellation takes effect at the end of the current billing
                  period. You will continue to have access to paid features until the period ends.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Refund Policy
                </p>
                <p className="mb-2">Refund eligibility varies by product and purchase type:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>
                    ▸ <strong>Digital products:</strong> Refunds may be available within 7-14 days
                    of purchase, subject to product-specific terms
                  </li>
                  <li>
                    ▸ <strong>Subscriptions:</strong> Refunds for unused portions may be available
                    on a case-by-case basis
                  </li>
                  <li>
                    ▸ <strong>One-time services:</strong> Refund eligibility depends on service
                    delivery status
                  </li>
                </ul>
                <p className="mt-2">
                  To request a refund, contact{' '}
                  <a
                    href="mailto:support@dupreeops.com"
                    onClick={() => trackEmailClick('support@dupreeops.com')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    support@dupreeops.com
                  </a>{' '}
                  with your order details.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Transactional Messages
                </p>
                <p className="mb-2">
                  We send transactional messages that are necessary for the operation of our
                  services, including:
                </p>
                <ul className="list-none space-y-1 ml-4">
                  <li>▸ Payment receipts and invoices</li>
                  <li>▸ Account verification and security alerts</li>
                  <li>▸ Service notifications and updates</li>
                  <li>▸ Support responses</li>
                </ul>
                <p className="mt-2">
                  These messages are sent via email and, when applicable, SMS through Twilio. You
                  cannot opt out of transactional messages as they are essential for service
                  delivery.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Marketing Messages
                </p>
                <p className="mb-2">We may send optional marketing communications, including:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>▸ Product updates and new feature announcements</li>
                  <li>▸ Promotional offers and discounts</li>
                  <li>▸ Educational content and tips</li>
                </ul>
                <p className="mt-2">Marketing messages require your explicit opt-in. You can opt out at any time by:</p>
                <ul className="list-none space-y-1 ml-4 mt-2">
                  <li>▸ Clicking the unsubscribe link in any marketing email</li>
                  <li>▸ Replying "STOP" to SMS messages (where supported)</li>
                  <li>▸ Updating your preferences in your account settings</li>
                  <li>▸ Contacting us at support@dupreeops.com</li>
                </ul>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Message Frequency
                </p>
                <p>
                  Transactional messages are sent as needed. Marketing messages are typically sent
                  no more than once per week, though frequency may vary. You control marketing
                  message frequency through your account preferences.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Data Usage
                </p>
                <p>
                  When you opt in to SMS or push notifications, standard message and data rates may
                  apply. We use your phone number and email address solely for the purposes
                  described in this policy and our Privacy Policy.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Billing Disputes
                </p>
                <p>
                  If you believe there is an error in your billing, contact us within 60 days of
                  the charge. We will investigate and respond within 10 business days.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Contact
                </p>
                <p>
                  For billing or messaging questions, contact us at{' '}
                  <a
                    href="mailto:support@dupreeops.com"
                    onClick={() => trackEmailClick('support@dupreeops.com')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    support@dupreeops.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function AsciiHeading({ label }: { label: string }) {
  const line = '═'.repeat(Math.max(label.length + 4, 28))
  return (
    <pre className="text-xs md:text-sm leading-snug text-emerald-700 dark:text-emerald-400 whitespace-pre font-mono">
{`╔${line}╗
║ ${label.padEnd(line.length - 2, ' ')}║
╚${line}╝`}
    </pre>
  )
}
