<template>
  <div>
    <landing-contact-form />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'Contact Us Page',
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'Contact Us | NWLR Online',
        description: 'Got a question? Contact us now',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
