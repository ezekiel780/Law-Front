<template>
  <div class="px-4 pb-8 sm:px-6 lg:px-8">
    <div class="catalog-intro">
      <div>
        <p class="catalog-eyebrow">Subscription plans</p>
        <h2>Choose your plan</h2>
        <p>Select the access and billing option that works for you.</p>
      </div>
    </div>

    <subscription-catalog :plans="allPlans" @select-plan="payForPlan" />

    <dashboard-subscription-payment-modal
      v-if="paymentModalState"
      :modal-state="paymentModalState"
      :payment-methods="subscriptionData.payment"
      :plan-id="planId"
      :plan="selectedPlan"
      :amount="amount"
      @toggle-modal="togglePaymentModal"
    />
  </div>
</template>

<script>
export default {
  props: {
    subscriptionData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      paymentModalState: false,
      planId: null,
      selectedPlan: null,
      amount: 0,
    }
  },
  computed: {
    allPlans() {
      const candidates = this.subscriptionData.all || [
        ...(this.subscriptionData.premium || []),
        ...(this.subscriptionData.individual || []),
        ...(this.subscriptionData.corporate || []),
      ]
      const seen = new Set()

      return candidates.filter((plan) => {
        if (!plan || plan.id == null) return false
        const key = String(plan.id)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    },
  },
  methods: {
    payForPlan(plan) {
      if (Number(plan.amount || 0) <= 0) {
        this.$router.push('/contact-us')
        return
      }

      this.planId = plan.id
      this.selectedPlan = plan
      this.amount = plan.amount
      this.togglePaymentModal()
    },
    togglePaymentModal() {
      this.paymentModalState = !this.paymentModalState
    },
  },
}
</script>

<style scoped>
.catalog-intro {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.catalog-eyebrow {
  color: #8a7600;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.catalog-intro h2 {
  margin-top: 0.2rem;
  color: #111827;
  font-size: 1.3rem;
  font-weight: 900;
}

.catalog-intro p:last-child {
  margin-top: 0.25rem;
  color: #667085;
  font-size: 0.82rem;
}
</style>
