import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import { trackThemeToggle, trackLinkClick, trackEmailClick } from '@/lib/analytics'

export default function SmsPolicy() {
  const { theme, toggleTheme, mounted } = useTheme()

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    toggleTheme()
    trackThemeToggle(newTheme)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>SMS Policy • Dupree Ops, LLC</title>
        <meta name="description" content="SMS and text messaging policy for Dupree Ops, LLC products." />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
        />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
      </Head>

      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-10 space-y-4 sm:space-y-6">
          {/* Header with theme toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <Link
              href="/"
              onClick={() => trackLinkClick('/', 'Back to home')}
              className="text-sm sm:text-base text-emerald-700 active:text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:active:text-emerald-300 dark:hover:text-emerald-300 transition-colors touch-manipulation"
            >
              [ ← Back to home ]
            </Link>
            <button
              type="button"
              onClick={handleThemeToggle}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm active:bg-slate-100 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:active:bg-slate-800 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[44px]"
            >
              <span className="text-xs">{theme === 'dark' ? '🌙' : '☀️'}</span>
              <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white/90 p-4 sm:p-5 md:p-6 dark:border-slate-800 dark:bg-slate-900/70">
            <AsciiHeading label="SMS MESSAGING POLICY" />

            <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Last Updated: {new Date().toLocaleDateString()}
                </p>
                <p>
                  This page describes the SMS and text messaging practices of Dupree Ops, LLC
                  across all products and services. We use Twilio to send transactional and
                  service-related SMS messages.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Who We Are
                </p>
                <p>
                  <strong>Dupree Ops, LLC</strong> — AI &amp; Automation Studio
                  <br />
                  Address: 3425 Delaney Drive, Melbourne, FL 32934
                  <br />
                  Contact:{' '}
                  <a
                    href="mailto:support@dupreeops.com"
                    onClick={() => trackEmailClick('support@dupreeops.com')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    support@dupreeops.com
                  </a>
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Program Description
                </p>
                <p className="mb-2">
                  Dupree Ops, LLC operates SMS messaging programs for the following use cases:
                </p>
                <ul className="list-none space-y-1 ml-4">
                  <li>▸ <strong>Appointment & scheduling confirmations</strong> — reminders for booked consultations or service appointments</li>
                  <li>▸ <strong>Account alerts</strong> — verification codes, security alerts, and account notifications</li>
                  <li>▸ <strong>Service updates</strong> — status notifications for orders, subscriptions, or service delivery</li>
                  <li>▸ <strong>Support responses</strong> — replies to inbound support requests via SMS</li>
                </ul>
                <p className="mt-2">
                  SMS is sent from Twilio-managed numbers associated with Dupree Ops, LLC, including
                  toll-free numbers. Messages are sent only to users who have provided explicit
                  opt-in consent.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; How to Opt In
                </p>
                <p className="mb-2">Users can opt in to SMS messaging by:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>▸ Checking the SMS consent checkbox during account sign-up or service enrollment</li>
                  <li>▸ Replying <strong>START</strong> to an SMS enrollment invitation</li>
                  <li>▸ Providing a phone number and consenting to SMS in a product intake form</li>
                </ul>
                <p className="mt-2">
                  We will not send marketing SMS without your explicit opt-in consent.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; How to Opt Out
                </p>
                <p className="mb-2">You can stop receiving SMS messages at any time:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>▸ Reply <strong>STOP</strong> to any message to unsubscribe immediately</li>
                  <li>▸ Reply <strong>CANCEL</strong> or <strong>UNSUBSCRIBE</strong> — these are treated identically to STOP</li>
                  <li>▸ Email{' '}
                    <a
                      href="mailto:support@dupreeops.com"
                      onClick={() => trackEmailClick('support@dupreeops.com')}
                      className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    >
                      support@dupreeops.com
                    </a>{' '}
                    with your number and opt-out request
                  </li>
                </ul>
                <p className="mt-2">
                  After opting out, you will receive one final confirmation message and no further
                  SMS from that program. You may re-subscribe at any time by replying <strong>START</strong>.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Getting Help
                </p>
                <p>
                  Reply <strong>HELP</strong> to any message for support information. You can also
                  contact us at{' '}
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

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Message Frequency
                </p>
                <p>
                  Message frequency varies by product and the nature of your account activity.
                  Transactional messages are sent only when triggered by an action (e.g. a booked
                  appointment or account event). Marketing messages, if applicable, are sent no
                  more than 2–4 times per month.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Rates & Carriers
                </p>
                <p>
                  <strong>Message and data rates may apply.</strong> Standard carrier rates apply
                  based on your mobile plan. We are not responsible for charges imposed by your
                  carrier. Supported carriers include all major US carriers (AT&T, Verizon, T-Mobile,
                  Sprint, and others).
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Sample Messages
                </p>
                <p className="mb-2">Examples of messages you may receive from us:</p>
                <ul className="list-none space-y-2 ml-4">
                  <li>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Appointment confirmation:</span>
                    <br />
                    <em>"Dupree Ops: Your appointment is confirmed for Jan 15 at 2:00 PM ET. Reply STOP to unsubscribe. Msg &amp; data rates may apply."</em>
                  </li>
                  <li>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Account verification:</span>
                    <br />
                    <em>"Dupree Ops: Your verification code is 847291. Valid for 10 minutes. Reply STOP to opt out."</em>
                  </li>
                  <li>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Service alert:</span>
                    <br />
                    <em>"Dupree Ops: Your subscription has been renewed. Visit dupreeops.com for details. Reply STOP to unsubscribe."</em>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Data & Privacy
                </p>
                <p>
                  Your phone number is used only to send the messages described in this policy. We
                  do not sell or share your phone number with third parties for marketing purposes.
                  See our{' '}
                  <a
                    href="/privacy"
                    onClick={() => trackLinkClick('/privacy', 'Privacy Policy')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    Privacy Policy
                  </a>{' '}
                  for full data handling details.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Contact
                </p>
                <p>
                  For SMS-related questions, contact{' '}
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
