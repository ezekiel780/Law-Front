<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-5 mb-2">
    <!-- Recent Publications -->
    <div>
      <div class="flex flex-col items-center justify-center md:w-2/3 mx-auto">
        <p class="text-[#DDC524]">Publications</p>
        <h4 class="text-[#1A1A1A] text-2xl font-semibold my-6">
          Recently Published Judgments
        </h4>
      </div>
    </div>
    <!-- End Recent Publications -->

    <!-- Slider -->
    <utils-carousel
      class="py-10"
      v-if="recentJudgement && recentJudgement.length > 0"
    >
      <div
        v-for="(judgement, index) in recentJudgement"
        :key="`recent-judgement-${index}`"
      >
        <div
          class="w-60 h-auto rounded-lg shadow-xl m-12 flex flex-col justify-between text-[#1A1A1A] p-4"
        >
          <div class="flex flex-row justify-between items-center">
            <p class="text-sm font-light">PART {{ judgement.part }}</p>
            <img class="" src="@/assets/icons/gavel.svg" alt="Gavel Icon" />
          </div>
          <div class="font-medium">
            {{ judgement.case_name }}
          </div>
          <div class="text-sm font-light text-[#B0B0B0]">
            {{ $moment(recentJudgement.published_date).format('DD MMM, YYYY') }}
          </div>
        </div>
      </div>
    </utils-carousel>
    <!-- End Slider -->
  </div>
</template>

<script>
export default {
  props: {
    recentJudgement: {
      type: Array,
      default: [],
    },
  },
}
</script>
