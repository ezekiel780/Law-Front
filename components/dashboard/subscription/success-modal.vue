<template>
  <div>
    <utils-modal @close="toggleModal" v-show="modalState">
      <!-- Body slot -->
      <template v-slot:body>
        <div class="flex flex-col items-center justify-center gap-8">
          <div class="font-medium text-[#08085E]">Payment Successful</div>
          <utils-svg-loader icon="successful" color="#fff" />
          <nuxt-link
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border[1px] border-[#08085E] font-medium hover:bg-[#3939A2] hover:text-[#fff] transition-all text-sm bg-[#08085E] text-[#fff] w-full"
            to="/dashboard"
          >
            Dashboard
          </nuxt-link>
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
