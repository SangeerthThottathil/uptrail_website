import type { SiteSettings } from './types'

export const defaultSettings: SiteSettings = {
  general: {
    siteName: 'Uptrail',
    tagline: 'Live mentor-led career programmes',
    description:
      'Uptrail runs live, mentor-led career programmes that help graduates and career switchers break into data, business and digital roles. 1500+ learners trained across 55+ countries.',
    applicationRedirectEnabled: false,
    applicationRedirectUrl: '',
    consultationIframeEnabled: false,
    consultationIframeUrl: '',
    booking_widget_url: '',
    downloadBrochureEnabled: false,
    downloadBrochureUrl: '',
    privacy_policy_content: '',
    terms_conditions_content: '',
  },
  contact: {
    email: 'contact@uptrail.co.uk',
    phone: '+44 7350 293596',
    address: '60 Tottenham Court Road, Suite 6001a, Fitzrovia, London, W1T 2EW',
  },
  announcement: {
    enabled: true,
    badge: 'New',
    message:
      'Spring cohort enrolment is now open — secure your place before places fill.',
    linkLabel: 'View programmes',
    linkHref: '/programmes',
  },
  header: {
    ctaLabel: 'Book a Career Consultation',
    ctaHref: '/consultation',
    simpleNav: [
      { label: 'Success Stories', href: '/success-stories' },
      { label: 'Blog', href: '/blog' },
      { label: 'Community', href: '/community' },
      { label: 'About', href: '/about' },
    ],
    businessMenu: [
      {
        label: 'Workforce Training',
        href: '/business',
        desc: 'Upskill your employees through live, expert-led programmes.',
      },
      {
        label: 'Hire Talent',
        href: '/hire',
        desc: 'Access trained, job-ready early-career professionals.',
      },
    ],
  },
  footer: {
    description:
      'Live, mentor-led career programmes helping graduates and career switchers break into data, business and digital roles.',
    groups: [
      {
        title: 'For Business',
        links: [
          { label: 'Workforce Training', href: '/business' },
          { label: 'Corporate Workshops', href: '/business#workshops' },
          { label: 'Hire Talent', href: '/hire' },
          { label: 'Book Discovery Call', href: '/contact' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Success Stories', href: '/success-stories' },
          { label: 'Community', href: '/community' },
          { label: 'About', href: '/about' },
          { label: 'Blog', href: '/blog' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    legalLinks: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    ],
    note: 'Made in the UK',
    companyLine: 'Uptrail Ltd. Registered in England & Wales.',
  },
  social: {
    twitter: 'https://twitter.com/uptrail',
    linkedin: 'https://linkedin.com/company/uptrail',
    instagram: '',
    youtube: '',
    facebook: '',
  },
}
