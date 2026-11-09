<template>
  <div
    :class="{
      'border-[1px] border-[#08085E] rounded-lg mt-5 md:mt-0 px-5 md:px-0 md:border-none':
        !isLegalResearchPage,
    }"
  >
    <!-- breadcrumb -->
    <div class="flex gap-5 items-center" v-show="isLegalResearchPage">
      <span class="w-5 h-5 bg-[#DDC524]"></span>
      <span class="font-medium text-lg">Legal Research</span>
    </div>

    <!-- search input -->
    <div
      class="flex md:flex-nowrap gap-5 justify-between w-full my-6"
      :class="{
        'items-center': !$v.$invalid,
        'flex-wrap-reverse': !isLegalResearchPage,
        'flex-wrap': isLegalResearchPage,
      }"
    >
      <span
        class="flex gap-4 items-center cursor-pointer"
        @click.prevent="toggleFilterModal"
      >
        <utils-svg-loader
          icon="filter-icon"
          class="cursor-pointer"
          color="#08085E"
        />
        <span class="font-medium text-[#08085E]">Filter</span>
      </span>

      <!-- wrap input + suggestions in a ref so we can detect outside clicks -->
      <div class="w-full relative" ref="searchBox">
        <input
          type="text"
          autocomplete="off"
          class="bg-[#E6E6F4] py-3 w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2] pl-5 pr-10"
          :class="{
            'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
              $v.query.$error,
          }"
          @input="resetAndSearch"
          v-model="query"
          @keyup.enter="performSearch"
          placeholder="Search for a case or principle"
        />

        <span @click.prevent="clearInput" class="absolute right-4 top-3.5">
          <utils-svg-loader
            icon="cancel-icon"
            class="cursor-pointer"
            color="#08085E1A"
            v-show="query"
          />
        </span>

        <!-- search suggestion loader -->
        <div class="absolute right-8 top-2.5">
          <utils-loader
            v-if="isLoadingSearchSuggestion"
            class="mx-[0.6rem] h-5 w-5"
          />
        </div>

        <!-- search suggestion dropdown -->
        <div
          class="absolute top-10 z-50 bg-white rounded-b-lg w-full drop-shadow-xl text-[#08085E] flex flex-col"
          v-show="
            showSearchSuggestion &&
            !isLoadingSearchSuggestion &&
            suggestedSearch.length > 0
          "
        >
          <span
            class="px-5 py-3 cursor-pointer hover:bg-[#08085E1A] transition-all"
            :class="{
              'border border-b-[#08085E] border-t-0 border-x-0':
                index !== suggestedSearch.length - 1,
            }"
            v-for="(suggestion, index) in suggestedSearch"
            :key="`suggestion-${index}`"
            @click="selectSuggestedSearch(suggestion)"
          >
            {{ suggestion.word }}
          </span>
        </div>
        <!-- !end of search suggestion -->

        <div
          class="absolute top-[0.56rem] right-10 cursor-pointer"
          v-show="$v.query.$error"
        >
          <i class="ri-information-fill text-[#E02424] text-lg" />
        </div>
        <utils-input-validation
          :field="$v.query"
          :field-name="'Search Query'"
          v-show="$v.query.$error"
        />
      </div>

      <div class="">
        <utils-button
          class="py-3 px-10 rounded-xl border border-transparent bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all"
          :on-click="searchButtonClick"
          :button-state="isLoading"
        >
          Search
        </utils-button>
      </div>

      <div class="" v-show="isLegalResearchPage && !isInstitutionalSession">
        <utils-button
          class="py-3 w-36 rounded-xl border border-transparent bg-[#08085E1A] text-[#08085E] hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
          :on-click="saveSearch"
          :button-state="isSaving"
        >
          <div class="flex justify-center items-center gap-2">
            <span>Save Result</span>
            <utils-svg-loader
              icon="save-icon"
              class="cursor-pointer"
              color="#08085E1A"
            />
          </div>
        </utils-button>
      </div>
    </div>

    <!-- filter modal -->
    <dashboard-legal-research-filter-modal
      :toggle-modal="toggleFilterModal"
      :modal-state="openFilterModal"
      :current-filter="currentFilter"
      @update-filter="confirmFilterUpdate"
      v-if="openFilterModal"
    />

    <!-- Filter judgement date -->
    <div v-show="showFilterJudgementDate">
      <p class="block text-sm font-medium text-[#08085E]">
        Filter Judgement Date
      </p>
      <div class="flex gap-5 items-end">
        <div class="">
          <label for="input-label" class="pt-3 block text-sm font-medium mb-2"
            >Start Date</label
          >
          <input
            type="date"
            class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
            placeholder="Enter Start Date (yyyy-mm-dd)"
            v-model="startDateValue"
          />
        </div>
        <div class="">
          <label for="input-label" class="pt-3 block text-sm font-medium mb-2"
            >End Date</label
          >
          <input
            type="date"
            class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
            placeholder="Enter End Date (yyyy-mm-dd)"
            v-model="endDateValue"
          />
        </div>
        <utils-button
          class="py-3 px-10 rounded-xl border border-transparent bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all"
          :on-click="filterByJudgementDate"
          :button-state="isLoadingJudgementDate"
        >
          Filter
        </utils-button>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import { addSearchHistory } from '~/services/utilities/searchHistory'

