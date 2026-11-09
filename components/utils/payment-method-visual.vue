<template>
  <div class="payment-method-visual">
    <div class="payment-method-visual__mark" aria-hidden="true">
      <img
        v-if="shouldRenderImage"
        :src="imageSource"
        :alt="`${title} logo`"
        class="payment-method-visual__image"
        @load="handleLoad"
        @error="handleError"
      />
      <span v-else class="payment-method-visual__initials">
        {{ initials }}
      </span>
    </div>

    <div class="payment-method-visual__copy">
      <p class="payment-method-visual__title">{{ title }}</p>
      <p class="payment-method-visual__subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script>
import paystackLogo from '@/assets/icons/paystack.svg'
import flutterwaveLogo from '@/assets/icons/flutterwave.svg'
import interswitchLogo from '@/assets/icons/interswitch.svg'

const BUILTIN_PAYMENT_LOGOS = Object.freeze({
  'paystack.svg': paystackLogo,
  'flutterwave.svg': flutterwaveLogo,
  'interswitch.svg': interswitchLogo,
})

export default {
  props: {
    method: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imageFailed: false,
    }
  },
  computed: {
    title() {
      return String(
        this.method.title ||
          this.method.name ||
          this.method.gateway_code ||
          this.method.slug ||
          'Payment method'
      ).trim()
    },
    subtitle() {
      const value =
        this.method.gateway_code ||
        this.method.provider ||
        this.method.slug ||
        'Secure payment option'

      return String(value)
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase())
    },
    imageSource() {
      const configuredSource = String(
        this.method.image ||
          this.method.logo_url ||
          this.method.icon_url ||
          this.method.logo ||
          ''
      ).trim()
      if (!configuredSource) return ''

      const filename = configuredSource.split(/[\/]/).pop().toLowerCase()
      return BUILTIN_PAYMENT_LOGOS[filename] || configuredSource
    },
    shouldRenderImage() {
      return Boolean(this.imageSource) && !this.imageFailed
    },
    initials() {
      const words = this.title.split(/\s+/).filter(Boolean)

      if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase()
      }

      return words
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
    },
  },
  watch: {
    imageSource() {
      this.imageFailed = false
    },
  },
  methods: {
    handleLoad() {
      this.imageFailed = false
    },
    handleError() {
      this.imageFailed = true
    },
  },
}
</script>

<style scoped>
.payment-method-visual {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  align-items: center;
  gap: 0.9rem;
}

.payment-method-visual__mark {
  position: relative;
  display: flex;
  width: 3.5rem;
  height: 3.5rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(8, 8, 94, 0.12);
  border-radius: 1rem;
  background:
    radial-gradient(circle at 75% 20%, rgba(221, 197, 36, 0.32), transparent 38%),
    linear-gradient(145deg, #08085e 0%, #282891 58%, #5a4ca7 100%);
  box-shadow: 0 10px 25px rgba(8, 8, 94, 0.16);
}

.payment-method-visual__image {
  width: 100%;
  height: 100%;
  padding: 0.45rem;
  background: #fff;
  object-fit: contain;
}

.payment-method-visual__initials {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.22);
}

.payment-method-visual__copy {
  min-width: 0;
  text-align: left;
}

.payment-method-visual__title {
  overflow: hidden;
  color: #08085e;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.payment-method-visual__subtitle {
  overflow: hidden;
  margin-top: 0.2rem;
  color: #6b7280;
  font-size: 0.75rem;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
