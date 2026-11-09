<template>
  <span class="icon" v-html="svgData"></span>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: '#08085E',
    },
  },
  data() {
    return {
      svgData: '',
    }
  },
  methods: {
    makeIcon() {
      try {
        let path = this.path ? this.path : 'icons'
        let dataURI = require(`@/assets/${path}/${this.icon}.svg?raw`)

        this.svgData = window.atob(
          dataURI.replace(/data:image\/svg\+xml;base64,/, '')
        )
        this.svgData = this.svgData.replace(
          /fill="(?!none(?:"|\s)|url\()[^"]*"/gi,
          `fill="${this.color}"`
        )
      } catch (error) {
        this.svgData = ''
        this.$emit('missing', {
          icon: this.icon,
          path: this.path || 'icons',
        })

        if (process.env.NODE_ENV === 'development') {
          console.warn(`[svg-loader] Missing icon: ${this.icon}`, error)
        }
      }
    },
  },
  watch: {
    icon() {
      this.makeIcon()
    },
    path() {
      this.makeIcon()
    },
    color() {
      this.makeIcon()
    },
  },
  mounted() {
    this.makeIcon()
  },
}
</script>
