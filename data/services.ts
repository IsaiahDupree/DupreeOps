export interface Service {
  id: string
  name: string
  price: string
  billingPeriod: 'one-time' | 'monthly'
  description: string
  shortDescription: string
  benefits: string[]
  cta: string
  ctaLink: string
}

export const services: Service[] = [
  {
    id: 'automation-audit',
    name: 'AI Automation Audit',
    price: '$2,500',
    billingPeriod: 'one-time',
    shortDescription: 'Discover automation opportunities in your business',
    description:
      'A comprehensive audit of your current workflows to identify AI and automation opportunities. Perfect for founders and teams looking to streamline operations.',
    benefits: [
      'Full workflow analysis across your business',
      'Prioritized automation roadmap',
      'ROI estimates for each opportunity',
      'Implementation recommendations',
      'Detailed report with next steps',
    ],
    cta: 'Schedule Audit',
    ctaLink: 'mailto:hello@dupreeops.com?subject=AI%20Automation%20Audit%20Inquiry',
  },
  {
    id: 'social-growth',
    name: 'Social Growth System',
    price: '$500',
    billingPeriod: 'monthly',
    shortDescription: 'Systematic growth for your social media presence',
    description:
      'Monthly service to grow your audience and engagement across social platforms. Includes content strategy, posting schedule, and analytics tracking.',
    benefits: [
      'Content calendar & strategy',
      'Audience growth tactics',
      'Monthly analytics report',
      'Engagement optimization',
      'Platform-specific optimization',
    ],
    cta: 'Get Started',
    ctaLink: 'mailto:hello@dupreeops.com?subject=Social%20Growth%20System%20Inquiry',
  },
  {
    id: 'actp-setup',
    name: 'ACTP Setup & Configuration',
    price: '$1,500',
    billingPeriod: 'one-time',
    shortDescription: 'Full Ad Creative Testing Pipeline implementation',
    description:
      'Complete setup and configuration of the ACTP (Ad Creative Testing Pipeline) system for your business. Includes CRM integration, testing frameworks, and analytics setup.',
    benefits: [
      'ACTP system installation',
      'CRM integration',
      'Testing framework setup',
      'Analytics configuration',
      'Team training & documentation',
    ],
    cta: 'Schedule Setup',
    ctaLink: 'mailto:hello@dupreeops.com?subject=ACTP%20Setup%20Inquiry',
  },
]
