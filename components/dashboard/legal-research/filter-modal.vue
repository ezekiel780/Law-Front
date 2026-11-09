<template>
  <div>
    <utils-modal @close="toggleModal" v-show="modalState">
      <template v-slot:header>
        <span class="flex gap-4 items-center cursor-pointer">
          <utils-svg-loader
            icon="filter-icon"
            class="cursor-pointer"
            color="#08085E"
          />
          <span class="font-medium text-[#08085E]">Filter</span>
        </span>
      </template>

      <!-- Body slot -->
      <template v-slot:body>
        <div class="grid gap-4">
          <div class="flex justify-between gap-2">
            <label
              for="input-label"
              class="w-1/4 pt-3 block text-sm font-medium mb-2"
              >Word/Phrase Match</label
            >
            <select
              class="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2] bg-[#EFEFF6]"
              v-model="mode"
            >
              <option
                v-for="(mode, index) in modeList"
                :key="`mode-${index}`"
                :value="mode.value"
              >
                {{ mode.option }}
              </option>
            </select>
          </div>
          <div class="flex justify-between gap-2">
            <label
              for="input-label"
              class="w-1/4 pt-3 block text-sm font-medium mb-2"
              >Search Mode</label
            >
            <select
              class="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2] bg-[#EFEFF6]"
              v-model="type"
            >
              <option
                v-for="(type, index) in typeList"
                :key="`type-${index}`"
                :value="type.value"
              >
                {{ type.option }}
              </option>
            </select>
          </div>
          <div class="flex justify-between gap-2 hidden">
            <select
              class="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2] bg-[#EFEFF6]"
              v-model="sort"
            >
              <option>Select Sort</option>
              <option
                v-for="(sort, index) in sortList"
                :key="`sort-${index}`"
                :value="sort.value"
              >
                {{ sort.option }}
              </option>
            </select>
          </div>
          <div class="flex justify-between gap-2" v-if="true === false">
            <label
              for="input-label"
              class="w-1/4 pt-3 block text-sm font-medium mb-2"
              >Start Date</label
            >
            <input
              type="date"
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              placeholder="Enter Start Date (yyyy-mm-dd)"
              v-model="startDate"
            />
          </div>
          <div class="flex justify-between gap-2" v-if="true === false">
            <label
              for="input-label"
              class="w-1/4 pt-3 block text-sm font-medium mb-2"
              >End Date</label
            >
            <input
              type="date"
              class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              placeholder="Enter End Date (yyyy-mm-dd)"
              v-model="endDate"
            />
          </div>
          <div class="flex justify-between gap-2">
            <label
              for="input-label"
              class="w-1/4 pt-3 block text-sm font-medium mb-2"
              >Justice</label
            >
            <input
              type="text"
              class="bg-[#E6E6F4] p-3 w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              placeholder="Enter judge name"
              v-model="justice"
            />
          </div>
          <div class="flex justify-between gap-2">
            <label
              for="input-label"
              class="w-1/4 pt-3 block text-sm font-medium mb-2"
              >Counsel</label
            >
            <input
              type="text"
              class="bg-[#E6E6F4] p-3 w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              placeholder="Enter counsel name"
              v-model="counsel"
            />
          </div>
          <div class="flex justify-between gap-2">
            <label
              for="input-label"
              class="w-1/4 pt-3 block text-sm font-medium mb-2"
              >Parties</label
            >
            <input
              type="text"
              class="bg-[#E6E6F4] p-3 w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
              placeholder="Enter party name"
              v-model="parties"
            />
          </div>
          <div class="flex justify-between gap-2">
            <label
              for="input-label"
              class="w-1/4 pt-3 block text-sm font-medium mb-2"
              >Court</label
            >
            <select
              class="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2] bg-[#EFEFF6]"
              v-model="court"
            >
              <option value="">Select court type</option>
              <option
                v-for="(court, index) in courtTypeList"
                :key="`court-type-${index}`"
                :value="court.value"
              >
                {{ court.option }}
              </option>
            </select>
          </div>
          <div v-if="isCourtOfAppeal" class="flex justify-between gap-2">
            <label
              for="input-label"
              class="w-1/4 pt-3 block text-sm font-medium mb-2"
              >Division</label
            >
            <select
              class="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2] bg-[#EFEFF6]"
              v-model="division"
            >
              <option :value="null">Select court division</option>
              <option
                v-for="(division, index) in courtDivisionList"
                :key="`court-division-${index}`"
                :value="division.value"
              >
                {{ division.option }}
              </option>
            </select>
          </div>
          <utils-button
            class="py-3 px-10 rounded-xl border border-transparent bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all"
            :on-click="setFilter"
          >
            Search
          </utils-button>
        </div>
      </template>
    </utils-modal>
  </div>
</template>

