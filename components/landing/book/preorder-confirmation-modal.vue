<template>
  <utils-modal @close="closeModal" v-show="visible">
    <template v-slot:header>
      <h2 class="text-xl font-semibold text-[#08085E]">Purchase Confirmed</h2>
    </template>

    <template v-slot:body>
      <div class="space-y-4 text-center">
        <p class="text-lg font-medium">Thank you for your Purchase!</p>
        <p>
          You have successfully placed an Order for
          <strong>{{ bookTitle }}</strong
          >.
        </p>
        <p>
          Amount: <strong>${{ amountDisplay }}</strong>
        </p>
        <p>We will notify you once the book is available.</p>
        <button
          @click="closeModal"
          class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Close
        </button>
      </div>
    </template>
  </utils-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    bookTitle: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    amountDisplay() {
      // Convert cents or string to formatted dollar amount if needed
      return (this.amount / 100).toFixed(2)
    },
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
}
</script>
