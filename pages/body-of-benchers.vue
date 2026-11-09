<template>
  <div>
    <landing-justices-legal-practitioners />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'Body Of Benchers Page',
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'Body of Benchers | NWLR Online',
        description: 'Legal Practitioners Disciplinary Committee',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
