<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-[#08085E]/60 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="payment-dispute-title">
    <div class="max-h-full w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <div class="border-b border-gray-100 bg-gradient-to-r from-[#08085E] to-[#3939A2] px-6 py-5 text-white">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Payment resolution</p>
            <h2 id="payment-dispute-title" class="mt-1 text-xl font-semibold">Report a successful payment</h2>
            <p class="mt-2 text-sm leading-6 text-white/80">Use this only when your provider confirmed payment but NWLR still shows it as unpaid.</p>
          </div>
          <button type="button" class="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white" aria-label="Close payment dispute form" @click="$emit('close')">✕</button>
        </div>
      </div>

      <SubmissionForm class="space-y-5 p-6" @submit.prevent="submit">
        <div class="rounded-xl border border-[#D8D8F0] bg-[#F7F7FC] p-4 text-sm">
          <div class="grid gap-3 sm:grid-cols-2">
            <div><span class="text-[#6B7280]">Payment reference</span><p class="mt-1 break-all font-semibold text-[#1A1A1A]">{{ payment.payment_reference || payment.reference || '—' }}</p></div>
            <div><span class="text-[#6B7280]">Amount</span><p class="mt-1 font-semibold text-[#1A1A1A]">₦{{ $helper.formatAmount(Number(payment.amount || 0)) }}</p></div>
          </div>
        </div>

        <div>
          <label for="payment-dispute-reason" class="mb-2 block text-sm font-semibold text-[#1A1A1A]">What happened?</label>
          <select id="payment-dispute-reason" v-model="form.reason" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[#3939A2] focus:ring-[#3939A2]" required>
            <option value="provider_success_not_reflected">Provider says successful, NWLR shows unpaid</option>
            <option value="charged_but_unpaid">My account was charged but payment is unpaid</option>
            <option value="duplicate_charge">I was charged more than once</option>
            <option value="wrong_amount">The amount charged is incorrect</option>
            <option value="other">Other payment issue</option>
          </select>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="payment-dispute-provider-reference" class="mb-2 block text-sm font-semibold text-[#1A1A1A]">Provider reference <span class="font-normal text-[#6B7280]">(optional)</span></label>
            <input id="payment-dispute-provider-reference" v-model.trim="form.provider_reference" type="text" maxlength="180" class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#3939A2] focus:ring-[#3939A2]" placeholder="trxref, transaction ID, or receipt reference" />
          </div>
          <div>
            <label for="payment-dispute-date" class="mb-2 block text-sm font-semibold text-[#1A1A1A]">Payment date <span class="font-normal text-[#6B7280]">(optional)</span></label>
            <input id="payment-dispute-date" v-model="form.occurred_at" type="datetime-local" :max="maxDate" class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#3939A2] focus:ring-[#3939A2]" />
          </div>
        </div>

        <div>
          <label for="payment-dispute-note" class="mb-2 block text-sm font-semibold text-[#1A1A1A]">Tell Customer Service what you observed</label>
          <textarea id="payment-dispute-note" v-model.trim="form.customer_note" rows="5" minlength="10" maxlength="3000" class="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 focus:border-[#3939A2] focus:ring-[#3939A2]" placeholder="For example: Paystack displayed Payment Successful and my bank account was debited, but this history still shows unpaid." required />
          <p class="mt-1 text-right text-xs text-[#6B7280]">{{ form.customer_note.length }}/3000</p>
        </div>

        <div v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</div>

        <div class="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" class="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-[#3D3D3D] transition hover:bg-gray-50" :disabled="isSubmitting" @click="$emit('close')">Cancel</button>
          <button type="submit" class="rounded-lg bg-[#08085E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3939A2] disabled:cursor-not-allowed disabled:opacity-60" :disabled="isSubmitting || form.customer_note.length < 10">
            {{ isSubmitting ? 'Submitting…' : 'Submit payment dispute' }}
          </button>
        </div>
      </SubmissionForm>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    payment: { type: Object, required: true },
  },
  data() {
    return {
      isSubmitting: false,
      errorMessage: '',
      form: {
        reason: 'provider_success_not_reflected',
        provider_reference: this.payment.payment_external_reference || '',
        occurred_at: '',
        customer_note: '',
      },
    }
  },
  computed: {
    maxDate() {
      const date = new Date()
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      return date.toISOString().slice(0, 16)
    },
  },
  methods: {
    async submit() {
      if (!this.payment.payment_id || this.isSubmitting) return
      this.isSubmitting = true
      this.errorMessage = ''
      try {
        const response = await this.$api.subscription.openPaymentDispute(
          this.payment.payment_id,
          {
            ...this.form,
            occurred_at: this.form.occurred_at || null,
            provider_reference: this.form.provider_reference || null,
          }
        )
        const dispute = response?.data?.data || response?.data
        this.$notify({
          type: 'success',
          title: 'Payment dispute submitted',
          text: `Customer Service will investigate ${dispute?.reference || 'your payment'}.`,
          duration: 7000,
        })
        this.$emit('submitted', dispute)
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
