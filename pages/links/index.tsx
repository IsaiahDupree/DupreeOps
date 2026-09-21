import Link from 'next/link'
import SeoHead from '@/components/SeoHead'
import LinkDirectory from '@/components/LinkDirectory'
import { mainHubSections } from '@/data/linkHub'
import { SITE_URL } from '@/lib/seo'

const itemList = mainHubSections.flatMap((section) => section.links).map((item, index) => ({
  '@type': 'ListItem', position: index + 1, name: item.label,
  url: item.url.startsWith('/') ? `${SITE_URL}${item.url}` : item.url,
}))

export default function LinksHub() {
  return <>
    <SeoHead title="Isaiah Dupree & Dupree Ops — Apps, Content and Services" description="One official directory for Isaiah Dupree, Dupree Ops services, apps including EverReach and Sonance, software products, research, and public profiles." path="/links" keywords={['Isaiah Dupree links', 'Dupree Ops products', 'EverReach', 'Sonance apps']} jsonLd={{ '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${SITE_URL}/links#page`, name: 'Isaiah Dupree and Dupree Ops link hub', url: `${SITE_URL}/links`, about: [{ '@id': `${SITE_URL}/#isaiah-dupree` }, { '@id': `${SITE_URL}/#organization` }], mainEntity: { '@type': 'ItemList', itemListElement: itemList } }} />
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <nav className="flex items-center justify-between text-sm"><Link href="/" className="font-medium text-emerald-700 dark:text-emerald-400">Dupree Ops</Link><Link href="/links/isaiah" className="text-slate-600 hover:text-emerald-600 dark:text-slate-300">Isaiah Dupree</Link></nav>
        <header className="py-12 sm:py-16"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">One link. Every project.</p><h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Everything Isaiah and Dupree Ops are building.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">Services, apps, products, research, and official profiles—organized around what you want to do next.</p></header>
        <LinkDirectory sections={mainHubSections} />
        <footer className="mt-14 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800">Official directory operated by Dupree Ops, LLC.</footer>
      </div>
    </main>
  </>
}
