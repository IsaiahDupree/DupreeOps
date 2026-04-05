import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import { trackThemeToggle, trackLinkClick, trackEmailClick } from '@/lib/analytics'

export default function Contact() {
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
        <title>Contact • Dupree Ops, LLC</title>
        <meta name="description" content="Contact Dupree Ops, LLC for support, partnerships, or verification." />
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
            <AsciiHeading label="CONTACT" />

            <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; General & Business Inquiries
                </p>
                <p>
                  <a
                    href="mailto:hello@dupreeops.com"
                    onClick={() => trackEmailClick('hello@dupreeops.com')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    hello@dupreeops.com
                  </a>
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  For partnerships, new projects, and general business questions.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Customer Support
                </p>
                <p>
                  <a
                    href="mailto:support@dupreeops.com"
                    onClick={() => trackEmailClick('support@dupreeops.com')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    support@dupreeops.com
                  </a>
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  For product support, billing questions, refund requests, and SMS opt-out
                  assistance. Typical response time: 1–2 business days.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Business Information
                </p>
                <p>Dupree Ops, LLC</p>
                <p>3425 Delaney Drive, Melbourne, FL 32934</p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  For written correspondence or provider verification, contact us via email with
                  your reference ID and we will provide documentation confirming ownership of
                  domains, products, and messaging programs.
                </p>
              </div>

              <div>
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  &gt;&gt; Social Profiles
                </p>
                <div className="flex flex-wrap gap-3 mt-1">
                  <a
                    href="https://x.com/isaiahdupree33"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackLinkClick('https://x.com/isaiahdupree33', 'Twitter / X')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    Twitter / X →
                  </a>
                  <a
                    href="https://www.linkedin.com/in/isaiah-dupree33/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackLinkClick('https://www.linkedin.com/in/isaiah-dupree33/', 'LinkedIn')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    LinkedIn →
                  </a>
                  <a
                    href="https://github.com/IsaiahDupree"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackLinkClick('https://github.com/IsaiahDupree', 'GitHub')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    GitHub →
                  </a>
                </div>
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
