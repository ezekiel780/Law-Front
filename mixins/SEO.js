export default {
  head() {
    const seo = this.seo || {}

    const title = seo.title || 'NWLR Online'
    const description =
      seo.description ||
      'Most Authoritative, Consistent, Exhaustive Law Reports in Nigeria'
    const image = seo.image || 'https://nwlronline.com/icon_new.png'
    const url = 'https://nwlronline.com' + this.$route.path

    return {
      title,

      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },

        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: seo.type || 'website',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
        {
          hid: 'og:locale',
          property: 'og:locale',
          content: 'en_US',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: url,
        },
      ],

      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: url,
        },
      ],
    }
  },
}
