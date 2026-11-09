export const SESSION_IDLE_TIMEOUT_MS = 8 * 60 * 60 * 1000
export const NODE_TOKEN_PROACTIVE_REFRESH_SECONDS = 60

export const hasIdleSessionExpired = (lastActivityAt, now = Date.now()) => {
  const lastActivity = Number(lastActivityAt || 0)
  if (!lastActivity) return false
  return Math.max(0, Number(now) - lastActivity) >= SESSION_IDLE_TIMEOUT_MS
}
