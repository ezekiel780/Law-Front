<template>
  <div class="text-[#1A1A1A] mb-10">
    <div class="flex justify-between items-center my-5">
      <p class="font-medium">Recent Judgments</p>
      <p class="cursor-pointer">View All</p>
    </div>
    <div class="grid grid-cols-1 gap-4 md:gap-8">
      <div
        v-for="(judgements, part) in allRecentJudgements"
        :key="`judgement_part_${part}`"
      >
        <p class="font-bold text-lg mb-4">PART {{ part }}</p>
        <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
          <div
            class="mb-6"
            v-for="(recentJudgement, index) in judgements"
            :key="`recent_judgement_${index}`"
          >
            <a
              v-if="canOpenCases"
              :href="caseHref(recentJudgement)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                class="w-auto h-auto bg-white rounded-lg shadow-xl flex flex-col justify-between text-[#1A1A1A] p-4 gap-5"
              >
                <div class="flex flex-row justify-between items-center">
                  <img src="@/assets/icons/gavel.svg" alt="Gavel Icon" />
                </div>
                <div class="font-medium">{{ recentJudgement.case_name }}</div>
                <div class="flex flex-row justify-between items-center">
                  <div class="text-sm font-light text-[#B0B0B0]">
                    {{
                      $moment(recentJudgement.published_date).format(
                        'DD MMM, YYYY'
                      )
                    }}
                  </div>
                  <div class="text-sm font-light text-[#1A1A1A]">
                    {{ recentJudgement.court }}
                  </div>
                </div>
              </div>
            </a>
            <div
              v-else
              aria-disabled="true"
              title="An active NWLR subscription is required to open this case"
            >
              <div
                class="w-auto h-auto bg-white rounded-lg shadow-xl flex flex-col justify-between text-[#1A1A1A] p-4 gap-5"
              >
                <div class="flex flex-row justify-between items-center">
                  <img src="@/assets/icons/gavel.svg" alt="Gavel Icon" />
                </div>
                <div class="font-medium">{{ recentJudgement.case_name }}</div>
                <div class="flex flex-row justify-between items-center">
                  <div class="text-sm font-light text-[#B0B0B0]">
                    {{
                      $moment(recentJudgement.published_date).format(
                        'DD MMM, YYYY'
                      )
                    }}
                  </div>
                  <div class="text-sm font-light text-[#1A1A1A]">
                    {{ recentJudgement.court }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="md:col-span-2 xl:col-span-3 flex flex-col justify-center items-center"
            v-if="allRecentJudgements.length == 0"
          >
            <img
              class="w-1/2 h-auto"
              src="@/assets/images/no-case-found.png"
              alt="Not Found"
              v-if="true === false"
            />
            <p class="text-[#B0B0B0] text-sm">No Recent Judgement</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    allRecentJudgements: {
      type: Object,
      default: () => ({}),
    },
    canOpenCases: {
      type: Boolean,
      default: false,
    },
  },
  name: 'RecentsJudgement',
  data() {
    return {}
  },
  computed: {},
  methods: {
    caseHref(recentJudgement = {}) {
      const part = Number(recentJudgement.part)
      const pageStart = Number(recentJudgement.page_start)
      if (!Number.isInteger(part) || part < 1 || !Number.isInteger(pageStart) || pageStart < 1) {
        return '#'
      }
      return `/dashboard/legal-research/${part}_1_${pageStart}`
    },
    formatPiDxpln(pid) {
      const pidArray = pid.split('_')
      return `PART ${pidArray[0]}`
    },
    openInNewTab(link = '') {
      window.open(this.$router.resolve(link).href, '_blank')
    },
  },
  mounted() {},
}
</script>
