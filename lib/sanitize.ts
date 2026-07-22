import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitizes HTML content before rendering it on the public site,
 * ensuring safety while allowing rich text elements like formatting,
 * images, tables, links, and video embed iframes.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe', 'video', 'source'],
    ADD_ATTR: [
      'allow',
      'allowfullscreen',
      'frameborder',
      'scrolling',
      'target',
      'rel',
      'style',
      'class',
      'align',
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-]|$))/i,
  })
}

