<template>
  <div ref="historySection" class="p-5">
    <SubmissionForm
      class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      @submit.prevent="applySearch"
    >
      <div class="w-full sm:max-w-md">
        <label for="subscription-history-search" class="mb-2 block text-sm font-medium text-[#3D3D3D]">
          Search subscription history
        </label>
        <input
          id="subscription-history-search"
          v-model.trim="searchQuery"
          type="search"
          class="block w-full rounded-md border-gray-200 bg-[#E6E6F4] px-4 py-3 text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
          placeholder="Plan, category, or reference"
          autocomplete="off"
        />
      </div>
      <div class="flex gap-2">
        <button
          type="submit"
          class="rounded-md bg-[#08085E] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#3939A2] disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isLoading"
        >
          Search
        </button>
        <button
          v-if="appliedSearch"
          type="button"
          class="rounded-md border border-[#08085E] px-5 py-3 text-sm font-medium text-[#08085E] transition hover:bg-[#EFEFF6] disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isLoading"
          @click="clearSearch"
        >
          Clear
        </button>
      </div>
    </SubmissionForm>

    <div v-if="errorMessage" class="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p>{{ errorMessage }}</p>
      <button type="button" class="mt-2 font-semibold underline" @click="getSubscriptions(pagination.currentPage)">
        Try again
      </button>
    </div>

    <div v-if="isLoading" class="my-10 flex min-h-[180px] items-center justify-center" aria-live="polite">
      <span class="text-sm text-[#545454]">Loading subscription history…</span>
    </div>

    <div v-else-if="paymentHistory.length === 0" class="my-10 rounded-lg border border-dashed border-gray-300 px-6 py-12 text-center">
      <p class="font-medium text-[#1A1A1A]">
        {{ appliedSearch ? 'No matching subscriptions found.' : 'No subscription history yet.' }}
      </p>
      <p class="mt-2 text-sm text-[#6B7280]">
        {{ appliedSearch ? 'Try a different plan name, category, or reference.' : 'Your subscriptions will appear here.' }}
      </p>
    </div>

    <template v-else>
      <div class="my-8 hidden overflow-x-auto rounded-lg border border-gray-200 md:block">
        <table class="min-w-[900px] w-full divide-y divide-gray-200">
          <thead class="bg-[#E6E6F4]">
            <tr>
              <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-[#3D3D3D]">S/N</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#3D3D3D]">Title</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#3D3D3D]">Category</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#3D3D3D]">Reference</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#3D3D3D]">Payment Status</th>
              <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-[#3D3D3D]">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white text-[#3D3D3D]">
            <tr v-for="(history, index) in paymentHistory" :key="history.id">
              <td class="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                {{ serialNumber(index) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <span v-if="!history.amount_redacted">₦{{ $helper.formatAmount(Number(history.amount)) }}/</span>{{ historyTitle(history) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm capitalize">{{ history.category || '—' }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">{{ history.reference || '—' }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <span :class="paymentStatusClass(history.payment_status)" class="inline-flex rounded-full px-3 py-1.5 text-xs font-medium capitalize">
                  {{ history.amount_redacted ? 'Campaign subscription' : paymentStatusLabel(history.payment_status, history.payment_record_state) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                <div class="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-md bg-[#08085E] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3939A2]"
                    @click="togglePreviewModal('open', history)"
                  >
                    View
                  </button>
                  <button
                    v-if="history.payment_can_verify && history.payment_reference"
                    type="button"
                    class="inline-flex items-center justify-center rounded-md border border-[#08085E] bg-white px-4 py-2 text-sm font-semibold text-[#08085E] transition hover:bg-[#EFEFF6] disabled:opacity-50"
                    :disabled="verifyingPaymentId === history.id"
                    @click="recheckPayment(history)"
                  >
                    {{ verifyingPaymentId === history.id ? 'Checking…' : 'Recheck payment' }}
                  </button>
                  <button
                    v-if="history.payment_can_pay"
                    type="button"
                    class="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    @click="openPaymentRecovery(history)"
                  >
                    {{ history.payment_record_state === 'missing' ? 'Pay now' : 'Resume payment' }}
                  </button>
                  <button
                    v-if="history.payment_issue && history.payment_issue.active"
                    type="button"
                    class="inline-flex items-center justify-center rounded-md border border-amber-500 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
                    @click="openPaymentIssue(history.payment_issue)"
                  >
                    Follow up · {{ history.payment_issue.reference }}
                  </button>
                  <button
                    v-if="history.payment_can_dispute && history.payment_id"
                    type="button"
                    class="inline-flex items-center justify-center rounded-md border border-amber-500 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
                    @click="openDispute(history)"
                  >
                    Dispute payment
                  </button>
                  <button v-else-if="history.payment_dispute" type="button" class="inline-flex items-center rounded-md bg-[#EFEFF6] px-3 py-2 text-xs font-semibold text-[#3939A2] transition hover:bg-[#E0E0F3]" @click="viewDispute(history.payment_dispute)">
                    View dispute · {{ disputeStatusLabel(history.payment_dispute.status) }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="my-8 space-y-4 md:hidden">
        <article
          v-for="(history, index) in paymentHistory"
          :key="`mobile-${history.id}`"
          class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <p class="text-xs text-[#6B7280]">Subscription {{ serialNumber(index) }}</p>
              <p class="mt-1 font-semibold text-[#1A1A1A]">
                <span v-if="!history.amount_redacted">₦{{ $helper.formatAmount(Number(history.amount)) }}/</span>{{ historyTitle(history) }}
              </p>
            </div>
            <span :class="paymentStatusClass(history.payment_status)" class="inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize">
              {{ history.amount_redacted ? 'Campaign subscription' : paymentStatusLabel(history.payment_status, history.payment_record_state) }}
            </span>
          </div>
          <dl class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt class="font-semibold text-[#1A1A1A]">Category</dt>
              <dd class="mt-1 capitalize text-[#545454]">{{ history.category || '—' }}</dd>
            </div>
            <div class="text-right">
              <dt class="font-semibold text-[#1A1A1A]">Reference</dt>
              <dd class="mt-1 break-all text-[#545454]">{{ history.reference || '—' }}</dd>
            </div>
          </dl>
          <div class="mt-5 grid gap-2">
            <button
              type="button"
              class="flex w-full items-center justify-center rounded-md bg-[#08085E] px-8 py-2 text-sm font-medium text-white transition hover:bg-[#3939A2]"
              @click="togglePreviewModal('open', history)"
            >
              View details
            </button>
            <button
              v-if="history.payment_can_verify && history.payment_reference"
              type="button"
              class="flex w-full items-center justify-center rounded-md border border-[#08085E] bg-white px-8 py-2 text-sm font-semibold text-[#08085E] transition hover:bg-[#EFEFF6] disabled:opacity-50"
              :disabled="verifyingPaymentId === history.id"
              @click="recheckPayment(history)"
            >
              {{ verifyingPaymentId === history.id ? 'Checking…' : 'Recheck payment' }}
            </button>
            <button
              v-if="history.payment_can_pay"
              type="button"
              class="flex w-full items-center justify-center rounded-md bg-emerald-600 px-8 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              @click="openPaymentRecovery(history)"
            >
              {{ history.payment_record_state === 'missing' ? 'Pay now' : 'Resume payment' }}
            </button>
            <button
              v-if="history.payment_issue && history.payment_issue.active"
              type="button"
              class="flex w-full items-center justify-center rounded-md border border-amber-500 bg-amber-50 px-8 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
              @click="openPaymentIssue(history.payment_issue)"
            >
              Follow up · {{ history.payment_issue.reference }}
            </button>
            <button
              v-if="history.payment_can_dispute && history.payment_id"
              type="button"
              class="flex w-full items-center justify-center rounded-md border border-amber-500 bg-amber-50 px-8 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
              @click="openDispute(history)"
            >
              Dispute payment
            </button>
            <button v-else-if="history.payment_dispute" type="button" class="rounded-md bg-[#EFEFF6] px-4 py-3 text-center text-sm font-semibold text-[#3939A2] transition hover:bg-[#E0E0F3]" @click="viewDispute(history.payment_dispute)">
              View dispute · {{ disputeStatusLabel(history.payment_dispute.status) }}
            </button>
          </div>
        </article>
      </div>

      <nav
        v-if="pagination.total > 0"
        class="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Subscription history pagination"
      >
        <p class="text-sm text-[#545454]">
          Showing <span class="font-medium">{{ pagination.from }}</span>–<span class="font-medium">{{ pagination.to }}</span>
          of <span class="font-medium">{{ pagination.total }}</span>
        </p>

        <div v-if="pagination.lastPage > 1" class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="pagination-button"
            :disabled="pagination.currentPage === 1 || isLoading"
            aria-label="Go to first page"
            @click="goToPage(1)"
          >
            First
          </button>
          <button
            type="button"
            class="pagination-button"
            :disabled="pagination.currentPage === 1 || isLoading"
            aria-label="Go to previous page"
            @click="goToPage(pagination.currentPage - 1)"
          >
            Previous
          </button>

          <template v-for="item in pageItems">
            <span v-if="item.type === 'ellipsis'" :key="item.key" class="px-1 text-[#6B7280]">…</span>
            <button
              v-else
              :key="item.key"
              type="button"
              class="pagination-button min-w-[2.5rem]"
              :class="item.page === pagination.currentPage ? 'bg-[#08085E] text-white' : ''"
              :aria-current="item.page === pagination.currentPage ? 'page' : null"
              :aria-label="`Go to page ${item.page}`"
              :disabled="isLoading"
              @click="goToPage(item.page)"
            >
              {{ item.page }}
            </button>
          </template>

          <button
            type="button"
            class="pagination-button"
            :disabled="pagination.currentPage === pagination.lastPage || isLoading"
            aria-label="Go to next page"
            @click="goToPage(pagination.currentPage + 1)"
          >
            Next
          </button>
          <button
            type="button"
            class="pagination-button"
            :disabled="pagination.currentPage === pagination.lastPage || isLoading"
            aria-label="Go to last page"
            @click="goToPage(pagination.lastPage)"
          >
            Last
          </button>
        </div>
      </nav>
    </template>

    <dashboard-subscription-preview-modal
      v-if="previewModalState"
      :modal-state="previewModalState"
      :payment-data="paymentData"
      @toggle-modal="closeModal"
    />

    <dashboard-subscription-history-payment-modal
      v-if="paymentRecoveryModalState"
      :modal-state="paymentRecoveryModalState"
      :subscription="paymentRecoverySubscription"
      @close="closePaymentRecovery"
      @completed="onPaymentRecoveryCompleted"
      @issue-raised="onPaymentIssueRaised"
    />

    <dashboard-subscription-payment-issue-follow-up-modal
      v-if="paymentIssueModalState"
      :modal-state="paymentIssueModalState"
      :issue="selectedPaymentIssue"
      @close="closePaymentIssue"
      @submitted="onPaymentIssueFollowUp"
    />

    <dashboard-subscription-payment-dispute-status-modal
      v-if="disputeStatusModalState"
      :dispute="selectedDispute"
      @close="closeDisputeStatus"
      @updated="onDisputeUpdated"
    />

    <dashboard-subscription-payment-dispute-modal
      v-if="disputeModalState"
      :payment="disputePayment"
      @close="closeDispute"
      @submitted="onDisputeSubmitted"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      paymentHistory: [],
      previewModalState: false,
      paymentData: {},
      disputeModalState: false,
      disputePayment: {},
      disputeStatusModalState: false,
      selectedDispute: {},
      paymentIssueModalState: false,
      selectedPaymentIssue: {},
      paymentRecoveryModalState: false,
      paymentRecoverySubscription: {},
      verifyingPaymentId: null,
      searchQuery: '',
      appliedSearch: '',
      requestSequence: 0,
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 15,
        from: 0,
        to: 0,
        total: 0,
      },
    }
  },
  computed: {
    pageItems() {
      const current = this.pagination.currentPage
      const last = this.pagination.lastPage
      const pages = new Set([1, last, current - 1, current, current + 1])
      const validPages = [...pages]
        .filter((page) => page >= 1 && page <= last)
        .sort((a, b) => a - b)
      const items = []

      validPages.forEach((page, index) => {
        const previous = validPages[index - 1]
        if (index > 0 && page - previous > 1) {
          items.push({ type: 'ellipsis', key: `ellipsis-${previous}-${page}` })
        }
        items.push({ type: 'page', page, key: `page-${page}` })
      })

      return items
    },
  },
  methods: {
    async getSubscriptions(page = 1, { scroll = false } = {}) {
      const requestId = ++this.requestSequence
      this.isLoading = true
      this.errorMessage = ''

      try {
        const { data } = await this.$api.subscription.getSubscriptions({
          page,
          perPage: this.pagination.perPage,
          search: this.appliedSearch,
        })

        if (requestId !== this.requestSequence) return

        this.paymentHistory = Array.isArray(data.data) ? data.data : []
        const meta = data.meta || {}
        this.pagination = {
          currentPage: Number(meta.current_page || page),
          lastPage: Math.max(1, Number(meta.last_page || 1)),
          perPage: Number(meta.per_page || this.pagination.perPage),
          from: Number(meta.from || (this.paymentHistory.length ? 1 : 0)),
          to: Number(meta.to || this.paymentHistory.length),
          total: Number(meta.total || this.paymentHistory.length),
        }

        if (scroll && this.$refs.historySection) {
          this.$nextTick(() => {
            this.$refs.historySection.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          })
        }
      } catch (error) {
        if (requestId !== this.requestSequence) return
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') console.trace(errorResponse)
        this.errorMessage = errorResponse.message
      } finally {
        if (requestId === this.requestSequence) this.isLoading = false
      }
    },
    applySearch() {
      this.appliedSearch = this.searchQuery.trim()
      this.getSubscriptions(1)
    },
    clearSearch() {
      this.searchQuery = ''
      this.appliedSearch = ''
      this.getSubscriptions(1)
    },
    goToPage(page) {
      const target = Math.min(
        Math.max(Number(page) || 1, 1),
        this.pagination.lastPage
      )
      if (target === this.pagination.currentPage || this.isLoading) return
      this.getSubscriptions(target, { scroll: true })
    },
    serialNumber(index) {
      return (this.pagination.from || 1) + index
    },
    historyTitle(history) {
      const title = String(history?.title || '').trim()
      if (title) return title
      return `Historical subscription #${history?.id || 'record'}`
    },
    paymentStatusLabel(status, recordState = '') {
      if (String(recordState).toLowerCase() === 'missing' || !status) {
        return 'Payment record missing'
      }
      return String(status).replace(/_/g, ' ')
    },
    paymentStatusClass(status) {
      const normalized = String(status || '').toLowerCase()
      if (['paid', 'success', 'successful', 'completed'].includes(normalized)) {
        return 'bg-[#D6F3E9] text-[#0B973A]'
      }
      if (['unpaid', 'pending', 'processing', 'initiated'].includes(normalized)) {
        return 'bg-amber-100 text-amber-800'
      }
      if (['failed', 'cancelled', 'declined', 'refunded'].includes(normalized)) {
        return 'bg-[#FDF2F2] text-[#E02424]'
      }
      return 'bg-gray-100 text-gray-700'
    },
    openPaymentRecovery(history) {
      this.paymentRecoverySubscription = history
      this.paymentRecoveryModalState = true
    },
    closePaymentRecovery() {
      this.paymentRecoveryModalState = false
      this.paymentRecoverySubscription = {}
    },
    onPaymentRecoveryCompleted() {
      this.closePaymentRecovery()
      this.getSubscriptions(this.pagination.currentPage)
    },
    onPaymentIssueRaised() {
      this.getSubscriptions(this.pagination.currentPage)
    },
    openPaymentIssue(issue) {
      this.selectedPaymentIssue = issue || {}
      this.paymentIssueModalState = true
    },
    closePaymentIssue() {
      this.paymentIssueModalState = false
      this.selectedPaymentIssue = {}
    },
    onPaymentIssueFollowUp() {
      this.closePaymentIssue()
      this.getSubscriptions(this.pagination.currentPage)
    },
    async recheckPayment(history) {
      if (!history?.payment_reference || this.verifyingPaymentId) return
      this.verifyingPaymentId = history.id
      try {
        const response = await this.$api.subscription.confirmSubscription({
          reference: history.payment_reference,
          external_reference: history.payment_external_reference || null,
        })
        const payment = response?.data?.success?.data || {}
        const paid = String(payment?.status || '').toLowerCase() === 'paid'
        const accessGranted = Boolean(payment?.subscription_access_granted)
        this.$notify({
          type: paid && accessGranted ? 'success' : paid ? 'warning' : 'info',
          title: paid ? 'Payment confirmed' : 'Payment still unpaid',
          text: paid && accessGranted
            ? 'The payment provider confirmed this subscription payment and the entitlements are available.'
            : paid
            ? 'The payment is confirmed, but subscription access is not available yet. Customer Service must review it; do not make another payment.'
            : 'The provider has not confirmed a successful payment yet. You can resume the payment checkout.',
          duration: paid && !accessGranted ? 9000 : 5000,
        })
        await this.getSubscriptions(this.pagination.currentPage)
      } catch (error) {
        const parsed = this.$errorHandler.setAndParse(error)
        this.$notify({ type: 'error', title: 'Payment check failed', text: parsed.message, duration: 5000 })
      } finally {
        this.verifyingPaymentId = null
      }
    },
    disputeStatusLabel(status) {
      return String(status || 'open').replace(/_/g, ' ')
    },
    openDispute(history) {
      this.disputePayment = history
      this.disputeModalState = true
    },
    closeDispute() {
      this.disputeModalState = false
      this.disputePayment = {}
    },
    viewDispute(dispute) {
      this.selectedDispute = dispute
      this.disputeStatusModalState = true
    },
    closeDisputeStatus() {
      this.disputeStatusModalState = false
      this.selectedDispute = {}
    },
    onDisputeUpdated() {
      this.closeDisputeStatus()
      this.getSubscriptions(this.pagination.currentPage)
    },
    onDisputeSubmitted() {
      this.closeDispute()
      this.getSubscriptions(this.pagination.currentPage)
    },
    togglePreviewModal(status = 'open', data = {}) {
      if (status === 'open') {
        this.paymentData = data
        this.previewModalState = true
        return
      }
      this.previewModalState = false
    },
    closeModal() {
      this.previewModalState = false
    },
  },
  mounted() {
    this.getSubscriptions()
  },
}
</script>

<style scoped>
.pagination-button {
  @apply rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-[#3D3D3D] transition hover:border-[#08085E] hover:bg-[#EFEFF6] disabled:cursor-not-allowed disabled:opacity-50;
}
</style>
