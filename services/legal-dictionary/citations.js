const CASE_ID_PATTERN = /^\d+_1_\d+$/
const CASE_QUERY_KEYS = [
  'case',
  'case_id',
  'caseId',
  'book',
  'book_id',
  'bookId',
  'PiDxpln',
  'pid',
]
const CASE_PATH_MARKERS = [
  'legal-research/',
  'load-case/',
  'case-document/',
]

const firstValue = (...values) => {
  const found = values.find(
    (value) => value !== undefined && value !== null && value !== ''
  )
  return found === undefined || found === null ? '' : found
}

export const normalizeCitation = (citation) => {
  if (!citation) return null

  if (typeof citation === 'string') {
    return {
      text: citation,
      hyperlink: '',
      caseId: '',
    }
  }

  const hyperlink = String(
    firstValue(
      citation.citationLink,
      citation.hyperlink,
      citation.link,
      citation.url,
      ''
    )
  )

  return {
    ...citation,
    text: String(
      firstValue(
        citation.citationText,
        citation.text,
        citation.citation,
        citation.title,
        extractAnchorText(hyperlink),
        ''
      )
    ),
    hyperlink,
    caseId: String(
      firstValue(
        citation.caseId,
        citation.case_id,
        citation.bookId,
        citation.book_id,
        citation.PiDxpln,
        citation.pid,
        ''
      )
    ),
  }
}

export const extractCitationHref = (value) => {
  const source = String(value || '').trim()
  if (!source) return ''

  const match = source.match(/href=["']([^"']+)["']/i)
  return String(match ? match[1] : source).trim()
}

const extractAnchorText = (value) => {
  const source = String(value || '').trim()
  if (!source) return ''

  const match = source.match(/<a\b[^>]*>([\s\S]*?)<\/a>/i)
  if (!match) return ''

  return match[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim()
}

const safeDecodeURIComponent = (value) => {
  try {
    return decodeURIComponent(value)
  } catch (_) {
    return value
  }
}

const canonicalCaseId = (value) => {
  const decoded = safeDecodeURIComponent(String(value || '').trim())
  return CASE_ID_PATTERN.test(decoded) ? decoded : ''
}

export const extractCaseId = (citation) => {
  const normalized = normalizeCitation(citation)
  if (!normalized) return ''

  const direct = canonicalCaseId(normalized.caseId)
  if (direct) return direct

  const href = extractCitationHref(normalized.hyperlink)
  if (!href) return ''

  try {
    const parsed = new URL(href, 'https://nwlronline.local')

    for (const key of CASE_QUERY_KEYS) {
      const fromQuery = canonicalCaseId(parsed.searchParams.get(key))
      if (fromQuery) return fromQuery
    }
  } catch (_) {
    // Fall through to path parsing for malformed legacy links.
  }

  const cleanHref = href.replace(/[#?].*$/, '')
  const lowerHref = cleanHref.toLowerCase()

  for (const marker of CASE_PATH_MARKERS) {
    const position = lowerHref.lastIndexOf(marker)
    if (position === -1) continue

    const segment = cleanHref.slice(position + marker.length).split('/')[0]
    const fromPath = canonicalCaseId(segment)
    if (fromPath) return fromPath
  }

  const pathSegments = cleanHref.split('/').filter(Boolean).reverse()
  for (const segment of pathSegments) {
    const fromSegment = canonicalCaseId(segment)
    if (fromSegment) return fromSegment
  }

  return ''
}

export const isSafeCitationHref = (value) => {
  const href = extractCitationHref(value)
  if (!href) return false
  if (href.startsWith('/')) return true

  const lower = href.toLowerCase()
  return lower.startsWith('http://') || lower.startsWith('https://')
}

export const citationDestination = (citation) => {
  const normalized = normalizeCitation(citation)
  if (!normalized) return null

  const caseId = extractCaseId(normalized)
  if (caseId) {
    return {
      href: `/dashboard/legal-research/${encodeURIComponent(caseId)}`,
      external: false,
      caseId,
    }
  }

  const href = extractCitationHref(normalized.hyperlink)
  if (!isSafeCitationHref(href)) return null

  return {
    href,
    external: /^https?:\/\//i.test(href),
    caseId: '',
  }
}
