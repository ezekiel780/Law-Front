<template>
  <div>
    <utils-modal @close="toggleModal" v-show="modalState">
      <template v-slot:header>
        <span class="flex gap-4 items-center cursor-pointer">
          <utils-svg-loader
            icon="filter-icon"
            class="cursor-pointer"
            color="#08085E"
          />
          <span class="font-medium text-[#08085E]">Terms &amp; Conditions</span>
        </span>
      </template>

      <!-- Body slot -->
      <template v-slot:body>
        <div>
          <utils-pdf-viewer
            :pdfSrc="'https://d35mvemnmda2wx.cloudfront.net/Terms_and_conditions.pdf'"
          />
        </div>
      </template>
    </utils-modal>
  </div>
</template>

<script>
export default {
  props: {
    modalState: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    toggleModal() {
      this.$emit('toggle-modal')
    },
  },
}
</script>
