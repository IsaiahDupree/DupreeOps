import {
  ISAIAH_PROFILE_URLS,
  SITE_URL,
  ISAIAH_ENTITY_ID,
  canonicalUrl,
  dupreeOpsSchema,
  isaiahDupreeSchema,
} from '@/lib/seo'

describe('SEO identity graph', () => {
  it('uses the public www host for canonical URLs', () => {
    expect(SITE_URL).toBe('https://www.dupreeops.com')
    expect(canonicalUrl()).toBe('https://www.dupreeops.com')
    expect(canonicalUrl('/services/')).toBe('https://www.dupreeops.com/services')
  })

  it('connects Isaiah Dupree to Dupree Ops and verified profiles', () => {
    expect(isaiahDupreeSchema.name).toBe('Isaiah Dupree')
    expect(isaiahDupreeSchema['@id']).toBe('https://isaiahdupree.com/#person')
    expect(isaiahDupreeSchema.url).toBe('https://isaiahdupree.com/')
    expect(ISAIAH_ENTITY_ID).toBe('https://isaiahdupree.com/#person')
    expect(isaiahDupreeSchema.worksFor).toEqual({
      '@id': 'https://www.dupreeops.com/#organization',
    })
    expect(dupreeOpsSchema.founder).toEqual({
      '@id': 'https://isaiahdupree.com/#person',
    })
    expect(ISAIAH_PROFILE_URLS).toContain('https://www.linkedin.com/in/isaiah-dupree33/')
    expect(ISAIAH_PROFILE_URLS).toContain('https://x.com/isaiah_dupree')
    expect(ISAIAH_PROFILE_URLS).not.toContain('https://x.com/isaiahdupree33')
  })
})
