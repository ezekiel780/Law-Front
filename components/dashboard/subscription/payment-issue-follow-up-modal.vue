<template>
  <utils-modal v-show="modalState" @close="close">
    <template v-slot:header>
      <span class="font-medium text-[#08085E]">Follow up payment issue</span>
    </template>

    <template v-slot:body>
      <div class="space-y-4">
        <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <p class="font-semibold">{{ issue.reference || 'Existing Customer Service issue' }}</p>
          <p class="mt-1">{{ issue.subject || 'NWLR has already raised an issue for this subscription payment.' }}</p>
          <p v-if="issue.last_comment" class="mt-2 text-amber-800">Latest update: {{ issue.last_comment }}</p>
          <p class="mt-2">Do not create another payment dispute for the same failed initialization. Add your follow-up here and Customer Service will receive it on the existing issue.</p>
          <p v-if="issue.external_provider === 'zendesk' || issue.zendesk_id" class="mt-2 text-amber-800">Customer Service replies are also delivered through our Zendesk support channel to your registered email address and will appear in this conversation after synchronization.</p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-4">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-semibold text-slate-900">Conversation</p>
            <button type="button" class="text-xs font-semibold text-[#08085E]" :disabled="loadingThread" @click="loadThread">
              {{ loadingThread ? 'Refreshing…' : 'Refresh' }}
            </button>
          </div>
          <p v-if="loadingThread && comments.length === 0" class="mt-3 text-sm text-slate-500">Loading Customer Service responses…</p>
          <p v-else-if="comments.length === 0" class="mt-3 text-sm text-slate-500">No public replies have been posted yet.</p>
          <div v-else class="mt-3 max-h-72 space-y-3 overflow-y-auto pr-1">
            <article v-for="comment in comments" :key="comment.id" class="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span class="font-semibold text-slate-700">{{ comment.author_name || 'NWLR Customer Service' }}</span>
                <span>{{ formatDate(comment.created_at || comment.external_created_at) }}</span>
              </div>
              <p class="mt-1 whitespace-pre-wrap">{{ comment.body }}</p>
            </article>
          </div>
        </div>

        <label class="block text-sm font-medium text-slate-700">
          Follow-up message
          <textarea
            v-model="message"
            rows="5"
            maxlength="3000"
            class="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-[#08085E] focus:outline-none focus:ring-1 focus:ring-[#08085E]"
            placeholder="Add any information Customer Service needs about this payment attempt."
          />
        </label>

        <p v-if="errorMessage" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</p>

        <div class="grid gap-2 sm:grid-cols-2">
          <button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700" :disabled="submitting" @click="close">Close</button>
          <utils-button
            class="w-full bg-[#08085E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#3939A2]"
            :on-click="submit"
            :button-state="submitting"
          >
            Send follow-up
          </utils-button>
        </div>
      </div>
    </template>
  </utils-modal>
</template>

<script>
export default {
  props: {
    modalState: { type: Boolean, default: false },
    issue: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      message: '',
      submitting: false,
      errorMessage: '',
      comments: [],
      loadingThread: false,
    }
  },
  watch: {
    modalState(open) {
      if (open) this.loadThread()
    },
    'issue.id'(next, previous) {
      if (this.modalState && next && next !== previous) this.loadThread()
    },
  },
  methods: {
    async loadThread() {
      if (!this.issue?.id || this.loadingThread) return
      this.loadingThread = true
      try {
        const ticket = await this.$api.subscription.getSupportTicket(this.issue.id)
        this.comments = Array.isArray(ticket?.comments) ? ticket.comments : []
        this.$emit('issue-refreshed', ticket || {})
      } catch (error) {
        const parsed = this.$errorHandler.setAndParse(error)
        this.errorMessage = parsed.message
      } finally {
        this.loadingThread = false
      }
    },
    formatDate(value) {
      if (!value) return ''
      const parsed = new Date(value)
      if (Number.isNaN(parsed.getTime())) return ''
      return parsed.toLocaleString()
    },
    close() {
      if (this.submitting) return
      this.$emit('close')
    },
    async submit() {
      const body = this.message.trim()
      if (!body) {
        this.errorMessage = 'Enter a follow-up message.'
        return
      }
      if (!this.issue?.id) {
        this.errorMessage = 'The linked Customer Service issue could not be identified.'
        return
      }

      this.submitting = true
      this.errorMessage = ''
      try {
        await this.$api.subscription.addSupportTicketComment(this.issue.id, body)
        this.$notify({
          type: 'success',
          title: 'Follow-up sent',
          text: `Your update was added to ${this.issue.reference || 'the existing Customer Service issue'}.`,
          duration: 5000,
        })
        this.message = ''
        await this.loadThread()
        this.$emit('submitted')
      } catch (error) {
        const parsed = this.$errorHandler.setAndParse(error)
        this.errorMessage = parsed.message
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>
