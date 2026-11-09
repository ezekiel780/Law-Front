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
          <span class="font-medium text-[#08085E]">Select Payment Method</span>
        </span>
      </template>

      <!-- Body slot -->
      <template v-slot:body>
        <div class="grid grid-cols-2 gap-2">
          <div v-for="(method, index) in paymentMethods" :key="`pmt-${index}`">
            <div
              class="w-40 h-auto rounded-lg shadow-xl m-12 flex flex-col justify-between items-center text-[#4A4A4A] bg-[#F5F6FB] p-2 space-y-4"
            >
              <div class="font-medium text-center">{{ method.title }}</div>
              <utils-image-fallback
                :src="method.image"
                :alt="`${method.title} payment method`"
                :fallback-title="method.title"
                :fallback-subtitle="
                  method.gateway_code || method.slug || 'Secure payment'
                "
                icon="ri-bank-card-2-line"
                variant="logo"
                container-class="w-24 h-24"
                image-class="object-contain bg-white p-2"
              />
              <utils-button
                class="py-2 px-3 rounded-xl border border-transparent bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all col-span-2"
                :on-click="
                  () => {
                    createSubscription(method)
                  }
                "
                :button-state="loadingStates[method.title]"
              >
                Pay Now
              </utils-button>
            </div>
          </div>
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
      default: false,
    },
    planId: {
      type: Number,
      default: 1,
    },
    amount: {
      type: String,
      default: '1000',
    },
    paymentMethods: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loadingStates: {
        Paystack: false,
        Flutterwave: false,
      },
    }
  },
  methods: {
    toggleModal() {
      this.$emit('toggle-modal')
    },
    async subscribeNow() {
      try {
        const response = await this.$api.subscription.getPlans()
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') console.trace(errorResponse)
        this.$notify({
          type: 'error',
          title: 'Error',
          text: errorResponse.message,
          duration: 5000,
        })
      }
    },
    async createSubscription(method = {}) {
      this.loadingStates[method.title] = true
      try {
        const response = await this.$api.subscription.createSubscription({
          reference: this.$helper.generateRandomCode(9),
          plan_id: this.planId,
          amount: this.amount,
          type: method.title.toLowerCase(),
        })
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') console.trace(errorResponse)
        this.$notify({
          type: 'error',
          title: 'Error',
          text: errorResponse.message,
          duration: 5000,
        })
      } finally {
        this.loadingStates[method.title] = false
      }
    },
  },
}
</script>
