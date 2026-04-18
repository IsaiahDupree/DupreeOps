export interface Testimonial {
  id: string
  text: string
  author: string
  title: string
  company?: string
}

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    text: 'The AI Automation Audit helped us identify $200K in annual savings. The implementation roadmap was clear and actionable.',
    author: 'Sarah Chen',
    title: 'CEO',
    company: 'TechFlow Inc',
  },
  {
    id: 'testimonial-2',
    text: "We've seen a 45% increase in social media engagement since implementing the Social Growth System. The analytics insights are invaluable.",
    author: 'Marcus Johnson',
    title: 'Marketing Director',
    company: 'Growth Labs',
  },
  {
    id: 'testimonial-3',
    text: 'The ACTP setup was seamless. Within weeks, we were running sophisticated ad tests and getting real-time insights on creative performance.',
    author: 'Emma Rodriguez',
    title: 'Founder',
    company: 'Digital Ventures',
  },
]
