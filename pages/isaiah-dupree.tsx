import Link from 'next/link'
import SeoHead from '@/components/SeoHead'
import { useTheme } from '@/hooks/useTheme'
import { trackLinkClick, trackThemeToggle } from '@/lib/analytics'
import { SITE_URL, isaiahDupreeSchema } from '@/lib/seo'

const profiles = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/isaiah-dupree33/' },
  { label: 'GitHub', url: 'https://github.com/IsaiahDupree' },
  { label: 'YouTube', url: 'https://www.youtube.com/@isaiah_dupree' },
  { label: 'Medium', url: 'https://medium.com/@isaiahdupree33' },
  { label: 'X', url: 'https://x.com/isaiah_dupree' },
]

const selectedWork = [
  {
    name: 'ResearchForge',
    url: 'https://www.researchforge.app',
    description: 'Tested engineering calculators, source-backed articles, and reproduced research.',
  },
  {
    name: 'Strategy Thread',
    url: 'https://www.strategythread.app',
    description: 'Source-attributed research on AI automation, SaaS growth, and creator systems.',
  },
  {
    name: 'Dupree Ops',
    url: SITE_URL,
    description: 'The software and AI automation studio Isaiah founded and operates.',
  },
]

const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/isaiah-dupree#profile-page`,
  url: `${SITE_URL}/isaiah-dupree`,
  name: 'About Isaiah Dupree',
  mainEntity: { '@id': `${SITE_URL}/#isaiah-dupree` },
  isPartOf: { '@id': `${SITE_URL}/#website` },
}

export default function IsaiahDupreeProfile() {
  const { theme, toggleTheme } = useTheme()

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    toggleTheme()
    trackThemeToggle(newTheme)
  }

  return (
    <>
      <SeoHead
        title="About Isaiah Dupree | Engineer, Software Builder & Founder"
        description="Official profile of Isaiah Dupree, an aerospace engineer, software builder, and founder of Dupree Ops, LLC focused on practical AI automation systems."
        path="/isaiah-dupree"
        keywords={[
          'Isaiah Dupree',
          'Isaiah Dupree engineer',
          'Isaiah Dupree AI automation',
          'Dupree Ops founder',
        ]}
        jsonLd={[isaiahDupreeSchema, profilePageSchema]}
      />

      <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 md:py-12">
          <nav className="flex items-center justify-between gap-4 text-sm">
            <Link
              href="/"
              onClick={() => trackLinkClick('/', 'Back to Dupree Ops')}
              className="font-medium text-emerald-700 hover:text-emerald-500 dark:text-emerald-400"
            >
              ← Dupree Ops
            </Link>
            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="min-h-[44px] rounded-full border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              {theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode'}
            </button>
          </nav>

          <article className="space-y-8">
            <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Official profile
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Isaiah Dupree
              </h1>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
                Aerospace engineer, software builder, and founder of Dupree Ops, LLC
              </p>
              <p className="mt-6 max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-200">
                Isaiah builds AI automation systems and software products that turn complex,
                repetitive workflows into reliable operating systems. His work spans engineering
                tools, research publishing, content operations, and practical SaaS products.
              </p>
            </header>

            <section aria-labelledby="focus" className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 id="focus" className="text-2xl font-semibold">Areas of focus</h2>
              <ul className="mt-4 grid gap-3 text-slate-700 dark:text-slate-200 sm:grid-cols-2">
                <li>AI agents and workflow automation</li>
                <li>Web and mobile software products</li>
                <li>Engineering calculators and research tools</li>
                <li>Content, growth, and analytics systems</li>
              </ul>
            </section>

            <section aria-labelledby="work" className="space-y-4">
              <h2 id="work" className="text-2xl font-semibold">Selected work</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {selectedWork.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target={item.url === SITE_URL ? undefined : '_blank'}
                    rel={item.url === SITE_URL ? undefined : 'noreferrer'}
                    onClick={() => trackLinkClick(item.url, item.name)}
                    className="rounded-xl border border-slate-200 bg-white p-5 hover:border-emerald-500 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">{item.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </a>
                ))}
              </div>
            </section>

            <section aria-labelledby="profiles" className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 id="profiles" className="text-2xl font-semibold">Official profiles</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                These profiles belong to the same Isaiah Dupree represented on this page.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {profiles.map((profile) => (
                  <a
                    key={profile.url}
                    href={profile.url}
                    target="_blank"
                    rel="me noreferrer"
                    onClick={() => trackLinkClick(profile.url, profile.label)}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:border-emerald-500 dark:border-slate-700"
                  >
                    {profile.label}
                  </a>
                ))}
              </div>
            </section>

            <section aria-labelledby="contact" className="rounded-xl border border-emerald-300 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
              <h2 id="contact" className="text-2xl font-semibold">Work with Isaiah</h2>
              <p className="mt-2 text-slate-700 dark:text-slate-200">
                For AI automation projects, software partnerships, or product support, use the
                official Dupree Ops contact page.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
              >
                Contact Isaiah Dupree
              </Link>
            </section>
          </article>
        </div>
      </main>
    </>
  )
}
