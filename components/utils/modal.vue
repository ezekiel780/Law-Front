<template>
  <div
    class="fixed top-0 z-[100] inset-0 overflow-y-auto overscroll-contain bg-[#c4c4c433]"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- overlay -->
    <div class="fixed inset-0 bg-[#08085ea6]" aria-hidden="true"></div>

    <!-- add bottom padding + make sure modal never overflows viewport -->
    <div
      class="relative flex justify-center items-start px-6 min-h-screen"
      :class="maximize ? 'py-6' : 'pt-24 pb-24 lg:px-24 lg:pb-20'"
    >
      <div
        class="relative bg-white rounded-[1.25rem] text-left shadow-md transform transition-all w-full md:w-full overflow-hidden"
        :class="{
          'md:max-w-[90%]': maximize,
          'md:max-w-lg': !maximize,
        }"
      >
        <!-- scroll inside the modal if content is tall -->
        <div
          class="bg-white px-6 py-12 overflow-y-auto max-h-[calc(100vh-6rem)]"
        >
          <div class="float-right">
            <!-- max/min-imize button  -->
            <button @click="toggleModalSize" class="">
              <i
                class="ri-expand-diagonal-line text-lg text-[#08085E] rounded-full border-[1px] border-[#08085E] p-1 hover:bg-[#08085E] hover:text-[#fff] transition-all duration-300 transform rotate-180"
                v-show="!maximize"
              ></i>
              <i
                class="ri-collapse-diagonal-fill text-lg text-[#08085E] rounded-full border-[1px] border-[#08085E] p-1 hover:bg-[#08085E] hover:text-[#fff] transition-all duration-300 transform rotate-180"
                v-show="maximize"
              ></i>
            </button>

            <!-- close button  -->
            <button @click="$emit('close')" class="">
              <i
                class="ri-close-line text-lg text-[#08085E] rounded-full border-[1px] border-[#08085E] p-1 hover:bg-[#08085E] hover:text-[#fff]"
              ></i>
            </button>
          </div>

          <!-- Header  -->
          <slot name="header"></slot>

          <div class="my-5"></div>

          <!-- Body  -->
          <slot name="body" />

          <div class="flex justify-center flex-row-reverse">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      maximize: true,
    }
  },
  methods: {
    toggleModalSize() {
      this.maximize = !this.maximize
    },
  },
  mounted() {
    this.$nextTick(() => {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    })
    if (this.$route.path.includes('/legal-research')) {
      this.maximize = false
    }
  },
  destroyed() {
    this.$nextTick(() => {
      document.getElementsByTagName('body')[0].style.overflow = 'auto'
    })
  },
}
</script>

<style scoped>
body {
  overflow: hidden !important;
}
</style>
