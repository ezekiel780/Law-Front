export const SEARCH_HISTORY_KEY = 'nwlr_search_history_v1'
export const SEARCH_HISTORY_MAX = 100

function canUseStorage() {
  return typeof window !== 'undefined' && window.localStorage
}

function normalizeValue(v) {
  if (v === null || v === undefined) return ''
  return String(v).trim()
}

function normalizePayload(payload = {}) {
  const search_term = normalizeValue(payload.search_term)

  // normalize placeholders/defaults into empty (so they don't create "different" records)
  const case_type = ['default'].includes(normalizeValue(payload.case_type))
    ? ''
    : normalizeValue(payload.case_type)
  const match = ['best_fields'].includes(normalizeValue(payload.match))
    ? ''
    : normalizeValue(payload.match)
  const sort = ['default'].includes(normalizeValue(payload.sort))
    ? ''
    : normalizeValue(payload.sort)

  const start_date = ['dd/mm/yyyy'].includes(normalizeValue(payload.start_date))
    ? ''
    : normalizeValue(payload.start_date)
  const end_date = ['dd/mm/yyyy'].includes(normalizeValue(payload.end_date))
    ? ''
    : normalizeValue(payload.end_date)

  const court = normalizeValue(payload.court)
  const division = normalizeValue(payload.division)
  const justice = normalizeValue(payload.justice)
  const counsel = normalizeValue(payload.counsel)
  const parties = normalizeValue(payload.parties)

  return {
    search_term,
    case_type,
    match,
    sort,
    start_date,
    end_date,
    court,
    division,
    justice,
    counsel,
    parties,
  }
}

function makeSignature(normalized) {
  // "unique" definition: same search term + same filter combo (case-insensitive signature)
  const parts = [
    normalized.search_term,
    normalized.case_type,
    normalized.match,
    normalized.sort,
    normalized.start_date,
    normalized.end_date,
    normalized.court,
    normalized.division,
    normalized.justice,
    normalized.counsel,
    normalized.parties,
  ].map((x) => normalizeValue(x).toLowerCase())

  return parts.join('||')
}

function readHistory() {
  if (!canUseStorage()) return []
  try {
    const raw = window.localStorage.getItem(SEARCH_HISTORY_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

function writeHistory(items) {
  if (!canUseStorage()) return
  try {
    window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(items))
  } catch (e) {
    // ignore quota/blocked storage
  }
}

export function getSearchHistory() {
  return readHistory()
}

export function addSearchHistory(payload) {
  const normalized = normalizePayload(payload)

  // ignore empty searches
  if (!normalized.search_term) return readHistory()

  const id = makeSignature(normalized)
  const now = new Date().toISOString()

  const record = {
    id,
    ...normalized,
    created_at: now,
  }

  const current = readHistory()
  const withoutDup = current.filter((x) => x && x.id !== id)

  // newest first
  const next = [record, ...withoutDup].slice(0, SEARCH_HISTORY_MAX)

  writeHistory(next)
  return next
}

export function removeSearchHistory(id) {
  if (!id) return readHistory()
  const next = readHistory().filter((x) => x && x.id !== id)
  writeHistory(next)
  return next
}

export function clearSearchHistory() {
  writeHistory([])
  return []
}

export function buildLegalResearchQuery(record = {}) {
  // build route query to match Search.vue mount() reader
  const q = {}

  const put = (k, v) => {
    const val = normalizeValue(v)
    if (!val) return
    q[k] = val
  }

  put('search_term', record.search_term)
  put('case_type', record.case_type)
  put('match', record.match)
  put('sort', record.sort)
  put('start_date', record.start_date)
  put('end_date', record.end_date)
  put('court', record.court)
  put('division', record.division)
  put('justice', record.justice)
  put('counsel', record.counsel)
  put('parties', record.parties)

  return q
}
