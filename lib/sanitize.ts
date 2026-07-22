import sanitize from 'sanitize-html'

/**
 * Sanitizes HTML content before rendering it on the public site,
 * ensuring safety while allowing rich text elements like formatting,
 * images, tables, links, and video embed iframes.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  return sanitize(html, {
    allowedTags: sanitize.defaults.allowedTags.concat([
      'h1',
      'h2',
      'img',
      'iframe',
      'video',
      'source',
      'section',
      'article',
      'figure',
      'figcaption',
    ]),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      iframe: [
        'src',
        'width',
        'height',
        'allow',
        'allowfullscreen',
        'frameborder',
        'scrolling',
        'style',
        'class',
      ],
      video: ['src', 'controls', 'autoplay', 'loop', 'muted', 'poster', 'width', 'height', 'style', 'class'],
      source: ['src', 'type'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'style', 'class'],
      a: ['href', 'name', 'target', 'rel', 'class'],
      '*': ['style', 'class', 'id'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  })
}

