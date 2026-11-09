const RECOVERY_KEY = 'nwlr-chunk-load-recovery'
const RECOVERY_WINDOW_MS = 60 * 1000
const RETRY_DELAY_MS = 15 * 1000

const chunkLoadFailed = (error) => {
  const message = String(error && (error.message || error.reason || error))

  return /(?:ChunkLoadError|Loading chunk .* failed|CSS_CHUNK_LOAD_FAILED|Failed to fetch dynamically imported module|error loading dynamically imported module|MIME type .* not executable)/i.test(
    message
  )
}

const recoverOnce = () => {
  const now = Date.now()
  const lastRecovery = Number(window.sessionStorage.getItem(RECOVERY_KEY) || 0)

  if (now - lastRecovery < RECOVERY_WINDOW_MS) return

  window.sessionStorage.setItem(RECOVERY_KEY, String(now))

  window.setTimeout(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('_chunk_retry', String(now))
    window.location.replace(url.toString())
  }, RETRY_DELAY_MS)
}

export default ({ app }) => {
  if (!process.client) return

  app.router.onError((error) => {
    if (chunkLoadFailed(error)) recoverOnce()
  })

  window.addEventListener('unhandledrejection', (event) => {
    if (chunkLoadFailed(event.reason)) recoverOnce()
  })

  app.router.afterEach(() => {
    const url = new URL(window.location.href)
    if (!url.searchParams.has('_chunk_retry')) return

    url.searchParams.delete('_chunk_retry')
    window.history.replaceState({}, document.title, url.toString())
  })
}
