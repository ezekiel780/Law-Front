<template>
  <div class="w-fit">
    <div
      class="w-full flex justify-between items-center flex-wrap gap-6 mb-5"
      v-for="(rule, index) in rules"
      :key="`rule-${index}`"
    >
      <div class="w-3/5">{{ rule.title }}</div>
      <button
        class="w-1/6 px-5 py-1.5 rounded-2xl bg-[#f5f6fb] text-[#08085e] font-medium"
        @click.prevent="
          openDoc(`https://d35mvemnmda2wx.cloudfront.net/${rule.id}.pdf`)
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
    rules: {
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
