import Link from 'next/link'
import SeoHead from '@/components/SeoHead'
import { useTheme } from '@/hooks/useTheme'
import { trackThemeToggle, trackLinkClick, trackEmailClick } from '@/lib/analytics'

export default function Privacy() {
  const { theme, toggleTheme } = useTheme()

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    toggleTheme()
    trackThemeToggle(newTheme)
  }

  return (
    <>
      <SeoHead
        title="Privacy Policy | Dupree Ops, LLC"
        description="Privacy Policy for Dupree Ops, LLC and its software, AI automation, and digital products."
        path="/privacy"
      />

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
            <AsciiHeading label="PRIVACY POLICY" />

            <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Last Updated: {new Date().toLocaleDateString()}
                </p>
                <p>
                  This Privacy Policy describes how Dupree Ops, LLC ("we," "us," or "our")
                  collects, uses, and protects your personal information when you use our websites,
                  applications, and services.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Information We Collect
                </p>
                <p className="mb-2">We may collect the following types of information:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>▸ Account information (name, email address, username)</li>
                  <li>▸ Payment and billing information (processed securely via Stripe)</li>
                  <li>▸ Usage data and analytics (how you interact with our services)</li>
                  <li>▸ Device information (browser type, operating system, IP address)</li>
                  <li>▸ Communications data (messages sent through our contact forms)</li>
                </ul>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; How We Use Your Information
                </p>
                <p>We use collected information to:</p>
                <ul className="list-none space-y-1 ml-4 mt-2">
                  <li>▸ Provide, maintain, and improve our services</li>
                  <li>▸ Process transactions and send related information</li>
                  <li>▸ Send transactional messages (receipts, notifications, support)</li>
                  <li>▸ Send optional marketing communications (with your consent)</li>
                  <li>▸ Respond to your inquiries and provide customer support</li>
                  <li>▸ Detect and prevent fraud or abuse</li>
                </ul>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Third-Party Services
                </p>
                <p className="mb-2">We use the following third-party services:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>▸ <strong>Stripe</strong> - Payment processing and billing</li>
                  <li>▸ <strong>Twilio</strong> - SMS and messaging services</li>
                  <li>▸ <strong>Analytics providers</strong> - Usage and performance tracking</li>
                  <li>▸ <strong>Email services</strong> - Transactional and marketing emails</li>
                </ul>
                <p className="mt-2">
                  These services have their own privacy policies governing how they handle your data.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Cookies and Tracking
                </p>
                <p>
                  We use cookies and similar tracking technologies to track activity on our
                  services and store certain information. You can instruct your browser to refuse
                  all cookies or to indicate when a cookie is being sent.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Data Security
                </p>
                <p>
                  We implement appropriate technical and organizational measures to protect your
                  personal information. However, no method of transmission over the internet is
                  100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Your Rights
                </p>
                <p>You have the right to:</p>
                <ul className="list-none space-y-1 ml-4 mt-2">
                  <li>▸ Access your personal data</li>
                  <li>▸ Request correction of inaccurate data</li>
                  <li>▸ Request deletion of your data</li>
                  <li>▸ Opt out of marketing communications</li>
                  <li>▸ Request a copy of your data in a portable format</li>
                </ul>
                <p className="mt-2">
                  To exercise these rights, contact us at{' '}
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
                  &gt;&gt; Children's Privacy
                </p>
                <p>
                  Our services are not intended for children under 13. We do not knowingly collect
                  personal information from children under 13.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Changes to This Policy
                </p>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any
                  changes by posting the new policy on this page and updating the "Last Updated"
                  date.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Contact Us
                </p>
                <p>
                  For questions about this Privacy Policy, contact us at{' '}
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
