export const SESSION_CHANNEL = 'nwlr-auth-session'
export const SESSION_EVENT_KEY = 'nwlr_auth_session_event'
export const SESSION_TAB_ID = `${Date.now()}-${Math.random().toString(36).slice(2)}`

const parseEvent = (value) => {
  try {
    const event = typeof value === 'string' ? JSON.parse(value) : value
    if (!event || event.type !== 'logout' || !Number(event.timestamp)) {
      return null
    }
    return event
  } catch (error) {
    return null
  }
}

export const createLogoutEvent = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  source: SESSION_TAB_ID,
  type: 'logout',
  timestamp: Date.now(),
})

export const readLatestSessionEvent = () => {
  if (typeof window === 'undefined') return null
  return parseEvent(window.localStorage.getItem(SESSION_EVENT_KEY))
}

export const publishLogout = () => {
  if (typeof window === 'undefined') return null

  const event = createLogoutEvent()
  window.localStorage.setItem(SESSION_EVENT_KEY, JSON.stringify(event))

  if (typeof window.BroadcastChannel === 'function') {
    const channel = new window.BroadcastChannel(SESSION_CHANNEL)
    channel.postMessage(event)
    channel.close()
  }

  return event
}


export const clearLatestSessionEvent = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_EVENT_KEY)
}

export const normalizeSessionEvent = parseEvent
