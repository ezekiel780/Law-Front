<template>
  <div>
    <div v-if="submitted" role="status" class="rounded-xl border border-green-200 bg-green-50 p-4 space-y-3">
      <p>Submitted successfully.</p>
      <button type="button" class="font-semibold underline" @click="submitted = false">Make another change</button>
    </div>
    <p v-if="error" role="alert" class="text-red-700">{{ error }}</p>
    <form v-show="!submitted" v-bind="$attrs" :aria-busy="pending ? 'true' : null" @submit.prevent="handleSubmit">
      <fieldset :disabled="pending" class="border-0 m-0 p-0 min-w-0"><slot /></fieldset>
    </form>
    <p v-if="pending" role="status">Submitting… Please wait.</p>
  </div>
</template>
<script>
import { submitForm } from '~/utils/form-submission.js'
export default {
  inheritAttrs: false,
  data: () => ({ pending: false, submitted: false, error: '' }),
  methods: {
    async handleSubmit(event) {
      if (this.pending || this.submitted) return
      this.pending = true
      this.error = ''
      try { this.submitted = await submitForm(() => this.$listeners.submit && this.$listeners.submit(event)) }
      catch (error) { this.error = error.message || 'Submission failed. Please try again.' }
      finally { this.pending = false }
    },
  },
}
</script>
