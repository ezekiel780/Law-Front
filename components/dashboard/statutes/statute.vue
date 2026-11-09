<template>
  <div class="w-fit">
    <div
      class="w-full flex justify-between items-center flex-wrap gap-6 mb-5"
      v-for="(statute, index) in statutes"
      :key="`statue-${index}`"
    >
      <div class="w-3/5">{{ statute.title }}</div>
      <button
        class="w-1/6 px-5 py-1.5 rounded-2xl bg-[#f5f6fb] text-[#08085e] font-medium"
        @click.prevent="
          openDoc(`https://d35mvemnmda2wx.cloudfront.net/${statute.id}.pdf`)
        "
      >
        View
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    statutes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {}
  },
  methods: {
    openDoc(url) {
      this.$emit('trigger-open-doc', url)
    },
  },
}
</script>
