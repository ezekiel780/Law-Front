<template>
  <div class="flex flex-col space-y-3">
    <!-- required field -->
    <div
      class="flex items-center text-[#E02424] text-xs"
      v-if="field.required !== undefined && !field.required"
    >
      {{ fieldName }} is required!
    </div>
    <!-- invalid email -->
    <div
      class="flex items-center text-[#E02424] text-xs"
      v-if="field.email !== undefined && !field.email"
    >
      {{ fieldName }} must be valid (name@example.com)
    </div>
    <!-- invalid number -->
    <div
      class="flex items-center text-[#E02424] text-xs"
      v-if="field.numeric !== undefined && !field.numeric"
    >
      {{ fieldName }} must be a number
    </div>
    <!-- minLength -->
    <div
      class="flex items-center text-[#E02424] text-xs"
      v-if="field.minLength !== undefined && !field.minLength"
    >
      {{ fieldName }} should at least
      {{ field.$params.minLength.min }} characters
    </div>
    <!-- maxLength -->
    <div
      class="flex items-center text-[#E02424] text-xs"
      v-if="field.maxLength !== undefined && !field.maxLength"
    >
      {{ fieldName }} should not be more than
      {{ field.$params.maxLength.max }} characters
    </div>
    <!-- phoneLength -->
    <div
      class="flex items-center text-[#E02424] text-xs"
      v-if="field.phoneLength !== undefined && !field.phoneLength"
    >
      {{ fieldName }} must be valid - (08123456789)
    </div>
    <!-- passwordPolicy -->
    <div
      class="flex flex-col mt-3 text-[#E02424] text-xs"
      v-if="field.passwordPolicy !== undefined && !field.passwordPolicy"
    >
      <span class="text-[#655C5B]">{{ fieldName }} must contain:</span>
      <ul class="list-disc list-inside">
        <li>At least 1 uppercase letter</li>
        <li>At least 1 lowercase letter</li>
        <li>At least 1 number or special character (!@#$%^&*)</li>
        <li>At least 8 characters</li>
      </ul>
    </div>
    <!-- sameAsPassword -->
    <div
      class="flex items-center text-[#E02424] text-xs"
      v-if="field.sameAsPassword !== undefined && !field.sameAsPassword"
    >
      {{ fieldName }} must be the same as password
    </div>
    <!-- minAmount -->
    <div
      class="flex items-center text-[#E02424] text-xs"
      v-if="field.minAmount !== undefined && !field.minAmount"
    >
      {{ fieldName }} must be at least {{ field.$params.minAmount.min }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      required: true,
    },
    fieldName: {
      type: String,
      default: 'Field',
    },
  },
}
</script>
