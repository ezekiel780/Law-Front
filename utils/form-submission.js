let active = null
export function trackFormWrite(request) {
  if (active) active.push(request.then(() => true, () => false))
  return request
}
export async function submitForm(handler) {
  if (active) return false
  const writes = []
  active = writes
  try {
    await handler()
    await new Promise((resolve) => setTimeout(resolve, 0))
    let checked = 0
    let success = true
    while (checked < writes.length) {
      const pending = writes.slice(checked)
      checked += pending.length
      success = (await Promise.all(pending)).every(Boolean) && success
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
    return checked > 0 && success
  } finally { active = null }
}
