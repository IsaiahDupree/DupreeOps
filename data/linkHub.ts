export type HubLink = {
  label: string
  description: string
  url: string
  external?: boolean
  featured?: boolean
}

export type HubSection = {
  title: string
  description: string
  links: HubLink[]
}

export type BrandHub = {
  slug: string
  name: string
  eyebrow: string
  description: string
  accent: string
  sections: HubSection[]
}

export const mainHubSections: HubSection[] = [
  {
    title: 'Work with us',
    description: 'Start with the commercial offers that fund and inform the products.',
    links: [
      { label: 'AI automation services', description: 'Audits, implementation, and operating systems for growing businesses.', url: '/services', featured: true },
      { label: 'Contact Dupree Ops', description: 'Discuss a workflow, partnership, or software project.', url: '/contact' },
    ],
  },
  {
    title: 'Apps and products',
    description: 'Software products operated by Isaiah Dupree and Dupree Ops.',
    links: [
      { label: 'EverReach', description: 'AI personal CRM for thoughtful, timely follow-up.', url: '/links/everreach', featured: true },
      { label: 'Sonance', description: 'Private, native Mac audio tools.', url: '/links/sonance', featured: true },
      { label: 'ResearchForge', description: 'Engineering calculators and source-backed research.', url: 'https://www.researchforge.app', external: true },
      { label: 'TechMeStuff', description: 'Practical engineering calculators and tools.', url: 'https://techmestuff.com', external: true },
      { label: 'MatrixLoop', description: 'Analytics and coaching for social growth workflows.', url: 'https://www.matrixloop.app/connect', external: true },
    ],
  },
  {
    title: 'Content and research',
    description: 'Long-form thinking, practical systems, and build notes.',
    links: [
      { label: 'Strategy Thread', description: 'Source-attributed research on AI, SaaS, and creator systems.', url: 'https://www.strategythread.app', external: true },
      { label: 'ResearchForge articles', description: 'Engineering explanations grounded in tested calculations.', url: 'https://www.researchforge.app/articles', external: true },
      { label: 'YouTube', description: 'Videos from Isaiah Dupree.', url: 'https://www.youtube.com/@isaiah_dupree', external: true },
      { label: 'Medium', description: 'Writing and essays from Isaiah Dupree.', url: 'https://medium.com/@isaiahdupree33', external: true },
    ],
  },
  {
    title: 'People and company',
    description: 'Official identity, company, portfolio, and social profiles.',
    links: [
      { label: 'Isaiah Dupree', description: 'Official profile and personal links.', url: '/links/isaiah', featured: true },
      { label: 'Dupree Ops', description: 'Company, services, and operating information.', url: '/links/dupree-ops' },
      { label: 'Software portfolio', description: 'Selected applications, systems, and case studies.', url: 'https://portfolio.dupreeops.com', external: true },
    ],
  },
]

