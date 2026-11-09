<template>
  <div>
    <landing-book-dictionary-hardcopy />
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'

export default {
  name: 'DictionaryHardcopyPage',
  layout: 'dictionary-hardcopy',
  mixins: [SEO],
  data() {
    return {
      seo: {
        title: 'Dictionary Hardcopy | NWLR Online',
        description:
          'Order the Nigerian Case Law Dictionary hardcopy without creating or signing in to an NWLR Online account.',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
}
</script>
