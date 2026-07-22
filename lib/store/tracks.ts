import type { Track } from './types'

export type TrackSegment = 'career' | 'certifications' | 'bootcamps'

type TrackMeta = {
  segment: TrackSegment
  track: Track
  label: string
  singular: string
  description: string
  /** Feature flags for track-specific fields in the editor. */
  hasPrice: boolean
  hasCertifications: boolean
  hasModuleTakeaways: boolean
}

export const TRACKS: Record<TrackSegment, TrackMeta> = {
  career: {
    segment: 'career',
    track: 'career',
    label: 'Career Programmes',
    singular: 'Career Programme',
    description:
      'Long-form, job-guaranteed pathways. These carry pricing, certifications and detailed module takeaways.',
    hasPrice: true,
    hasCertifications: true,
    hasModuleTakeaways: true,
  },
  certifications: {
    segment: 'certifications',
    track: 'certification',
    label: 'Certifications',
    singular: 'Certification',
    description:
      'Certification-focused programmes with live mentoring and exam prep. These list the certifications earned.',
    hasPrice: false,
    hasCertifications: true,
    hasModuleTakeaways: false,
  },
  bootcamps: {
    segment: 'bootcamps',
    track: 'bootcamp',
    label: 'Bootcamps',
    singular: 'Bootcamp',
    description:
      'Short, intensive, hands-on bootcamps focused on practical skills and a portfolio project.',
    hasPrice: false,
    hasCertifications: false,
    hasModuleTakeaways: false,
  },
}

export const TRACK_SEGMENTS = Object.keys(TRACKS) as TrackSegment[]

export function getTrackMeta(segment: string): TrackMeta | undefined {
  return TRACKS[segment as TrackSegment]
}

export function trackToSegment(track: Track): TrackSegment {
  if (track === 'certification') return 'certifications'
  if (track === 'bootcamp') return 'bootcamps'
  return 'career'
}