export const brandHubs: BrandHub[] = [
  {
    slug: 'isaiah', name: 'Isaiah Dupree', eyebrow: 'Founder · engineer · builder', accent: 'emerald',
    description: 'The official starting point for Isaiah Dupree’s work, writing, software, and public profiles.',
    sections: [
      { title: 'Start here', description: 'Official identity and work.', links: [
        { label: 'Official profile', description: 'Biography, focus areas, and verified profiles.', url: '/isaiah-dupree', featured: true },
        { label: 'Software portfolio', description: 'Projects, systems, and case studies.', url: 'https://portfolio.dupreeops.com', external: true },
        { label: 'Work with Isaiah', description: 'AI automation and software services.', url: '/services' },
      ]},
      { title: 'Follow and read', description: 'Public channels belonging to the same Isaiah Dupree.', links: [
        { label: 'LinkedIn', description: 'Professional posts and updates.', url: 'https://www.linkedin.com/in/isaiah-dupree33/', external: true },
        { label: 'YouTube', description: 'Video essays, demos, and tutorials.', url: 'https://www.youtube.com/@isaiah_dupree', external: true },
        { label: 'X', description: 'Short-form ideas and build notes.', url: 'https://x.com/isaiah_dupree', external: true },
        { label: 'GitHub', description: 'Public software repositories.', url: 'https://github.com/IsaiahDupree', external: true },
        { label: 'Medium', description: 'Articles and essays.', url: 'https://medium.com/@isaiahdupree33', external: true },
      ]},
    ],
  },
  {
    slug: 'dupree-ops', name: 'Dupree Ops', eyebrow: 'AI and software studio', accent: 'emerald',
    description: 'Services, products, proof, and official company information from Dupree Ops, LLC.',
    sections: [
      { title: 'Work with Dupree Ops', description: 'Choose the next useful step.', links: [
        { label: 'AI automation services', description: 'Review available audits, builds, and growth systems.', url: '/services', featured: true },
        { label: 'Contact', description: 'Discuss a project or partnership.', url: '/contact' },
        { label: 'Case studies and portfolio', description: 'See the systems and products we have built.', url: 'https://portfolio.dupreeops.com/case-studies', external: true },
      ]},
      { title: 'Company', description: 'Official operating information.', links: [
        { label: 'Dupree Ops home', description: 'Company overview and product portfolio.', url: '/' },
        { label: 'Isaiah Dupree', description: 'Founder profile.', url: '/links/isaiah' },
      ]},
    ],
  },
  {
    slug: 'everreach', name: 'EverReach', eyebrow: 'AI personal CRM', accent: 'violet',
    description: 'Keep important relationships warm with timely reminders and personalized message suggestions.',
    sections: [
      { title: 'Get EverReach', description: 'Use EverReach on the web or download the app.', links: [
        { label: 'EverReach website', description: 'See how EverReach works and start free.', url: 'https://www.everreach.app/', external: true, featured: true },
        { label: 'Download on the App Store', description: 'Install EverReach on iPhone.', url: 'https://apps.apple.com/us/app/everreach/id6753190951', external: true },
      ]},
      { title: 'Company and support', description: 'Official ownership and help links.', links: [
        { label: 'EverReach privacy', description: 'Read the privacy policy.', url: 'https://www.everreach.app/privacy-policy', external: true },
        { label: 'Contact Dupree Ops', description: 'Product and account support.', url: '/contact' },
      ]},
    ],
  },
  {
    slug: 'sonance', name: 'Sonance', eyebrow: 'Private Mac audio tools', accent: 'cyan',
    description: 'Native Mac utilities for equalizing, mixing, recording, and improving audio without complicated drivers.',
    sections: [
      { title: 'Sonance suite', description: 'Explore the complete collection.', links: [
        { label: 'All Sonance apps', description: 'The official Mac utility collection.', url: 'https://isaiahdupree.github.io/sonance-apps/', external: true, featured: true },
        { label: 'Sonance EQ', description: 'System-wide equalizer for Mac.', url: 'https://apps.apple.com/us/app/sonance-eq/id6782463839', external: true },
        { label: 'Sonance Mixer', description: 'Per-app volume, mute, and output routing.', url: 'https://apps.apple.com/us/app/sonance-mixer/id6787488996', external: true },
        { label: 'Sonance Recorder', description: 'Record system or single-app audio.', url: 'https://apps.apple.com/us/app/sonance-recorder/id6787489259', external: true },
        { label: 'Sonance Voice', description: 'Real-time microphone enhancement.', url: 'https://apps.apple.com/us/app/sonance-voice/id6787489282', external: true },
      ]},
      { title: 'Help and ownership', description: 'Support and official creator information.', links: [
        { label: 'Sonance support', description: 'Setup guides, FAQs, and privacy information.', url: 'https://isaiahdupree.github.io/sonance-apps/', external: true },
        { label: 'Built by Isaiah Dupree', description: 'Official creator profile.', url: '/links/isaiah' },
      ]},
    ],
  },
]

export function getBrandHub(slug: string) {
  return brandHubs.find((brand) => brand.slug === slug)
}
