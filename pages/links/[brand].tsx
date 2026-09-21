import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import SeoHead from '@/components/SeoHead'
import LinkDirectory from '@/components/LinkDirectory'
import { brandHubs, getBrandHub, type BrandHub } from '@/data/linkHub'
import { SITE_URL } from '@/lib/seo'

export const getStaticPaths: GetStaticPaths = async () => ({ paths: brandHubs.map((brand) => ({ params: { brand: brand.slug } })), fallback: false })
export const getStaticProps: GetStaticProps<{ brand: BrandHub }> = async ({ params }) => {
  const brand = getBrandHub(String(params?.brand || ''))
  return brand ? { props: { brand } } : { notFound: true }
}

export default function BrandLinks({ brand }: { brand: BrandHub }) {
  const links = brand.sections.flatMap((section) => section.links)
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${SITE_URL}/links/${brand.slug}#page`, name: `${brand.name} official links`, url: `${SITE_URL}/links/${brand.slug}`, description: brand.description, isPartOf: { '@id': `${SITE_URL}/links#page` }, mainEntity: { '@type': 'ItemList', itemListElement: links.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, url: item.url.startsWith('/') ? `${SITE_URL}${item.url}` : item.url })) } }
  return <><SeoHead title={`${brand.name} — Official Links`} description={brand.description} path={`/links/${brand.slug}`} keywords={[brand.name, `${brand.name} links`, 'Isaiah Dupree', 'Dupree Ops']} jsonLd={schema} /><main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"><div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16"><nav className="text-sm"><Link href="/links" className="font-medium text-emerald-700 dark:text-emerald-400">← All links</Link></nav><header className="py-12"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">{brand.eyebrow}</p><h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{brand.name}</h1><p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{brand.description}</p></header><LinkDirectory sections={brand.sections} /><footer className="mt-14 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800"><Link href="/links" className="hover:text-emerald-600">Explore every Dupree Ops brand →</Link></footer></div></main></>
}
