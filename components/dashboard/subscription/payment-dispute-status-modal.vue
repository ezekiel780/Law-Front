<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-[#08085E]/60 px-4 py-8"
    role="dialog"
    aria-modal="true"
    aria-labelledby="payment-dispute-status-title"
  >
    <div class="max-h-full w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <div class="border-b border-gray-100 bg-gradient-to-r from-[#08085E] to-[#3939A2] px-6 py-5 text-white">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Payment resolution</p>
            <h2 id="payment-dispute-status-title" class="mt-1 text-xl font-semibold">
              {{ dispute.reference }}
            </h2>
            <p class="mt-2 text-sm text-white/80">Track Customer Service's review of your payment.</p>
          </div>
          <button
            type="button"
            class="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Close payment dispute status"
            @click="$emit('close')"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="space-y-5 p-6">
        <div class="flex flex-wrap items-center gap-3">
          <span class="rounded-full bg-[#EFEFF6] px-3 py-1.5 text-sm font-semibold capitalize text-[#3939A2]">
            {{ statusLabel }}
          </span>
          <span v-if="dispute.support_ticket_reference" class="text-sm text-[#6B7280]">
            Support ticket {{ dispute.support_ticket_reference }}
          </span>
        </div>

        <dl class="grid gap-4 rounded-xl border border-gray-200 bg-[#FAFAFC] p-4 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-[#6B7280]">Reason</dt>
            <dd class="mt-1 font-semibold capitalize text-[#1A1A1A]">{{ reasonLabel }}</dd>
          </div>
          <div>
            <dt class="text-[#6B7280]">Provider reference</dt>
            <dd class="mt-1 break-all font-semibold text-[#1A1A1A]">{{ dispute.provider_reference || 'Not supplied' }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-[#6B7280]">Your report</dt>
            <dd class="mt-1 whitespace-pre-wrap leading-6 text-[#1A1A1A]">{{ dispute.customer_note || '—' }}</dd>
          </div>
          <div v-if="dispute.resolution_note" class="sm:col-span-2">
            <dt class="text-[#6B7280]">Latest update</dt>
            <dd class="mt-1 whitespace-pre-wrap rounded-lg border border-[#D8D8F0] bg-white p-3 leading-6 text-[#1A1A1A]">
              {{ dispute.resolution_note }}
            </dd>
          </div>
        </dl>

        <SubmissionForm v-if="canAddInformation" class="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-4" @submit.prevent="submitInformation">
          <div>
            <h3 class="font-semibold text-amber-950">Customer Service needs more information</h3>
            <p class="mt-1 text-sm leading-6 text-amber-900">Reply here with the provider receipt details or any other information requested above.</p>
          </div>
          <div>
            <label for="payment-dispute-additional-reference" class="mb-2 block text-sm font-semibold text-[#1A1A1A]">Provider reference <span class="font-normal text-[#6B7280]">(optional)</span></label>
            <input
              id="payment-dispute-additional-reference"
              v-model.trim="form.provider_reference"
              type="text"
              maxlength="180"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
            />
          </div>
          <div>
            <label for="payment-dispute-additional-message" class="mb-2 block text-sm font-semibold text-[#1A1A1A]">Additional information</label>
            <textarea
              id="payment-dispute-additional-message"
              v-model.trim="form.message"
              rows="5"
              minlength="10"
              maxlength="3000"
              required
              class="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 focus:border-[#3939A2] focus:ring-[#3939A2]"
              placeholder="Add the successful transaction reference, receipt details, debit alert information, or any other requested evidence."
            />
          </div>
          <div v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</div>
          <button
            type="submit"
            class="rounded-lg bg-[#08085E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3939A2] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSubmitting || form.message.length < 10"
          >
            {{ isSubmitting ? 'Sending…' : 'Send additional information' }}
          </button>
        </SubmissionForm>

        <div class="flex justify-end border-t border-gray-100 pt-5">
          <button type="button" class="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-[#3D3D3D] transition hover:bg-gray-50" @click="$emit('close')">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dispute: { type: Object, required: true },
  },
  data() {
    return {
      isSubmitting: false,
      errorMessage: '',
      form: {
        provider_reference: this.dispute.provider_reference || '',
        message: '',
      },
    }
  },
  computed: {
    statusLabel() {
      return String(this.dispute.status || 'open').replace(/_/g, ' ')
    },
    reasonLabel() {
      return String(this.dispute.reason || 'payment issue').replace(/_/g, ' ')
    },
    canAddInformation() {
      return this.dispute.status === 'awaiting_information'
    },
  },
  methods: {
    async submitInformation() {
      if (!this.dispute.id || this.isSubmitting) return
      this.isSubmitting = true
      this.errorMessage = ''
      try {
        const response = await this.$api.subscription.addPaymentDisputeInformation(this.dispute.id, {
          message: this.form.message,
          provider_reference: this.form.provider_reference || null,
        })
        const dispute = response?.data?.data || response?.data
        this.$notify({
          type: 'success',
          title: 'Information sent',
          text: 'Customer Service has been notified and will continue the payment review.',
          duration: 7000,
        })
        this.$emit('updated', dispute)
      } catch (error) {
        const parsed = this.$errorHandler.setAndParse(error)
        this.errorMessage = parsed.message
      } finally {
        this.isSubmitting = false
      }
    },
  },
}
</script>
