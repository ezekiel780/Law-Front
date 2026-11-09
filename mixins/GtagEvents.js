export default {
  methods: {
    trackGtagEvent(eventName, params = {}) {
      if (!process.client || !this.$gtag) {
        return
      }

      this.$gtag('event', eventName, {
        page_title: document.title,
        page_path: this.$route ? this.$route.fullPath : undefined,
        ...params,
      })
    },
  },
}
