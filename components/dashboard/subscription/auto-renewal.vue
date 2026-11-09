<template>
  <div class="p-5">
    <section
      class="overflow-hidden rounded-2xl border border-[#E6E8F2] bg-white shadow-sm"
      aria-labelledby="auto-renewal-title"
    >
      <div
        class="bg-gradient-to-r from-[#08085E] via-[#24248B] to-[#3939A2] px-6 py-7 text-white"
      >
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Subscription continuity
            </p>
            <h2 id="auto-renewal-title" class="mt-2 text-2xl font-semibold">
              Auto-Renewal
            </h2>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-white/85">
              Keep your legal research access active without manually repeating
              checkout at the end of every billing period.
            </p>
          </div>
          <span
            class="inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold"
            :class="
              isAutoDebit == 1
                ? 'border-emerald-200 bg-emerald-100 text-emerald-900'
                : 'border-white/30 bg-white/10 text-white'
            "
          >
            {{ isAutoDebit == 1 ? 'Enabled' : 'Disabled' }}
          </span>
        </div>
      </div>

      <div class="grid gap-6 px-6 py-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div class="space-y-4">
          <p class="text-sm leading-6 text-[#4A4A4A]">
            {{
              isAutoDebit == 1
                ? 'Your active subscription will be renewed automatically using the reusable authorization supplied by your payment provider.'
                : 'Enable auto-renewal as you complete your payment.'
            }}
          </p>

          <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
            <p class="font-semibold text-blue-950">Your card details stay with the payment provider</p>
            <p class="mt-1 text-sm leading-6 text-blue-800">
              NWLR does not store your card number or CVV. Only an encrypted,
              provider-issued authorization token is retained for future renewal
              charges. One-time, bank-transfer, and non-reusable payment methods
              cannot be used for automatic renewal.
            </p>
          </div>

          <p class="text-xs leading-5 text-gray-500">
            If a renewal charge cannot be completed, NWLR retries within the
            configured recovery window and alerts Customer Service. Access is
            never extended unless payment is verified and the renewed
            subscription is activated.
          </p>
        </div>

        <utils-button
          class="w-full rounded-xl border border-[#08085E] bg-[#08085E] px-8 py-3 font-semibold text-white transition-all hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 lg:w-auto"
          :on-click="updateAutoDebit"
          :button-state="loadingUpdateAutoDebit"
        >
          {{ isAutoDebit == 1 ? 'Disable Auto-Renewal' : 'Enable Auto-Renewal' }}
        </utils-button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingUpdateAutoDebit: false,
    }
  },
  computed: {
    isAutoDebit() {
      return this.$user.getAutoDebit()
    },
  },
  methods: {
    async updateAutoDebit() {
      try {
        this.loadingUpdateAutoDebit = true
        const nextAutoDebitState = this.isAutoDebit == 1 ? 0 : 1
        const res = await this.$api.account.updateAutoDebit(nextAutoDebitState)
        this.$user.setAutoDebit(nextAutoDebitState)
        this.$notify({
          type: 'success',
          title: 'Auto-renewal updated',
          text: res.data.message,
          duration: 5000,
        })
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') console.trace(errorResponse)
        this.$notify({
          type: 'error',
          title: 'Auto-renewal could not be updated',
          text: errorResponse.message,
          duration: 7000,
        })
      } finally {
        this.loadingUpdateAutoDebit = false
      }
    },
  },
}
</script>
