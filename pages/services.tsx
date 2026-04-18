import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import { trackThemeToggle, trackLinkClick } from '@/lib/analytics'
import { services } from '@/data/services'

export default function Services() {
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
        <title>Services • Dupree Ops, LLC</title>
        <meta
          name="description"
          content="Professional services: AI Automation Audit, Social Growth System, and ACTP Setup"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
        />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
      </Head>

      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-10 space-y-6 sm:space-y-8">
          {/* Header with navigation and theme toggle */}
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

          {/* Title section */}
          <div className="rounded-lg border border-slate-200 bg-white/90 p-4 sm:p-5 md:p-6 dark:border-slate-800 dark:bg-slate-900/70">
            <AsciiHeading label="SERVICES" />
            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
              Professional services to help your business scale with AI and automation.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* CTA Section */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 md:p-6 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <p className="text-sm sm:text-base md:text-lg text-emerald-700 dark:text-emerald-400 mb-3 font-semibold">
              ► Questions? Let's talk
            </p>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 mb-4">
              Interested in one of our services or have questions about your specific needs? Reach out
              to discuss your project.
            </p>
            <a
              href="mailto:hello@dupreeops.com"
              onClick={() => trackLinkClick('mailto:hello@dupreeops.com', 'Contact email')}
              className="inline-flex items-center justify-center rounded-full border border-emerald-600 bg-emerald-600 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white shadow-sm active:bg-emerald-700 hover:bg-emerald-700 dark:border-emerald-400 dark:bg-emerald-500 dark:active:bg-emerald-600 dark:hover:bg-emerald-600 transition-colors touch-manipulation min-h-[44px]"
            >
              Send an email
            </a>
          </div>
        </div>
      </main>
    </>
  )
}

interface ServiceCardProps {
  service: (typeof services)[number]
}

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/90 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/70 flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
          {service.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {service.price}
          </span>
          {service.billingPeriod === 'monthly' && (
            <span className="text-sm text-slate-600 dark:text-slate-300">/month</span>
          )}
        </div>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {service.shortDescription}
        </p>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 mb-4 leading-relaxed">
        {service.description}
      </p>

      {/* Benefits */}
      <div className="mb-4 flex-grow">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
          What's included:
        </p>
        <ul className="space-y-2">
          {service.benefits.map((benefit, idx) => (
            <li key={idx} className="text-sm text-slate-700 dark:text-slate-200 flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 flex-shrink-0">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <a
        href={service.ctaLink}
        onClick={() => trackLinkClick(service.ctaLink, service.name)}
        className="inline-flex items-center justify-center rounded-lg border border-slate-900 bg-slate-900 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-medium text-white shadow-sm active:bg-black hover:bg-black dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:active:bg-white dark:hover:bg-white transition-colors touch-manipulation min-h-[44px]"
      >
        {service.cta}
      </a>
    </div>
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
