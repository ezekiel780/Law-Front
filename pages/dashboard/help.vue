<template>
  <div class="my-6">
    <!-- breadcrumb -->
    <div class="flex gap-5 items-center">
      <span class="w-5 h-5 bg-[#DDC524]"></span>
      <span class="font-medium text-lg">Help</span>
    </div>
    <!-- content -->
    <div class="mt-6 flex justify-end">
      <button
        type="button"
        class="rounded-xl bg-[#08085E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3939A2]"
        @click="openCustomerService"
      >
        Open Customer Service
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <dashboard-help-faq />
      <dashboard-help-contact />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpPage',
  layout: 'dashboard',
  methods: {
    openCustomerService() {
      if (this.$zendesk && this.$zendesk.open()) return

      this.$notify({
        type: 'info',
        title: 'Customer Service',
        text: 'The support widget is still loading. Please try again in a moment.',
        duration: 4000,
      })
    },
  },
}
</script>
