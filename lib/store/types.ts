import type {
  Programme,
  Testimonial,
  VideoTestimonial,
  Post,
  SuccessStory,
} from '@/lib/data'

export type { Programme, Testimonial, VideoTestimonial, Post, SuccessStory }

export type Track = 'career' | 'certification' | 'bootcamp'

export type Employer = {
  name: string
  slug: string
}

export type Stat = {
  value: string
  label: string
}

export type NavLink = {
  label: string
  href: string
}

export type FooterGroup = {
  title: string
  links: NavLink[]
}

export type SiteSettings = {
  general: {
    siteName: string
    tagline: string
    description: string
    applicationRedirectEnabled?: boolean
    applicationRedirectUrl?: string
    consultationIframeEnabled?: boolean
    consultationIframeUrl?: string
    booking_widget_url?: string
    downloadBrochureEnabled?: boolean
    downloadBrochureUrl?: string
    privacy_policy_content?: string
    terms_conditions_content?: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  announcement: {
    enabled: boolean
    badge: string
    message: string
    linkLabel: string
    linkHref: string
  }
  header: {
    ctaLabel: string
    ctaHref: string
    simpleNav: NavLink[]
    businessMenu: (NavLink & { desc: string })[]
  }
  footer: {
    description: string
    groups: FooterGroup[]
    legalLinks: NavLink[]
    note: string
    companyLine: string
  }
  social: {
    twitter: string
    linkedin: string
    instagram: string
    youtube: string
    facebook: string
  }
}

/** Applications are for a specific programme — split by track in the admin. */
export type ApplicationStatus = 'new' | 'reviewing' | 'accepted' | 'rejected'

export type ProgrammeApplication = {
  id: string
  track: Track
  programmeSlug: string
  programmeTitle: string
  name: string
  email: string
  phone: string
  message: string
  status: ApplicationStatus
  createdAt: string
  isArchived?: boolean
  paymentPlan?: string
}

/** Contact submissions are a completely separate system from applications. */
export type ContactSource = 'contact' | 'consultation' | 'business'

export type ContactSubmission = {
  id: string
  source: ContactSource
  name: string
  email: string
  /** Free-form key/value details specific to each form source. */
  fields: Record<string, string>
  message: string
  read: boolean
  createdAt: string
  isArchived?: boolean
}

export type HireTalentSubmission = {
  id: string
  name: string
  company: string
  email: string
  numberOfHires: string
  rolesHiringFor: string
  message: string
  status: 'new' | 'archived'
  createdAt: string
}

export type DiscoveryCallSubmission = {
  id: string
  name: string
  company: string
  email: string
  teamSize: string
  trainingArea: string
  message: string
  status: 'new' | 'archived'
  createdAt: string
}
