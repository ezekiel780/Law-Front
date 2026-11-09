<template>
  <div class="h-[100px] flex items-center justify-between">
    <!-- Book Info (Left Section) -->
    <div class="flex items-center space-x-3 min-w-0 h-full">
      <div class="h-full flex items-center">
        <utils-image-fallback
          :src="one"
          alt="Nigerian Case Law Dictionary"
          fallback-title="Nigerian Case Law Dictionary"
          icon="ri-book-open-line"
          variant="logo"
          container-class="h-20 w-16"
          image-class="object-contain bg-white p-1"
        />
      </div>
      <div class="truncate leading-tight">
        <h1 class="text-sm font-semibold">Nigerian Case Law Dictionary</h1>
        <p class="text-gray-600">
          by
          <span class="text-blue-600 hover:underline"
            >Nigerian Law Publications limited</span
          >
        </p>
      </div>
    </div>

    <!-- Purchase Section (Right Section) -->
    <div class="flex items-center space-x-3 flex-shrink-0">
      <span class="text-xl font-bold">₦70,000</span>
      <button
        @click="$emit('preorder-clicked')"
        class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded"
      >
        BUY NOW
      </button>
    </div>
  </div>
</template>

<script setup>
import one from '@/assets/images/book/1.jpg'
</script>
