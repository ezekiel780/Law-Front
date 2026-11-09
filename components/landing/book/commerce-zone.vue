<template>
  <!-- Product Info and Actions -->
  <div class="w-full p-4 flex-1">
    <!-- Title and author -->
    <div class="mt-4 xl:text-left mb-8">
      <div class="mb-3">
        <h1 class="text-2xl xl:text-3xl font-semibold">
          Nigerian Case Law Dictionary
        </h1>
        <p class="text-gray-600">
          by
          <span class="text-blue-600 hover:underline"
            >Nigerian Law Publications limited</span
          >
        </p>
      </div>
      <div class="xl:text-lg">
        <p>
          More than just a conventional legal dictionary with all the words and
          phrases defined by superior courts.
        </p>
        <p>
          The Nigerian case law dictionary gives you accurate legal definitions,
          each with citations from Nigerian courts.
        </p>
        <p><b>*</b>Build stronger arguments</p>
        <p><b>*</b>Cite confidently</p>
        <p><b>*</b>Work faster</p>
      </div>
    </div>

    <!-- Price -->
    <div class="mb-4">
      <p class="text-xl font-semibold">Hardback</p>
      <span class="text-xl font-bold">₦70,000</span>
    </div>

    <!-- Purchase Options -->
    <div
      class="mb-6 xl:flex justify-between items-center border border-gray-950 py-8 px-4"
    >
      <div>
        <p class="font-bold xl:text-2xl">Deliver this item</p>
        <p class="xl:text-lg">Available for Purchase.</p>
      </div>
      <div>
        <button
          @click="$emit('preorder-clicked')"
          class="mt-2 px-4 xl:px-8 py-2 xl:py-3 bg-blue-600 text-white rounded hover:bg-blue-700 xl:text-lg xl:font-semibold"
        >
          BUY NOW
        </button>
      </div>
    </div>
  </div>
</template>
