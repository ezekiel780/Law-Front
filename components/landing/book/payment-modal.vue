<template>
  <utils-modal @close="toggleModal" v-show="modalState">
    <template v-slot:header>
      <div class="text-lg font-semibold text-[#08085E] flex gap-2 items-center">
        <utils-svg-loader icon="payment" />
        Complete Your Purchase
      </div>
    </template>

    <template v-slot:body>
      <div>
        <div class="font-medium text-[#08085E]">Select Payment Method</div>
        <div class="my-4 space-y-2">
          <div
            v-for="(method, index) in paymentMethods"
            :key="index"
            @click="setPaymentMethod(method.title)"
            :class="[
              'flex items-center justify-between p-3 border rounded cursor-pointer transition',
              selectedPaymentMethod === method.title
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200',
            ]"
          >
            <span>{{ method.title }}</span>
            <input
              type="radio"
              :checked="selectedPaymentMethod === method.title"
              class="form-radio text-blue-600"
            />
          </div>
          <div v-if="!paymentMethods || paymentMethods.length === 0" class="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Online payment is temporarily unavailable because no configured payment provider is currently available.
          </div>
          <div
            v-if="!selectedPaymentMethod && $v.selectedPaymentMethod.$dirty"
            class="text-red-600 text-sm mt-2"
          >
            * Payment method is required.
          </div>
          <div>
            <label>First Name</label>
            <input
              v-model="firstname"
              type="text"
              class="w-full p-2 border rounded mt-1"
            />
            <div
              v-if="!$v.firstname.required && $v.firstname.$dirty"
              class="text-red-600 text-sm mt-1"
            >
              * First name is required.
            </div>
          </div>

          <div>
            <label>Last Name</label>
            <input
              v-model="lastname"
              type="text"
              class="w-full p-2 border rounded mt-1"
            />
            <div
              v-if="!$v.lastname.required && $v.lastname.$dirty"
              class="text-red-600 text-sm mt-1"
            >
              * Last name is required.
            </div>
          </div>

          <div>
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              class="w-full p-2 border rounded mt-1"
            />
            <div
              v-if="!$v.email.required && $v.email.$dirty"
              class="text-red-600 text-sm mt-1"
            >
              * Email is required.
            </div>
          </div>

          <div>
            <label>Phone</label>
            <input
              v-model="phone"
              type="tel"
              class="w-full p-2 border rounded mt-1"
            />
            <div
              v-if="!$v.phone.required && $v.phone.$dirty"
              class="text-red-600 text-sm mt-1"
            >
              * Phone number is required.
            </div>
          </div>

          <div>
            <label>Address</label>
            <textarea
              v-model="address"
              class="w-full p-2 border rounded mt-1"
              rows="3"
            ></textarea>
            <div
              v-if="!$v.address.required && $v.address.$dirty"
              class="text-red-600 text-sm mt-1"
            >
              * Address is required.
            </div>
          </div>

          <div>
            <span>Quantity</span>
            <input
              type="number"
              v-model="quantity"
              class="w-full p-2 border rounded mt-1"
              placeholder="Enter quantity"
              min="1"
            />
          </div>
          <div
            v-if="quantity < 1 && $v.quantity.$dirty"
            class="text-red-600 text-sm mt-2"
          >
            * Quantity must be at least 1.
          </div>
        </div>

        <utils-button
          class="mt-6 w-full bg-[#08085E] text-white py-3 rounded hover:bg-[#3939A2]"
          :on-click="createPreorder"
          :button-state="isPaying"
          :disabled="!paymentMethods || paymentMethods.length === 0"
        >
          Proceed to Payment
        </utils-button>
      </div>
    </template>
  </utils-modal>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'

export default {
  props: {
    modalState: Boolean,
    amount: {
      type: Number,
      required: true,
    },
    paymentMethods: Array,
  },
  data() {
    return {
      isPaying: false,
      selectedPaymentMethod: null,
      quantity: 1,
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      address: '',
    }
  },
  validations() {
    return {
      selectedPaymentMethod: { required },
      quantity: { minValue: minValue(1) },
      firstname: { required },
      lastname: { required },
      email: { required },
      phone: { required },
      address: { required },
    }
  },
  methods: {
    toggleModal() {
      this.$emit('toggle-modal')
    },
    setPaymentMethod(method) {
      this.selectedPaymentMethod = method
    },
    getCallbackUrl() {
      const host = window.location.host
      return `${window.location.protocol}//${host}/dictionary-hardcopy`
    },
    async createPreorder() {
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.isPaying = true
      try {
        const {
          data: { data },
        } = await this.$api.order.createPreOrder({
          quantity: Number(this.quantity),
          amount: Number(this.amount),
          payment_method: this.selectedPaymentMethod.toLowerCase(),
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          phone: this.phone,
          address: this.address,
          callback_url: this.getCallbackUrl(),
        })
        this.$notify({
          type: 'info',
          title: 'Purchase created',
          text: data.message,
        })
        // Emit event to show confirmation modal before redirecting
        this.$emit('payment-success')
        window.location.href = data.payment_url
      } catch (error) {
        const err = this.$errorHandler.setAndParse(error)
        this.$notify({
          type: 'error',
          title: 'Purchase Failed',
          text: err.message,
        })
      } finally {
        this.isPaying = false
      }
    },
  },
}
</script>
