<template>
  <section class="flex-no-shrink">
    <div class="flex flex-wrap container mx-auto">
      <!-- Product Image and Title -->
      <div class="w-full p-4 flex flex-col items-center lg:items-start">
        <!-- Image Container -->
        <div
          class="w-full max-w-md h-[640px] rounded shadow-md bg-gray-100 flex items-center justify-center"
        >
          <!-- Main Image -->
          <utils-image-fallback
            :src="selectedImage"
            alt="Nigerian Case Law Dictionary"
            fallback-title="Nigerian Case Law Dictionary"
            fallback-subtitle="Authoritative legal reference by Nigerian Law Publications"
            icon="ri-book-open-line"
            variant="cover"
            container-class="w-full h-full"
            image-class="object-contain bg-white"
          />
        </div>

        <!-- Thumbnails -->
        <div class="flex gap-3 mt-4">
          <img
            v-for="(img, index) in thumbnails"
            :key="index"
            :src="img"
            alt="Thumbnail"
            @click="selectedImage = img"
            :class="[
              'w-16 h-16 object-cover rounded cursor-pointer border-2',
              selectedImage === img ? 'border-blue-600' : 'border-transparent',
            ]"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import one from '@/assets/images/book/1.jpg'
import two from '@/assets/images/book/2.jpg'
import three from '@/assets/images/book/3.jpg'
import four from '@/assets/images/book/4.jpg'
import five from '@/assets/images/book/5.jpg'
const thumbnails = [one, two, three, four, five]
const selectedImage = ref(thumbnails[0])
</script>
