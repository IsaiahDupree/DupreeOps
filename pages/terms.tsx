import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import { trackThemeToggle, trackLinkClick, trackEmailClick } from '@/lib/analytics'

export default function Terms() {
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
        <title>Terms of Service • Dupree Ops, LLC</title>
        <meta name="description" content="Terms of Service for Dupree Ops, LLC and its products." />
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
            <AsciiHeading label="TERMS OF SERVICE" />

            <div className="mt-6 space-y-4 text-sm md:text-base text-slate-700 dark:text-slate-200">
              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Last Updated: {new Date().toLocaleDateString()}
                </p>
                <p>
                  These Terms of Service ("Terms") govern your access to and use of websites,
                  applications, and services operated by Dupree Ops, LLC ("we," "us," or "our").
                  By accessing or using any of our services, you agree to be bound by these Terms.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Acceptance of Terms
                </p>
                <p>
                  By accessing or using any service provided by Dupree Ops, LLC, you acknowledge
                  that you have read, understood, and agree to be bound by these Terms. If you do
                  not agree, you may not use our services.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Description of Services
                </p>
                <p>
                  Dupree Ops, LLC operates multiple web and mobile applications, including but not
                  limited to software tools, calculators, learning platforms, and automation
                  services. Each product may have additional terms specific to that service.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; User Accounts
                </p>
                <p>
                  Some services may require you to create an account. You are responsible for
                  maintaining the confidentiality of your account credentials and for all
                  activities that occur under your account.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Acceptable Use
                </p>
                <p>You agree not to:</p>
                <ul className="list-none space-y-1 ml-4 mt-2">
                  <li>▸ Use our services for any illegal purpose</li>
                  <li>▸ Attempt to gain unauthorized access to our systems</li>
                  <li>▸ Interfere with or disrupt the integrity of our services</li>
                  <li>▸ Use automated systems to access our services without permission</li>
                  <li>▸ Transmit any harmful code, viruses, or malicious software</li>
                </ul>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Intellectual Property
                </p>
                <p>
                  All content, features, and functionality of our services are owned by Dupree Ops,
                  LLC and are protected by copyright, trademark, and other intellectual property
                  laws. You may not reproduce, distribute, or create derivative works without
                  explicit permission.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Limitation of Liability
                </p>
                <p>
                  To the maximum extent permitted by law, Dupree Ops, LLC shall not be liable for
                  any indirect, incidental, special, consequential, or punitive damages, or any loss
                  of profits or revenues, whether incurred directly or indirectly.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Termination
                </p>
                <p>
                  We reserve the right to suspend or terminate your access to our services at any
                  time, with or without cause or notice, for any reason, including violation of
                  these Terms.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Changes to Terms
                </p>
                <p>
                  We may modify these Terms at any time. Continued use of our services after
                  changes constitutes acceptance of the modified Terms.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Contact
                </p>
                <p>
                  For questions about these Terms, contact us at{' '}
                  <a
                    href="mailto:hello@dupreeops.com"
                    onClick={() => trackEmailClick('hello@dupreeops.com')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    hello@dupreeops.com
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
