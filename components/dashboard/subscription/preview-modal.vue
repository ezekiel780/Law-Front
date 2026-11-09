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
          <span class="font-medium text-[#08085E]">Subscription Details</span>
        </span>
      </template>

      <!-- Body slot -->
      <template v-slot:body>
        <div class="flex flex-col justify-center gap-8">
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              Title: <span class="font-semibold">{{ subscriptionTitle }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              Category:
              <span class="font-semibold">{{ paymentData.category || 'Not available' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              Period:
              <span class="font-semibold"
                >{{ durationLabel(paymentData) }}</span
              >
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              No. of users:
              <span class="font-semibold">{{ paymentData.no_of_users ?? 'Not available' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              Amount:
              <span class="font-semibold"
                >{{ paymentData.amount_redacted ? 'Campaign subscription' : '₦' + $helper.formatAmount(Number(paymentData.amount)) }}</span
              >
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              Total Amount: <span class="font-semibold">{{ '-' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              Grand Total Amount:
              <span class="font-semibold"
                >{{ paymentData.amount_redacted ? 'Campaign subscription' : '₦' + $helper.formatAmount(Number(paymentData.amount)) }}</span
              >
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              Reference:
              <span class="font-semibold">{{ paymentData.reference || 'Not available' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              Payment Status:
              <span class="font-semibold">{{
                paymentData.payment_status
                  ? String(paymentData.payment_status).replace(/_/g, ' ')
                  : 'Not recorded'
              }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              Payment Date:
              <span class="font-semibold">{{
                formatDate(paymentData.payment_date || paymentData.current_period_start)
              }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              Expiration Date:
              <span class="font-semibold">{{
                formatDate(paymentData.current_period_end)
              }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-2 rounded-full bg-[#DDC524]"></div>
            <div class="text-[#3D3D3D]">
              Primary Subscriber:
              <span class="font-semibold">{{
                $user.getFirstName() + ' ' + $user.getLastName()
              }}</span>
            </div>
          </div>
        </div>
      </template>
    </utils-modal>
  </div>
</template>

<script>
import { durationLabel } from '~/utils/subscription-plan.js'

export default {
  props: {
    modalState: {
      type: Boolean,
      default: true,
    },
    paymentData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {}
  },
  computed: {
    subscriptionTitle() {
      const title = String(this.paymentData?.title || '').trim()
      if (title) return title
      return `Historical subscription #${this.paymentData?.id || 'record'}`
    },
  },
  methods: {
    durationLabel,
    formatDate(value) {
      if (!value) return 'Not available'
      const date = this.$moment(value)
      return date.isValid() ? date.format('DD MMM, YYYY') : 'Not available'
    },
    toggleModal() {
      this.$emit('toggle-modal')
    },
  },
}
</script>