<script>
export default {
  props: {
    toggleModal: {
      type: Function,
      default: () => {},
    },
    modalState: {
      type: Boolean,
      default: false,
    },
    currentFilter: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      matchWord: null,
      searchMode: null,
      judgeName: null,
      counselName: null,
      partyName: null,
      courtType: null,
      courtDivision: null,

      modeList: [
        {
          value: 'best_fields',
          option: 'Match Word',
        },
        {
          value: 'phrase',
          option: 'Match Phrase',
        },
      ],
      typeList: [
        {
          value: 'default',
          option: 'Default',
        },
        {
          value: 'principle',
          option: 'Principle',
        },
        {
          value: 'case',
          option: 'Case',
        },
      ],
      sortList: [
        {
          value: 'desc',
          option: 'Newest first',
        },
        {
          value: 'asc',
          option: 'Oldest first',
        },
        {
          value: 'default',
          option: 'Default',
        },
      ],
      startDateList: [
        // yyyy-mm-dd
        {
          value: '1991-07-10',
          option: 'Start Date',
        },
      ],
      endDateList: [
        // yyyy-mm-dd
        {
          value: '2024-01-10',
          option: 'End Date',
        },
      ],
      courtTypeList: [
        {
          value: 'SUPREME COURT OF NIGERIA',
          option: 'SUPREME COURT OF NIGERIA',
        },
        {
          value: 'COURT OF APPEAL',
          option: 'COURT OF APPEAL',
        },
      ],
      courtDivisionList: [
        {
          value: 'Abuja Headquarters',
          option: 'Abuja Headquarters',
        },
        {
          value: 'Abuja',
          option: 'Abuja',
        },
        {
          value: 'Akure',
          option: 'Akure',
        },
        {
          value: 'Benin',
          option: 'Benin',
        },
        {
          value: 'Calabar',
          option: 'Calabar',
        },
        {
          value: 'Ekiti',
          option: 'Ekiti',
        },
        {
          value: 'Enugu',
          option: 'Enugu',
        },
        {
          value: 'Ibadan',
          option: 'Ibadan',
        },
        {
          value: 'Ilorin',
          option: 'Ilorin',
        },
        {
          value: 'Jos',
          option: 'Jos',
        },
        {
          value: 'Kaduna',
          option: 'Kaduna',
        },
        {
          value: 'Lagos',
          option: 'Lagos',
        },
        {
          value: 'Makurdi',
          option: 'Makurdi',
        },
        {
          value: 'Owerri',
          option: 'Owerri',
        },
        {
          value: 'PortHarcourt',
          option: 'PortHarcourt',
        },
        {
          value: 'Sokoto',
          option: 'Sokoto',
        },
        {
          value: 'Yola',
          option: 'Yola',
        },
      ],
      mode: 'best_fields',
      type: 'default',
      sort: 'default',
      startDate: '1986-01-01',
      endDate: new Date().getFullYear() + '-12-31',
      court: '',
      division: null,
      justice: '',
      counsel: '',
      parties: '',
    }
  },
  watch: {
    court(newCourt) {
      if (newCourt !== 'COURT OF APPEAL') {
        this.division = null
      }
    },
    currentFilter: {
      handler(newFilter, oldFilter) {
        if (newFilter.mode) {
          this.mode = newFilter.mode
        }
        if (newFilter.type) {
          this.type = newFilter.type
        }
        if (newFilter.sort) {
          this.sort = newFilter.sort
        }
        if (newFilter.startDate) {
          this.startDate = newFilter.startDate
        }
        if (newFilter.endDate) {
          this.endDate = newFilter.endDate
        }
        if (newFilter.court) {
          this.court = newFilter.court
        }
        if (newFilter.division && this.isCourtOfAppeal) {
          this.division = newFilter.division
        } else if (!this.isCourtOfAppeal) {
          this.division = null
        }
        if (newFilter.justice) {
          this.justice = newFilter.justice
        }
        if (newFilter.counsel) {
          this.counsel = newFilter.counsel
        }
        if (newFilter.parties) {
          this.parties = newFilter.parties
        }
      },
      deep: true,
    },
  },
  methods: {
    setFilter() {
      const filter = {
        mode: this.mode,
        type: this.type,
        sort: this.sort,
        startDate: this.startDate,
        endDate: this.endDate,
        court: this.court,
        division: this.division,
        justice: this.justice,
        counsel: this.counsel,
        parties: this.parties,
      }
      this.$emit('update-filter', filter)
    },
  },
  computed: {
    isCourtOfAppeal() {
      return this.court === 'COURT OF APPEAL'
    },
  },
  mounted() {
    if (this.currentFilter.mode) {
      this.mode = this.currentFilter.mode
    }
    if (this.currentFilter.type) {
      this.type = this.currentFilter.type
    }
    if (this.currentFilter.sort) {
      this.sort = this.currentFilter.sort
    }
    if (this.currentFilter.startDate) {
      this.startDate = this.currentFilter.startDate
    }
    if (this.currentFilter.endDate) {
      this.endDate = this.currentFilter.endDate
    }
    if (this.currentFilter.court) {
      this.court = this.currentFilter.court
    }
    if (this.currentFilter.division && this.isCourtOfAppeal) {
      this.division = this.currentFilter.division
    } else if (!this.isCourtOfAppeal) {
      this.division = null
    }
    if (this.currentFilter.justice) {
      this.justice = this.currentFilter.justice
    }
    if (this.currentFilter.counsel) {
      this.counsel = this.currentFilter.counsel
    }
    if (this.currentFilter.parties) {
      this.parties = this.currentFilter.parties
    }
  },
}
</script>
