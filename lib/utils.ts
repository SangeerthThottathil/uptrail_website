import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const TRUSTED_VIDEO_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'vimeo.com',
  'trustpilot.com',
  'www.trustpilot.com',
  'widgets.senja.io',
  'senja.io',
  'instagram.com',
  'facebook.com',
  'twitter.com',
  'linkedin.com',
  'www.linkedin.com',
  'tiktok.com',
]

/**
 * Extracts width and height attributes from an iframe string
 */
export function extractIframeDimensions(html: string): { width?: string; height?: string } {
  const trimmed = (html || '').trim()
  if (!trimmed.includes('<iframe')) return { width: undefined, height: undefined }

  const attrsMatch = trimmed.match(/<iframe\b([\s\S]*?)(?:>|\/>)/i)
  if (!attrsMatch) return { width: undefined, height: undefined }

  const attrsString = attrsMatch[1]

  const widthMatch = attrsString.match(/\bwidth\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)
  const heightMatch = attrsString.match(/\bheight\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)

  const width = widthMatch ? (widthMatch[1] || widthMatch[2] || widthMatch[3]) : undefined
  const height = heightMatch ? (heightMatch[1] || heightMatch[2] || heightMatch[3]) : undefined

  return { width, height }
}

/**
 * Parses and sanitizes an iframe embed code, validating it against an allowlist
 * of trusted domains and stripping unwanted tags, scripts, and attributes (like width/height).
 */
export function sanitizeEmbedCode(
  html: string,
  options?: {
    keepDimensions?: boolean
    overrideWidth?: string
    overrideHeight?: string
  }
): string {
  let trimmed = (html || '').trim()
  if (!trimmed) return ''

  // Fallback for legacy MP4 URLs during transition
  if (trimmed.startsWith('http') && (trimmed.endsWith('.mp4') || trimmed.includes('gtv-videos-bucket'))) {
    return trimmed
  }

  // Handle raw URLs pasted into iframe field
  if (trimmed.startsWith('http') && !trimmed.includes('<iframe')) {
    let embedUrl = trimmed
    if (trimmed.includes('youtube.com/watch')) {
      const match = trimmed.match(/v=([a-zA-Z0-9_-]+)/)
      if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`
    } else if (trimmed.includes('youtu.be/')) {
      const match = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
      if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`
    } else if (trimmed.includes('vimeo.com/') && !trimmed.includes('player.vimeo.com')) {
      const match = trimmed.match(/vimeo\.com\/(\d+)/)
      if (match) embedUrl = `https://player.vimeo.com/video/${match[1]}`
    }
    trimmed = `<iframe src="${embedUrl}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`
  }

  // Lenient match for iframe tag (handles tabs, newlines, and self-closing tags)
  const iframeRegex = /<iframe\b([\s\S]*?)(?:>([\s\S]*?)<\/iframe>|>|\/>)/i
  const match = trimmed.match(iframeRegex)
  if (!match) {
    throw new Error('Invalid embed code: Must contain an <iframe>...</iframe> tag.')
  }

  const attrsString = match[1]

  // Extract src attribute (lenient on spaces around '=')
  const srcMatch = attrsString.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)
  if (!srcMatch || !(srcMatch[1] || srcMatch[2] || srcMatch[3])) {
    throw new Error('Invalid embed code: <iframe> must have a valid src attribute.')
  }

  let src = srcMatch[1] || srcMatch[2] || srcMatch[3]

  // Convert watch/share URLs inside src if needed
  if (src.includes('youtube.com/watch')) {
    const m = src.match(/v=([a-zA-Z0-9_-]+)/)
    if (m) src = `https://www.youtube.com/embed/${m[1]}`
  } else if (src.includes('youtu.be/')) {
    const m = src.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
    if (m) src = `https://www.youtube.com/embed/${m[1]}`
  }

  // Validate trusted domains
  let hostname = ''
  try {
    const url = new URL(src)
    hostname = url.hostname.toLowerCase()
    const isTrusted = TRUSTED_VIDEO_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith('.' + domain)
    )
    if (!isTrusted) {
      throw new Error(`Domain not trusted: ${hostname}. Only YouTube and Vimeo are allowed.`)
    }
  } catch (err: any) {
    throw new Error(err.message || 'Invalid src URL in embed code.')
  }

  // Filter allowed attributes: src, allow, allowfullscreen, title
  const cleanAttrs: string[] = [`src="${src}"`]

  const extractAndKeepAttr = (name: string) => {
    const regex = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i')
    const m = attrsString.match(regex)
    if (m) {
      const val = m[1] || m[2] || m[3] || ''
      cleanAttrs.push(`${name}="${val}"`)
    }
  }

  extractAndKeepAttr('allow')
  extractAndKeepAttr('title')

  if (!cleanAttrs.some(a => a.startsWith('allow='))) {
    cleanAttrs.push('allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"')
  }

  if (/\ballowfullscreen\b/i.test(attrsString) || !cleanAttrs.includes('allowfullscreen')) {
    cleanAttrs.push('allowfullscreen')
  }

  if (options?.overrideWidth && options?.overrideHeight) {
    cleanAttrs.push(`width="${options.overrideWidth}"`)
    cleanAttrs.push(`height="${options.overrideHeight}"`)
  } else if (options?.keepDimensions) {
    extractAndKeepAttr('width')
    extractAndKeepAttr('height')
  } else {
    const isLinkedIn = hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com')
    if (isLinkedIn) {
      const heightMatch = attrsString.match(/\bheight\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)
      const heightVal = heightMatch ? (heightMatch[1] || heightMatch[2] || heightMatch[3]) : '580'
      cleanAttrs.push(`height="${heightVal}"`)
      cleanAttrs.push('width="100%"')
    }
  }

  cleanAttrs.push('scrolling="no"')
  cleanAttrs.push('style="overflow:hidden;"')

  return `<iframe ${cleanAttrs.join(' ')}></iframe>`
}
