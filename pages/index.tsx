import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { trackThemeToggle, trackLinkClick, trackEmailClick, trackProductClick } from '@/lib/analytics'

const products = [
  {
    name: 'TechMeStuff.com',
    description: 'Engineering calculators and tools for students, hobbyists, and professionals.',
    url: 'https://techmestuff.com',
  },
  {
    name: 'MatrixLoop.app',
    description: 'Analytics and coaching layer for social platforms and growth workflows.',
    url: 'https://matrixloop.app',
  },
  {
    name: 'GlowMog',
    description: 'Face fitness & habit app focused on realistic, research-backed glow-ups.',
    url: 'https://glowmog.com',
  },
  {
    name: 'YTQuizzes',
    description: 'Turn YouTube videos into quizzes so users actually remember what they watch.',
    url: 'https://ytquizzes.com',
  },
]

export default function Home() {
  const { theme, toggleTheme, mounted } = useTheme()
  const [timeString, setTimeString] = useState<string>('')

  // Simple live clock in user's local time (ET for you)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const opts: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'America/New_York',
      }
      setTimeString(new Intl.DateTimeFormat('en-US', opts).format(now))
    }
    updateTime()
    const id = setInterval(updateTime, 1000)
    return () => clearInterval(id)
  }, [])

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
        <title>Dupree Ops, LLC • Official Business Site</title>
        <meta
          name="description"
          content="Official business website for Dupree Ops, LLC – operator of software, AI, and automation products."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
        />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-10 space-y-6 sm:space-y-8 md:space-y-10">
          {/* Navigation bar */}
          <nav className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <a
                href="/"
                onClick={() => trackLinkClick('/', 'Home')}
                className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium"
              >
                Home
              </a>
              <span className="text-slate-400">•</span>
              <a
                href="/services"
                onClick={() => trackLinkClick('/services', 'Services')}
                className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium"
              >
                Services
              </a>
              <span className="text-slate-400">•</span>
              <a
                href="/contact"
                onClick={() => trackLinkClick('/contact', 'Contact')}
                className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium"
              >
                Contact
              </a>
            </div>
          </nav>

          {/* TOP BAR: title + theme toggle + time */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <pre className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm leading-snug text-emerald-700 dark:text-emerald-400 whitespace-pre font-mono overflow-x-auto">
{String.raw`╔══════════════════════════════════════════════════════════════╗
║                         DUPREE OPS, LLC                      ║
║        AI & AUTOMATION STUDIO FOR MODERN BUSINESSES          ║
╚══════════════════════════════════════════════════════════════╝`}
              </pre>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300">
                &gt; Official business website for{' '}
                <span className="font-semibold">Dupree Ops, LLC</span>. Used to verify ownership
                and operations of our products with providers such as Stripe, Twilio, and app
                stores.
              </p>
            </div>

            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleThemeToggle}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm active:bg-slate-100 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:active:bg-slate-800 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[44px]"
              >
                <span className="text-base">{theme === 'dark' ? '🌙' : '☀️'}</span>
                <span className="hidden xs:inline">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
              </button>
              <div className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 text-right sm:text-right">
                <div className="hidden sm:block">Local time (ET)</div>
                <div className="sm:hidden text-[10px]">ET</div>
                <div className="font-mono text-xs sm:text-sm">{timeString || '--:--:--'}</div>
              </div>
            </div>
          </header>

          {/* HERO: founder / company snapshot (Yadwinder-style) */}
          <section aria-label="Company Snapshot">
            <div className="grid gap-4 sm:gap-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
              {/* Left: founder-style card */}
              <div className="rounded-lg border border-slate-200 bg-white/90 p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <h1 className="text-lg sm:text-xl md:text-2xl font-display font-semibold">Isaiah Dupree</h1>
                <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                  Founder, Dupree Ops, LLC • AI & Automation Systems
                </p>

                <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                  I build and operate software products that turn complex workflows into simple,
                  repeatable systems. Dupree Ops, LLC is the studio behind several AI- and
                  automation-powered tools for creators, engineers, and small businesses.
                </p>
                <p className="mt-2 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                  From engineering calculators to social growth infrastructure and custom
                  automations, our focus is on clarity, reliability, and measurable impact.
                </p>

                <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <a
                    href="/services"
                    onClick={() => trackLinkClick('/services', 'View Services')}
                    className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-medium text-slate-50 shadow-sm active:bg-black hover:bg-black dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:active:bg-white dark:hover:bg-white transition-colors touch-manipulation min-h-[44px]"
                  >
                    View Services
                  </a>
                    <span className="inline-flex items-center rounded-full border border-emerald-500/70 bg-emerald-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-emerald-700 dark:border-emerald-400/70 dark:bg-emerald-900/40 dark:text-emerald-200">
                    Available for select partnerships
                  </span>
                </div>
              </div>

              {/* Right: quick "experience / focus / links" */}
              <div className="space-y-3 sm:space-y-3 text-xs sm:text-sm md:text-base">
                <div className="rounded-lg border border-slate-200 bg-white/90 p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="text-emerald-700 dark:text-emerald-400 font-semibold mb-2 text-xs sm:text-sm">
                    EXPERIENCE & FOCUS
                  </p>
                  <ul className="space-y-1.5 text-slate-700 dark:text-slate-200 leading-relaxed">
                    <li>▸ AI & workflow automation systems</li>
                    <li>▸ Web & mobile SaaS products</li>
                    <li>▸ Engineering tools & calculators</li>
                    <li>▸ Creator growth & analytics tooling</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white/90 p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="text-emerald-700 dark:text-emerald-400 font-semibold mb-2 text-xs sm:text-sm">
                    LET&apos;S GET IN TOUCH
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    <a
                      href="https://x.com/isaiahdupree33"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackLinkClick('https://x.com/isaiahdupree33', 'Twitter / X')}
                      className="inline-flex items-center rounded-full border border-slate-300 px-3 sm:px-3.5 py-2 sm:py-2 text-xs sm:text-sm text-slate-700 active:bg-slate-100 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:active:bg-slate-800 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[40px]"
                    >
                      Twitter / X
                    </a>
                    <a
                      href="https://www.linkedin.com/in/isaiah-dupree33/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackLinkClick('https://www.linkedin.com/in/isaiah-dupree33/', 'LinkedIn')}
                      className="inline-flex items-center rounded-full border border-slate-300 px-3 sm:px-3.5 py-2 sm:py-2 text-xs sm:text-sm text-slate-700 active:bg-slate-100 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:active:bg-slate-800 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[40px]"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://github.com/IsaiahDupree"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackLinkClick('https://github.com/IsaiahDupree', 'GitHub')}
                      className="inline-flex items-center rounded-full border border-slate-300 px-3 sm:px-3.5 py-2 sm:py-2 text-xs sm:text-sm text-slate-700 active:bg-slate-100 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:active:bg-slate-800 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[40px]"
                    >
                      GitHub
                    </a>
                    <a
                      href="mailto:support@dupreeops.com"
                      onClick={() => trackEmailClick('support@dupreeops.com')}
                      className="inline-flex items-center rounded-full border border-slate-300 px-3 sm:px-3.5 py-2 sm:py-2 text-xs sm:text-sm text-slate-700 active:bg-slate-100 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:active:bg-slate-800 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[40px]"
                    >
                      Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT COMPANY */}
          <section id="about" aria-label="About Company" className="space-y-3">
            <AsciiHeading label="ABOUT THE COMPANY" />
            <div className="rounded-lg border border-slate-200 bg-white/90 p-4 md:p-5 dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-sm md:text-base text-slate-800 dark:text-slate-100 mb-3">
                <strong>Dupree Ops, LLC</strong> is a software and automation studio focused on
                building durable infrastructure for creators, educators, and small businesses. We
                design and operate web & mobile applications, APIs, and internal tooling that make
                complex workflows simple.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 mb-3">
                Our products range from engineering calculators and educational tools to analytics
                layers and AI-powered workflow systems. Each major product runs on its own domain,
                but all are owned and operated under this company.
              </p>

              <div className="grid gap-4 md:grid-cols-2 text-sm md:text-base">
                <div>
                  <p className="text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                    ► Business details
                  </p>
                  <p className="text-slate-700 dark:text-slate-200">
                    Registered name: Dupree Ops, LLC
                  </p>
                  <p className="text-slate-700 dark:text-slate-200">Jurisdiction: Florida, United States</p>
                  <p className="text-slate-700 dark:text-slate-200">
                    Mailing address: 3425 Delaney Drive, Melbourne, FL 32934
                  </p>
                  <p className="text-slate-700 dark:text-slate-200">
                    Primary focus: Software, AI, and workflow automation
                  </p>
                </div>
                <div>
                  <p className="text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                    ► What we do
                  </p>
                  <ul className="list-none space-y-1 text-slate-700 dark:text-slate-200">
                    <li>▸ Design & operate SaaS products and APIs</li>
                    <li>▸ Ship AI-assisted tools and automations</li>
                    <li>▸ Develop engineering & learning utilities</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* PRODUCTS */}
          <section id="products" aria-label="Products & Websites" className="space-y-3">
            <AsciiHeading label="PRODUCTS & WEBSITES" />
            <div className="rounded-lg border border-slate-200 bg-white/90 p-4 md:p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                Below is a partial list of products and domains currently operated by Dupree Ops,
                LLC. These may appear in billing descriptors, API integrations, or messaging
                traffic.
              </p>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {products.map((product) => (
                  <div
                    key={product.name}
                    className="flex flex-col justify-between rounded-md border border-slate-200 bg-slate-50/80 p-3 sm:p-4 dark:border-slate-700 dark:bg-slate-950/70"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                        <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-50">
                          {product.name}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackProductClick(product.name, product.url)}
                        className="inline-flex items-center text-sm sm:text-base text-emerald-700 active:text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:active:text-emerald-300 dark:hover:text-emerald-300 transition-colors touch-manipulation py-1"
                      >
                        [ visit site → ]
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
                Additional experimental projects and internal tools may be deployed under
                subdomains and are still owned and operated by Dupree Ops, LLC unless otherwise
                specified.
              </p>
            </div>
          </section>

          {/* LEGAL */}
          <section id="legal" aria-label="Legal & Compliance" className="space-y-3">
            <AsciiHeading label="LEGAL & COMPLIANCE" />
            <div className="rounded-lg border border-slate-200 bg-white/90 p-4 md:p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                We maintain clear policies for how we process payments, protect data, and send
                communications. These policies apply across our products unless a specific product
                provides additional terms.
              </p>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4 text-xs sm:text-sm md:text-base">
                <div className="rounded-md border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/70">
                  <p className="text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                    ► Terms of Service
                  </p>
                  <p className="text-slate-700 dark:text-slate-200 mb-2">
                    Usage guidelines, acceptable use, and limitations of liability for our websites,
                    apps, and APIs.
                  </p>
                  <a
                    href="/terms"
                    onClick={() => trackLinkClick('/terms', 'Terms of Service')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    [ view /terms ]
                  </a>
                </div>

                <div className="rounded-md border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/70">
                  <p className="text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                    ► Privacy Policy
                  </p>
                  <p className="text-slate-700 dark:text-slate-200 mb-2">
                    What data we collect, how we use it, and the third-party providers we rely on
                    (e.g. Stripe, Twilio, analytics).
                  </p>
                  <a
                    href="/privacy"
                    onClick={() => trackLinkClick('/privacy', 'Privacy Policy')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    [ view /privacy ]
                  </a>
                </div>

                <div className="rounded-md border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/70">
                  <p className="text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                    ► Billing & Messaging
                  </p>
                  <p className="text-slate-700 dark:text-slate-200 mb-2">
                    Subscription billing, refunds, and how transactional + optional marketing
                    messages are sent and can be opted out of.
                  </p>
                  <a
                    href="/billing"
                    onClick={() => trackLinkClick('/billing', 'Billing & Messaging')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    [ view /billing ]
                  </a>
                </div>

                <div className="rounded-md border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/70">
                  <p className="text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                    ► SMS Policy
                  </p>
                  <p className="text-slate-700 dark:text-slate-200 mb-2">
                    SMS opt-in/opt-out, message frequency, sample messages, and carrier
                    information for our Twilio-powered messaging programs.
                  </p>
                  <a
                    href="/sms"
                    onClick={() => trackLinkClick('/sms', 'SMS Policy')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    [ view /sms ]
                  </a>
                </div>
              </div>

              <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-3 sm:p-4 text-sm md:text-base dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <p className="text-emerald-700 dark:text-emerald-400 mb-2 font-semibold">
                  ► SMS / Text Messaging Program
                </p>
                <p className="text-slate-700 dark:text-slate-200 mb-2">
                  Dupree Ops, LLC sends SMS messages through Twilio for transactional notifications
                  related to our products (e.g. appointment confirmations, account alerts, service
                  updates). Users provide explicit opt-in consent at the point of account creation
                  or service enrollment.
                </p>
                <ul className="list-none space-y-1 text-slate-700 dark:text-slate-200 ml-3 mb-2">
                  <li>▸ <strong>Opt-in:</strong> Users check a consent box at sign-up or reply START to an enrollment message.</li>
                  <li>▸ <strong>Opt-out:</strong> Reply STOP to any message to unsubscribe immediately.</li>
                  <li>▸ <strong>Help:</strong> Reply HELP for support. Contact support@dupreeops.com.</li>
                  <li>▸ <strong>Message frequency:</strong> Varies by service; typically 1–5 messages per month.</li>
                  <li>▸ <strong>Rates:</strong> Message and data rates may apply.</li>
                </ul>
                <p className="text-slate-700 dark:text-slate-200">
                  Sample messages: <em>"Your appointment is confirmed for [date] at [time]. Reply STOP to unsubscribe."</em>{' '}
                  |{' '}<em>"Action required: verify your account by clicking [link]. Reply STOP to opt out."</em>
                </p>
                <p className="mt-2 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                  Full SMS policy:{' '}
                  <a
                    href="/sms"
                    onClick={() => trackLinkClick('/sms', 'SMS Policy')}
                    className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    dupreeops.com/sms
                  </a>
                </p>
              </div>

              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
                Messaging traffic sent via Twilio follows our opt-in and opt-out policies, including
                support for STOP/UNSUBSCRIBE commands. See{' '}
                <a
                  href="/billing"
                  onClick={() => trackLinkClick('/billing', 'Billing & Messaging')}
                  className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                >
                  /billing
                </a>{' '}
                for full details.
              </p>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" aria-label="Contact & Verification" className="space-y-3">
            <AsciiHeading label="CONTACT & VERIFICATION" />
            <div className="rounded-lg border border-slate-200 bg-white/90 p-4 md:p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="text-sm md:text-base">
                <div>
                  <p className="text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                    ► Primary contact
                  </p>
                  <p className="text-slate-700 dark:text-slate-200">
                    Business email:{' '}
                    <a
                      href="mailto:hello@dupreeops.com"
                      onClick={() => trackEmailClick('hello@dupreeops.com')}
                      className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    >
                      hello@dupreeops.com
                    </a>
                  </p>
                  <p className="text-slate-700 dark:text-slate-200">
                    Support email:{' '}
                    <a
                      href="mailto:support@dupreeops.com"
                      onClick={() => trackEmailClick('support@dupreeops.com')}
                      className="text-emerald-700 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    >
                      support@dupreeops.com
                    </a>
                  </p>
                  <p className="mt-2 text-slate-700 dark:text-slate-200">
                    Typical response time: 1–2 business days.
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-slate-50/80 p-3 text-sm md:text-base dark:border-slate-700 dark:bg-slate-950/70">
                <p className="text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                  ► For providers & reviewers
                </p>
                <p className="text-slate-700 dark:text-slate-200">
                  If you are verifying an account, integration, or application associated with
                  Dupree Ops, LLC and require additional documentation, please reach out via the
                  business email above with your reference ID and context. We are happy to confirm
                  ownership of domains, products, and messaging campaigns.
                </p>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer aria-label="Footer">
            <div className="rounded-lg border border-slate-200 bg-white/90 p-4 text-center text-sm md:text-base text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
              <pre className="mb-2 text-xs md:text-sm leading-snug text-emerald-700 dark:text-emerald-400 whitespace-pre font-mono">
{String.raw`╔══════════════════════════════════════════════╗
║        crafted_with_care_by_dupree_ops       ║
╚══════════════════════════════════════════════╝`}
              </pre>
              <p>
                © {new Date().getFullYear()} Dupree Ops, LLC • Built with Next.js & Tailwind CSS
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}

/**
 * ASCII-style section heading (auto-sizes the line to the label length).
 */
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
