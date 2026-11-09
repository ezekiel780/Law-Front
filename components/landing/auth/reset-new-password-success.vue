<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-5 mb-2">
    <!-- Hero -->
    <div class="max-w-[85rem] md:max-w-[26rem] mx-auto">
      <h1
        class="block text-xl text-center font-bold text-[#1A1A1A] sm:text-2xl lg:text-4xl leading-8"
      >
        Reset Successful
      </h1>
      <!-- Form -->
      <div
        class="mt-6 text-[#4A4A4A] font-light grid md:grid-cols-2 gap-4 md:gap-8"
      >
        <div class="col-span-2 text-center text-[#7C7C7C]">
          Password reset successfully. Please login with your new password.
        </div>
        <div class="col-span-2 mt-6 grid gap-3 w-full flex justify-center">
          <nuxt-link
            to="/auth/login"
            type="button"
            class="py-3 px-10 inline-flex justify-center items-center gap-2 rounded-xl border border-transparent font-medium bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          >
            Login
          </nuxt-link>
        </div>
      </div>
      <!-- End Form -->
    </div>
    <!-- End Hero -->
  </div>
</template>
