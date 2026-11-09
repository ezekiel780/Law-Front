import { nodeTokenIssuedAtMs } from '~/services/auth/access'
import {
  clearLatestSessionEvent,
  normalizeSessionEvent,
  readLatestSessionEvent,
  SESSION_CHANNEL,
  SESSION_EVENT_KEY,
  SESSION_TAB_ID,
} from '~/services/auth/session-sync'

export default ({ store, $user, route }) => {
  let handling = false
  let channel = null

  const applyLogout = async (rawEvent) => {
    const event = normalizeSessionEvent(rawEvent)
    if (
      !event ||
      event.source === SESSION_TAB_ID ||
      handling ||
      !$user.getIsLoggedIn()
    )
      return

    const loginTime = Number(store.getters['user/getLoginTime'] || 0)
    const tokenIssuedAt = nodeTokenIssuedAtMs($user.getToken())
    const sessionStartedAt = Math.max(loginTime, tokenIssuedAt)

    // The logout marker is persisted so suspended tabs can see a real logout.
    // Once the user has authenticated again, an older marker must never log a
    // newly opened case tab out of the current session.
    if (sessionStartedAt && event.timestamp < sessionStartedAt) {
      clearLatestSessionEvent()
      return
    }

    handling = true
    try {
      await $user.logout({
        force: true,
        broadcast: false,
        revoke: false,
      })
    } finally {
      handling = false
    }
  }

  const onStorage = (storageEvent) => {
    if (storageEvent.key === SESSION_EVENT_KEY && storageEvent.newValue) {
      void applyLogout(storageEvent.newValue)
    }
  }

  const checkLatest = () => {
    void applyLogout(readLatestSessionEvent())
  }

  window.addEventListener('storage', onStorage)
  window.addEventListener('focus', checkLatest)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkLatest()
  })

  if (typeof window.BroadcastChannel === 'function') {
    channel = new window.BroadcastChannel(SESSION_CHANNEL)
    channel.addEventListener('message', ({ data }) => {
      void applyLogout(data)
    })
  }

  // Covers a tab restored from the browser back-forward cache after another
  // tab has already logged out.
  checkLatest()
}
