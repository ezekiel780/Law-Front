<template>
  <div class="container mx-auto px-4 py-6 min-h-screen overflow-y-auto">
    <div class="md:flex justify-between items-center">
      <HeroSection />
      <CommerceZone @preorder-clicked="openModal" />
    </div>
    <PaymentModal
      :modalState="modalVisible"
      :amount="amount"
      :paymentMethods="paymentMethods"
      @toggle-modal="toggleModal"
      @payment-started="handlePaymentStarted"
    />
    <PreorderConfirmationModal
      :visible="confirmationVisible"
      :bookTitle="bookTitle"
      :amount="amount"
      @close="confirmationVisible = false"
    />
  </div>
</template>

<script>
import HeroSection from './hero-section.vue'
import CommerceZone from './commerce-zone.vue'
import PaymentModal from './payment-modal.vue'
import PreorderConfirmationModal from './preorder-confirmation-modal.vue'

export default {
  components: { HeroSection, CommerceZone, PaymentModal, PreorderConfirmationModal },
  data() {
    return {
      modalVisible: false,
      confirmationVisible: false,
      bookTitle: 'Nigerian Case Law Dictionary',
      amount: 59500,
      paymentMethods: [],
    }
  },
  async mounted() {
    try {
      const methods = await this.$api.subscription.getPaymentMethods()
      this.paymentMethods = (methods || []).filter((method) =>
        ['paystack', 'flutterwave'].includes(String(method.gateway_code || method.slug || method.title || '').toLowerCase())
      )
    } catch (_) {
      this.paymentMethods = []
    }
  },
  methods: {
    openModal() { this.modalVisible = true },
    toggleModal() { this.modalVisible = !this.modalVisible },
    handlePaymentStarted() { this.modalVisible = false },
    showConfirmation() { this.confirmationVisible = true },
  },
}
</script>
