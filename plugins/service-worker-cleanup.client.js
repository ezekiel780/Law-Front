const CLEANUP_VERSION = 'nwlr-service-worker-cleanup-v1'

export default async () => {
  if (!process.client) return

  try {
    if (window.localStorage.getItem(CLEANUP_VERSION) === 'done') return

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(
        registrations.map((registration) => registration.unregister())
      )
    }

    if ('caches' in window) {
      const cacheNames = await window.caches.keys()
      await Promise.all(
        cacheNames
          .filter((name) => /(?:workbox|nuxt|nwlr)/i.test(name))
          .map((name) => window.caches.delete(name))
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[pwa-cleanup] Unable to clear legacy service-worker state',
        error
      )
    }
  } finally {
    try {
      window.localStorage.setItem(CLEANUP_VERSION, 'done')
    } catch (_) {}
  }
}
