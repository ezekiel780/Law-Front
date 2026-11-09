export default {
  mounted() {
    if (!process.client || !this.$gtag) {
      return
    }

    const pageTitle =
      (this.seo && this.seo.title) || this.$options.name || document.title

    this.$gtag('event', 'page_view', {
      page_title: pageTitle,
      page_path: this.$route.fullPath,
      page_location: window.location.href,
    })
  },
}
