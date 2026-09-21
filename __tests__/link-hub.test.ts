import { brandHubs, getBrandHub, mainHubSections } from '@/data/linkHub'

describe('link hub inventory', () => {
  it('has unique mini-brand slugs', () => {
    const slugs = brandHubs.map((brand) => brand.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs).toEqual(expect.arrayContaining(['isaiah', 'dupree-ops', 'everreach', 'sonance']))
  })

  it('contains no dead legacy product domains', () => {
    const urls = [...mainHubSections, ...brandHubs.flatMap((brand) => brand.sections)].flatMap((section) => section.links.map((link) => link.url))
    expect(urls).not.toContain('https://glowmog.com')
    expect(urls).not.toContain('https://ytquizzes.com')
  })

  it('resolves every configured brand', () => {
    for (const brand of brandHubs) expect(getBrandHub(brand.slug)).toEqual(brand)
  })
})
