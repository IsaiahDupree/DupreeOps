export const SITE_URL = 'https://www.dupreeops.com'

export const ISAIAH_PROFILE_URLS = [
  'https://www.linkedin.com/in/isaiah-dupree33/',
  'https://github.com/IsaiahDupree',
  'https://www.youtube.com/@isaiah_dupree',
  'https://medium.com/@isaiahdupree33',
  'https://x.com/isaiah_dupree',
] as const

export function canonicalUrl(path = '/') {
  const normalizedPath = path === '/' ? '' : `/${path.replace(/^\/+|\/+$/g, '')}`
  return `${SITE_URL}${normalizedPath}`
}

export const isaiahDupreeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#isaiah-dupree`,
  name: 'Isaiah Dupree',
  url: canonicalUrl('/isaiah-dupree'),
  jobTitle: 'Founder and AI Automation Engineer',
  description:
    'Isaiah Dupree is an aerospace engineer, software builder, and founder of Dupree Ops, LLC, focused on AI automation systems and practical software products.',
  worksFor: { '@id': `${SITE_URL}/#organization` },
  sameAs: [...ISAIAH_PROFILE_URLS],
}

export const dupreeOpsSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Dupree Ops, LLC',
  url: SITE_URL,
  founder: { '@id': `${SITE_URL}/#isaiah-dupree` },
  email: 'hello@dupreeops.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3425 Delaney Drive',
    addressLocality: 'Melbourne',
    addressRegion: 'FL',
    postalCode: '32934',
    addressCountry: 'US',
  },
}

export const dupreeOpsWebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Dupree Ops',
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
}
