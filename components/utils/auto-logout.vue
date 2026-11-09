<template>
  <div
    v-show="autoLogoutWarning && isAuthenticated && !isInstitutionalSession"
    class="sticky top-0 z-40 my-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm"
    role="alert"
    aria-live="polite"
  >
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Your session will expire after eight hours of inactivity. Continue your
        session to remain signed in.
      </p>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-[#08085E] px-4 py-2 font-semibold text-white transition hover:bg-[#17178A] focus:outline-none focus:ring-2 focus:ring-[#08085E]/40"
        @click="continueSession"
      >
        Continue session
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  SESSION_IDLE_TIMEOUT_MS,
  hasIdleSessionExpired,
} from '~/services/auth/session-policy'

const SESSION_WARNING_WINDOW_MS = 15 * 60 * 1000
const ACTIVITY_EVENT_THROTTLE_MS = 1000
const ACTIVITY_PERSIST_INTERVAL_MS = 60 * 1000
const TOKEN_MAINTENANCE_INTERVAL_MS = 15 * 60 * 1000

export default {
  data() {
    return {
      autoLogoutWarning: false,
      domEvents: [
        'click',
        'mousemove',
        'mousedown',
        'scroll',
        'keypress',
        'touchstart',
      ],
      autoLogoutTimeout: null,
      warningTimeout: null,
      tokenRefreshInterval: null,
      listenersAttached: false,
      validityListenersAttached: false,
      lastHandledActivityAt: 0,
      lastPersistedActivityAt: 0,
    }
  },

  computed: {
    isAuthenticated() {
      return this.$user.getIsLoggedIn()
    },

    isInstitutionalSession() {
      return this.$user.getIsInstitutionalSession()
    },

    ...mapGetters({
      lastLoginTime: 'app/getLastLoginTime',
    }),
  },

  watch: {
    isInstitutionalSession(isInstitutionalSession) {
      if (isInstitutionalSession) {
        this.stopAutoLogout()
        return
      }

      this.startAutoLogout()
    },
  },

  mounted() {
    this.startTokenMaintenance()
    this.attachValidityListeners()

    if (this.isInstitutionalSession) return

    this.attachListeners()

    const currentTime = Date.now()
    const lastActivityTime = Number(this.lastLoginTime || currentTime)
    const elapsed = Math.max(0, currentTime - lastActivityTime)

    if (!this.lastLoginTime) {
      this.persistActivity(currentTime, true)
    }

    if (elapsed >= SESSION_IDLE_TIMEOUT_MS) {
      this.$notify({
        type: 'error',
        title: 'Session expired',
        text: 'You were logged out after eight hours of inactivity.',
        duration: 5000,
      })
      this.logout()
      return
    }

    this.setAutoLogoutTimer(SESSION_IDLE_TIMEOUT_MS - elapsed)
  },

  beforeDestroy() {
    this.stopAutoLogout()
    this.stopTokenMaintenance()
    this.detachValidityListeners()
  },

  methods: {
    attachListeners() {
      if (this.listenersAttached || this.isInstitutionalSession) return

      this.domEvents.forEach((event) => {
        window.addEventListener(event, this.resetAutoLogout, { passive: true })
      })
      this.listenersAttached = true
    },

    detachListeners() {
      if (!this.listenersAttached) return

      this.domEvents.forEach((event) => {
        window.removeEventListener(event, this.resetAutoLogout)
      })
      this.listenersAttached = false
    },

    attachValidityListeners() {
      if (this.validityListenersAttached) return
      window.addEventListener('focus', this.checkSessionValidity)
      document.addEventListener('visibilitychange', this.checkSessionValidity)
      this.validityListenersAttached = true
    },

    detachValidityListeners() {
      if (!this.validityListenersAttached) return
      window.removeEventListener('focus', this.checkSessionValidity)
      document.removeEventListener('visibilitychange', this.checkSessionValidity)
      this.validityListenersAttached = false
    },

    checkSessionValidity() {
      if (!this.isAuthenticated || this.isInstitutionalSession) return false
      if (
        document.visibilityState === 'hidden' ||
        !hasIdleSessionExpired(this.lastLoginTime)
      ) {
        return false
      }

      this.$notify({
        type: 'error',
        title: 'Session expired',
        text: 'Your session expired after eight hours of inactivity. Please sign in again.',
        duration: 5000,
      })
      this.$user.logout({ force: true, revoke: false })
      return true
    },

    startAutoLogout() {
      if (this.isInstitutionalSession) return
      this.attachListeners()
      this.continueSession()
    },

    stopAutoLogout() {
      this.toggleWarning(false)
      clearTimeout(this.warningTimeout)
      clearTimeout(this.autoLogoutTimeout)
      this.warningTimeout = null
      this.autoLogoutTimeout = null
      this.detachListeners()
    },

    setAutoLogoutTimer(remainingMs = SESSION_IDLE_TIMEOUT_MS) {
      if (this.isInstitutionalSession) return

      clearTimeout(this.warningTimeout)
      clearTimeout(this.autoLogoutTimeout)

      const safeRemaining = Math.max(0, Number(remainingMs) || 0)
      const warningDelay = Math.max(
        0,
        safeRemaining - SESSION_WARNING_WINDOW_MS
      )

      if (warningDelay === 0) {
        this.toggleWarning(true)
      } else {
        this.warningTimeout = setTimeout(
          () => this.toggleWarning(true),
          warningDelay
        )
      }

      this.autoLogoutTimeout = setTimeout(this.logout, safeRemaining)
      if (safeRemaining > SESSION_WARNING_WINDOW_MS) {
        this.toggleWarning(false)
      }
    },

    persistActivity(timestamp = Date.now(), force = false) {
      if (
        !force &&
        timestamp - this.lastPersistedActivityAt <
          ACTIVITY_PERSIST_INTERVAL_MS
      ) {
        return
      }

      this.lastPersistedActivityAt = timestamp
      this.$store.dispatch('app/UpdateLastLoginTime', timestamp)
    },

    continueSession() {
      if (this.isInstitutionalSession) return
      const now = Date.now()
      this.persistActivity(now, true)
      this.setAutoLogoutTimer()
    },

    logout() {
      if (this.isAuthenticated && !this.isInstitutionalSession) {
        this.$user.logout()
      }
    },

    toggleWarning(status = true) {
      this.autoLogoutWarning = !this.isInstitutionalSession && status
    },

    resetAutoLogout() {
      if (this.isInstitutionalSession) return

      const now = Date.now()
      if (hasIdleSessionExpired(this.lastLoginTime, now)) {
        this.checkSessionValidity()
        return
      }
      if (
        now - this.lastHandledActivityAt < ACTIVITY_EVENT_THROTTLE_MS
      ) {
        return
      }

      this.lastHandledActivityAt = now
      this.persistActivity(now)
      this.setAutoLogoutTimer()
    },

    startTokenMaintenance() {
      this.maintainToken()
      this.tokenRefreshInterval = window.setInterval(
        this.maintainToken,
        TOKEN_MAINTENANCE_INTERVAL_MS
      )
    },

    stopTokenMaintenance() {
      if (this.tokenRefreshInterval) {
        window.clearInterval(this.tokenRefreshInterval)
      }
      this.tokenRefreshInterval = null
    },

    async maintainToken() {
      if (!this.isAuthenticated) return
      if (this.checkSessionValidity()) return

      const laravelToken = this.$user.getLaravelToken()
      const nodeToken = this.$user.getToken()

      // An authenticated IP administrator may deliberately have no Node
      // content token while outside the configured institutional range. Their
      // Laravel account session is still valid, so background maintenance must
      // not repeatedly probe /auth/node-token or turn the expected 403 into a
      // full account logout. A protected research request will request a fresh
      // content token when the administrator is back on an approved network.
      if (this.$user.getIsIpUser() && laravelToken && !nodeToken) return

      try {
        await this.$user.ensureNodeToken()
      } catch (error) {
        const status = Number(error?.response?.status || 0)

        // The Laravel token is the primary account session. A 403 from
        // /auth/node-token means content access is unavailable (for example,
        // an IP administrator is off-network), not that the account session
        // has expired. Network/5xx failures likewise must not erase a valid
        // Laravel login. Only a Laravel 401 invalidates that account session.
        if (laravelToken) {
          if (status !== 401) return

          await this.$user.logout({
            force: true,
            revoke: false,
            redirectTo: '/auth/login',
          })
          return
        }

        // Anonymous institutional sessions have no Laravel account token. If
        // the browser leaves the approved network, clear that institutional
        // session and return to the public site. Transient server failures are
        // allowed to recover on the next maintenance cycle.
        if (this.isInstitutionalSession && (status === 401 || status === 403)) {
          await this.$user.logout({
            force: true,
            revoke: false,
            redirectTo: '/',
          })
        }
      }
    },
  },
}
</script>
