import Link from 'next/link'
import { trackLinkClick } from '@/lib/analytics'
import type { HubSection } from '@/data/linkHub'

export default function LinkDirectory({ sections }: { sections: HubSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.title} aria-labelledby={`section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}>
          <h2 id={`section-${section.title.replace(/\s+/g, '-').toLowerCase()}`} className="text-xl font-semibold">{section.title}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{section.description}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {section.links.map((item) => {
              const classes = `group rounded-xl border p-4 transition hover:-translate-y-0.5 hover:border-emerald-500 ${item.featured ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}`
              const content = <><div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-slate-950 dark:text-white">{item.label}</h3><span aria-hidden="true" className="text-emerald-600 group-hover:translate-x-1 transition">→</span></div><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p></>
              return item.external || item.url.startsWith('mailto:') ? (
                <a key={item.label} href={item.url} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} onClick={() => trackLinkClick(item.url, item.label)} className={classes}>{content}</a>
              ) : (
                <Link key={item.label} href={item.url} onClick={() => trackLinkClick(item.url, item.label)} className={classes}>{content}</Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
