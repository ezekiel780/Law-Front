<template>
  <div
    class="w-72 bg-white shadow-xl rounded-lg flex items-stretch mt-4 py-5 relative"
    :style="borderStyle"
  >
    <!-- type icon -->
    <div class="w-1/6 text-center self-center">
      <i class="text-2xl" :class="typeIcon" />
    </div>
    <!-- content -->
    <div class="w-5/6" :class="`text-${color}`">
      <h5 class="title uppercase font-medium text-sm">
        {{ noticeProps.item.title }}
      </h5>
      <p class="text-xs" v-html="noticeProps.item.text"></p>
    </div>
    <!-- close icon -->
    <div class="absolute top-3 right-2">
      <!-- "ri-close-circle-line text-[#C10000]" -->
      <i
        class="close ri-close-line cursor-pointer"
        :class="`text-${color}`"
        @click="noticeProps.close"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    noticeProps: {
      type: Object,
      required: true,
    },
  },
  computed: {
    typeIcon() {
      const NOTICE_TYPE = this.noticeProps.item.type
      let icon = ''
      switch (NOTICE_TYPE) {
        case 'success':
          icon = 'ri-checkbox-circle-line text-[#16A34A]'
          break

        case 'error':
          icon = 'ri-information-line text-[#C10000]'
          break

        default:
          icon = 'ri-information-line text-[#08085E]'
          break
      }
      return icon
    },
    color() {
      const NOTICE_TYPE = this.noticeProps.item.type
      let pick = '[#08085E]'
      switch (NOTICE_TYPE) {
        case 'success':
          pick = '[#16A34A]'
          break

        case 'error':
          pick = '[#C10000]'
          break

        default:
          pick = '[#08085E]'
          break
      }
      return pick
    },
    borderStyle() {
      const NOTICE_TYPE = this.noticeProps.item.type
      let pick = '#08085E'
      switch (NOTICE_TYPE) {
        case 'success':
          pick = 'border: 1px solid #16A34A;'
          break

        case 'error':
          pick = 'border: 1px solid #C10000;'
          break

        default:
          pick = 'border: 1px solid #08085E;'
          break
      }
      return pick
    },
  },
}
</script>
