<template>
  <div
    :class="[
      'image-fallback',
      `image-fallback--${variant}`,
      containerClass,
    ]"
    :aria-label="resolvedAlt"
  >
    <img
      v-if="shouldRenderImage"
      :src="src"
      :alt="resolvedAlt"
      :class="['image-fallback__image', imageClass]"
      @load="handleLoad"
      @error="handleError"
    />

    <div v-else class="image-fallback__content" role="img">
      <span class="image-fallback__glow image-fallback__glow--one"></span>
      <span class="image-fallback__glow image-fallback__glow--two"></span>

      <div class="image-fallback__mark" aria-hidden="true">
        <span v-if="displayInitials">{{ displayInitials }}</span>
        <i v-else :class="icon"></i>
      </div>

      <div v-if="variant !== 'avatar'" class="image-fallback__copy">
        <p class="image-fallback__title">{{ fallbackTitle }}</p>
        <p v-if="fallbackSubtitle" class="image-fallback__subtitle">
          {{ fallbackSubtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
    fallbackTitle: {
      type: String,
      default: 'NWLR',
    },
    fallbackSubtitle: {
      type: String,
      default: '',
    },
    initials: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'ri-image-line',
    },
    variant: {
      type: String,
      default: 'card',
      validator: (value) =>
        ['avatar', 'card', 'logo', 'cover'].includes(value),
    },
    containerClass: {
      type: String,
      default: '',
    },
    imageClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      imageFailed: false,
    }
  },
  computed: {
    normalizedSource() {
      return typeof this.src === 'string' ? this.src.trim() : ''
    },
    shouldRenderImage() {
      return Boolean(this.normalizedSource) && !this.imageFailed
    },
    resolvedAlt() {
      return this.alt || this.fallbackTitle || 'Image'
    },
    displayInitials() {
      const supplied = this.initials.trim()
      if (supplied) return supplied.slice(0, 3).toUpperCase()

      if (this.variant !== 'avatar') return ''

      return this.fallbackTitle
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
    },
  },
  watch: {
    src() {
      this.imageFailed = false
    },
  },
  methods: {
    handleLoad() {
      this.imageFailed = false
      this.$emit('load')
    },
    handleError(event) {
      this.imageFailed = true
      this.$emit('error', event)
    },
  },
}
</script>

<style scoped>
.image-fallback {
  position: relative;
  overflow: hidden;
  min-width: 0;
  background: linear-gradient(145deg, #08085e 0%, #25258c 55%, #5a4ca7 100%);
  color: #fff;
  isolation: isolate;
}

.image-fallback__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-fallback__content {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  text-align: center;
}

.image-fallback__glow {
  position: absolute;
  z-index: -1;
  display: block;
  border-radius: 9999px;
  background: rgba(221, 197, 36, 0.2);
  filter: blur(1px);
}

.image-fallback__glow--one {
  top: -32%;
  right: -20%;
  width: 70%;
  aspect-ratio: 1;
}

.image-fallback__glow--two {
  bottom: -38%;
  left: -24%;
  width: 82%;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.1);
}

.image-fallback__mark {
  display: flex;
  width: 3.25rem;
  height: 3.25rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.14);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  backdrop-filter: blur(8px);
}

.image-fallback__copy {
  max-width: 90%;
}

.image-fallback__title {
  display: -webkit-box;
  overflow: hidden;
  font-weight: 700;
  line-height: 1.25;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.image-fallback__subtitle {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 0.3rem;
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.75rem;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.image-fallback--avatar {
  border: 2px solid rgba(221, 197, 36, 0.72);
  border-radius: 9999px;
  box-shadow: 0 8px 24px rgba(8, 8, 94, 0.2);
}

.image-fallback--avatar .image-fallback__content {
  padding: 0;
}

.image-fallback--avatar .image-fallback__mark {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: inherit;
  background: transparent;
  box-shadow: none;
  font-size: 0.9rem;
}

.image-fallback--logo {
  border: 1px solid rgba(8, 8, 94, 0.1);
  border-radius: 1.25rem;
  box-shadow: 0 14px 35px rgba(8, 8, 94, 0.16);
}

.image-fallback--logo .image-fallback__content {
  gap: 0.4rem;
  padding: 0.55rem;
}

.image-fallback--logo .image-fallback__mark {
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 0.9rem;
  font-size: 1.2rem;
}

.image-fallback--logo .image-fallback__title {
  font-size: 0.68rem;
  letter-spacing: 0.02em;
}

.image-fallback--cover {
  border-radius: inherit;
}

.image-fallback--cover .image-fallback__mark {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 1.35rem;
  font-size: 1.75rem;
}

.image-fallback--cover .image-fallback__title {
  font-size: 1.35rem;
}

.image-fallback--cover .image-fallback__subtitle {
  font-size: 0.9rem;
}
</style>