export default {
  name: 'Search',
  props: {
    pageNumber: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      query: null,
      isLoading: false,
      isSaving: false,
      openFilterModal: false,
      searchResults: null,
      modeDictionary: {
        best_fields: 'Best Fields',
        match_phrase: 'Match Phrase',
        match_word: 'Match Word',
      },
      modeValue: 'best_fields',
      typeValue: 'default',
      sortValue: 'default',
      startDateValue: '',
      endDateValue: '',
      courtValue: '',
      divisionValue: '',
      justiceValue: '',
      counselValue: '',
      partiesValue: '',
      currentFilter: {
        mode: this.modeValue,
        type: this.typeValue,
        sort: this.sortValue,
        startDate: this.startDateValue,
        endDate: this.endDateValue,
        court: this.courtValue,
        division: this.divisionValue,
        justice: this.justiceValue,
        counsel: this.counselValue,
        parties: this.partiesValue,
      },
      currentPage: 1,
      showFilterJudgementDate: false,
      isLoadingJudgementDate: false,
      showSearchSuggestion: false,
      debounceTimeout: null,
      isLoadingSearchSuggestion: false,
      suggestedSearch: [],
      isMounted: false,
      lastSearchFingerprint: null,
      lastSearchStartedAt: 0,
      suggestionRequestSequence: 0,
    }
  },
  validations() {
    return {
      query: {
        required,
        minLength: minLength(3),
      },
    }
  },
  computed: {
    ...mapGetters({
      searchQuery: 'app/getQuery',
    }),
    isLegalResearchPage() {
      return this.$route.name === 'dashboard-legal-research'
    },
    isInstitutionalSession() {
      return this.$user.getIsInstitutionalSession()
    },
  },
  watch: {
    pageNumber: {
      handler(pageNo, previousPage) {
        this.currentPage = pageNo
        if (
          this.isMounted &&
          previousPage !== undefined &&
          pageNo !== previousPage &&
          this.query
        ) {
          this.performSearch({ force: true })
        }
      },
    },
    query(query) {
      if (query) {
        this.currentPage = 1
        this.$emit('reset-page-number', true)
      }
    },

    '$route.query.search_term': {
      immediate: false,
      handler(term) {
        if (!term) return
        const t = term.toString()
        if (t && t !== this.query) {
          this.query = t
          this.currentPage = 1
          this.$emit('reset-page-number', true)
          if (this.isMounted) {
            this.$nextTick(() => this.performSearch())
          }
        }
      },
    },
  },
  methods: {
    ...mapActions({
      saveQuery: 'app/UpdateQuery',
    }),

    handleDocumentClick(e) {
      if (!this.showSearchSuggestion) return
      const box = this.$refs.searchBox
      if (box && !box.contains(e.target)) {
        this.showSearchSuggestion = false
      }
    },

    clearInput() {
      this.query = null
      this.showSearchSuggestion = false
      this.suggestedSearch = []
    },

    filterByJudgementDate() {
      this.isLoadingJudgementDate = true
      this.performSearch()
    },

    toggleFilterModal() {
      this.currentFilter = {
        mode: this.modeValue,
        type: this.typeValue,
        sort: this.sortValue,
        startDate: this.startDateValue,
        endDate: this.endDateValue,
        court: this.courtValue,
        division: this.divisionValue,
        justice: this.justiceValue,
        counsel: this.counselValue,
        parties: this.partiesValue,
      }
      this.openFilterModal = !this.openFilterModal
    },

    persistSearchHistory() {
      if (!process.client) return
      addSearchHistory({
        search_term: this.query,
        case_type: this.typeValue,
        match: this.modeValue,
        sort: this.sortValue,
        start_date: this.startDateValue,
        end_date: this.endDateValue,
        court: this.courtValue,
        division: this.divisionValue,
        justice: this.justiceValue,
        counsel: this.counselValue,
        parties: this.partiesValue,
      })
    },

    searchFingerprint() {
      return JSON.stringify({
        query: String(this.query || '').trim(),
        mode: this.modeValue,
        type: this.typeValue,
        sort: this.sortValue,
        page: this.currentPage,
        startDate: this.startDateValue,
        endDate: this.endDateValue,
        court: this.courtValue,
        division: this.divisionValue,
        justice: this.justiceValue,
        counsel: this.counselValue,
        parties: this.partiesValue,
      })
    },

    async performSearch({ force = false } = {}) {
      this.$v.$touch()
      if (this.$v.$invalid) return false

      const fingerprint = this.searchFingerprint()
      const now = Date.now()
      if (this.isLoading) return false
      if (
        !force &&
        fingerprint === this.lastSearchFingerprint &&
        now - this.lastSearchStartedAt < 2000
      ) {
        return false
      }
      this.lastSearchFingerprint = fingerprint
      this.lastSearchStartedAt = now

      // ALWAYS save to local history once the search is valid
      this.persistSearchHistory()

      // search working from outside legal research page
      if (!this.isLegalResearchPage) {
        this.$router.push({
          name: 'dashboard-legal-research',
          query: {
            search_term: this.query,
            case_type: this.typeValue,
            match: this.modeValue,
            sort: this.sortValue,
            start_date: this.startDateValue,
            end_date: this.endDateValue,
            court: this.courtValue,
            division: this.divisionValue,
            justice: this.justiceValue,
            counsel: this.counselValue,
            parties: this.partiesValue,
          },
        })
        return false
      }

      this.isLoading = true
      this.$emit('search-error', null)
      this.$emit('update-search-results', { data: [] })

      try {
        this.saveQuery(this.query)

        // FIX: Always emit the FULL backend payload (with did_you_mean, paging, etc.)
        const resp = await this.$api.research.search(
          this.query,
          this.modeValue,
          this.typeValue,
          this.sortValue,
          this.currentPage,
          this.startDateValue,
          this.endDateValue,
          this.courtValue,
          this.divisionValue,
          this.justiceValue,
          this.counselValue,
          this.partiesValue
        )

        // If your API wrapper returns axios response -> resp.data is the payload
        // If your API wrapper returns payload directly -> resp IS the payload
        const result = resp && resp.data ? resp.data : resp

        this.$emit('update-search-results', result)
        this.showFilterJudgementDate = true
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') {
          console.trace(errorResponse)
        }
        const status = Number(error?.response?.status || 0)
        const busyMessage =
          status === 429 || status === 503
            ? 'Legal search is temporarily busy. Please wait a moment and try again.'
            : null
        this.$emit('search-error', {
          message:
            busyMessage ||
            errorResponse.message ||
            'The search could not be completed. Please try again.',
          status: status || null,
        })
        this.$notify({
          type: 'error',
          title: 'Search unavailable',
          text:
            errorResponse.message ||
            'The search could not be completed. Please try again.',
          duration: 7000,
        })
      } finally {
        this.isLoading = false
        this.isLoadingJudgementDate = false
        this.showSearchSuggestion = false
      }
    },

    async searchButtonClick() {
      // reset filters
      this.modeDictionary = {
        best_fields: 'Match Word',
        phrase: 'Match Phrase',
      }
      this.modeValue = 'best_fields'
      this.typeValue = 'default'
      this.sortValue = 'default'
      this.startDateValue = ''
      this.endDateValue = ''
      this.courtValue = ''
      this.divisionValue = ''
      this.justiceValue = ''
      this.counselValue = ''
      this.partiesValue = ''

      this.currentFilter = {
        mode: this.modeValue,
        type: this.typeValue,
        sort: this.sortValue,
        startDate: this.startDateValue,
        endDate: this.endDateValue,
        court: this.courtValue,
        division: this.divisionValue,
        justice: this.justiceValue,
        counsel: this.counselValue,
        parties: this.partiesValue,
      }

      await this.performSearch()
    },

    async saveSearch() {
      if (this.isInstitutionalSession) return false
      this.$v.$touch()
      if (this.$v.$invalid) return false
      this.isSaving = true

      try {
        const {
          data: { message },
        } = await this.$api.subscription.saveResult({
          search_term: this.query,
          case_type: this.typeValue,
          match: this.modeValue,
          sort: this.sortValue,
          start_date: this.startDateValue,
          end_date: this.endDateValue,
          court: this.courtValue,
          division: this.divisionValue,
          justice: this.justiceValue,
          counsel: this.counselValue,
          parties: this.partiesValue,
        })

        this.$notify({
          type: 'success',
          title: 'Success',
          text: message,
          duration: 5000,
        })
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') {
          console.trace(errorResponse)
        }
        this.$notify({
          type: 'info',
          title: 'Info',
          text: errorResponse.message,
          duration: 5000,
        })
      } finally {
        this.isSaving = false
      }
    },

    confirmFilterUpdate(filters) {
      const {
        mode,
        type,
        sort,
        startDate,
        endDate,
        court,
        division,
        justice,
        counsel,
        parties,
      } = filters
      this.modeValue = mode
      this.typeValue = type
      this.sortValue = sort
      this.startDateValue = startDate
      this.endDateValue = endDate
      this.courtValue = court
      this.divisionValue = division
      this.justiceValue = justice
      this.counselValue = counsel
      this.partiesValue = parties
      this.toggleFilterModal()
      this.performSearch()
    },

    debounceSearchSuggestion() {
      clearTimeout(this.debounceTimeout)
      const term = String(this.query || '').trim()
      if (term.length < 3) {
        this.showSearchSuggestion = false
        this.suggestedSearch = []
        return
      }
      this.debounceTimeout = setTimeout(() => {
        this.getSearchSuggestion()
      }, 500)
    },

    resetAndSearch() {
      this.$helper.resetInputValidation(this.$v)
      this.debounceSearchSuggestion()
    },

    async getSearchSuggestion() {
      const term = String(this.query || '').trim()
      if (term.length < 3) return
      const requestSequence = ++this.suggestionRequestSequence

      try {
        this.isLoadingSearchSuggestion = true
        this.showSearchSuggestion = false
        const {
          data: { data },
        } = await this.$api.research.getSimilarSearch(term)
        if (requestSequence !== this.suggestionRequestSequence) return
        this.suggestedSearch = data
        this.showSearchSuggestion = true
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') {
          console.trace(error, errorResponse)
        }
        this.$notify({
          type: 'info',
          title: 'NOTICE',
          text: errorResponse.message,
          duration: 5000,
        })
      } finally {
        if (requestSequence === this.suggestionRequestSequence) {
          this.isLoadingSearchSuggestion = false
        }
      }
    },

    selectSuggestedSearch(suggestion) {
      this.query = suggestion.word
      this.showSearchSuggestion = false
      this.performSearch()
    },

    applyQueryAndSearch(term) {
      this.query = term
      this.currentPage = 1
      this.$emit('reset-page-number', true)
      this.showSearchSuggestion = false
      this.suggestedSearch = []
      return this.performSearch()
    },
  },

  mounted() {
    document.addEventListener('click', this.handleDocumentClick)
    this.isMounted = true

    this.query = this.searchQuery
    const {
      case_type,
      match,
      search_term,
      sort,
      start_date,
      end_date,
      court,
      division,
      justice,
      counsel,
      parties,
    } = this.$route.query
    if (case_type) this.typeValue = case_type
    if (match) this.modeValue = match
    if (sort) this.sortValue = sort
    if (start_date) this.startDateValue = start_date
    if (end_date) this.endDateValue = end_date
    if (court) this.courtValue = court
    if (division) this.divisionValue = division
    if (justice) this.justiceValue = justice
    if (counsel) this.counselValue = counsel
    if (parties) this.partiesValue = parties
    if (search_term) {
      this.query = search_term
      this.$nextTick(() => this.performSearch())
    }
  },

  beforeDestroy() {
    clearTimeout(this.debounceTimeout)
    this.suggestionRequestSequence += 1
    document.removeEventListener('click', this.handleDocumentClick)
  },
}
</script>
