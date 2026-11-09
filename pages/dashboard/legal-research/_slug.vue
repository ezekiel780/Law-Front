<template>
  <div>
    <dashboard-legal-research-html-case
      v-if="loadState === 'loaded'"
      :case-file="caseFile"
      :case-title="caseTitle"
    />

    <div
      v-else-if="loadState === 'error'"
      class="min-h-[70vh] px-4 py-12 flex items-center justify-center"
    >
      <section
        class="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#08085E1A] bg-white shadow-xl"
        role="alert"
        aria-live="assertive"
      >
        <div class="h-2 bg-gradient-to-r from-[#08085E] via-[#3939A2] to-[#DDC524]"></div>
        <div class="p-7 md:p-10 text-center">
          <div
            class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F4F4FB] text-[#08085E]"
          >
            <i class="ri-file-warning-line text-4xl"></i>
          </div>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#A58F00]">
            Document unavailable
          </p>
          <h1 class="mt-3 text-2xl font-semibold text-[#08085E] md:text-3xl">
            We could not open this case
          </h1>
          <p class="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6871A6] md:text-base">
            {{ loadError }}
          </p>
          <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              class="rounded-xl bg-[#08085E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2"
              @click="retryCaseFile"
            >
              Try again
            </button>
            <button
              type="button"
              class="rounded-xl border border-[#08085E26] bg-[#F5F6FB] px-6 py-3 text-sm font-semibold text-[#08085E] transition hover:border-[#08085E] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2"
              @click="returnToResearch"
            >
              Back to legal research
            </button>
          </div>
        </div>
      </section>
    </div>

    <div
      v-else
      class="flex min-h-[70vh] w-full flex-col items-center justify-center gap-5 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      <div
        class="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F5F6FB] shadow-sm"
      >
        <utils-loader class="h-8 w-8" />
      </div>
      <div>
        <p class="text-xl font-semibold text-[#08085E] md:text-2xl">
          Processing document
        </p>
        <p class="mt-2 text-sm text-[#6871A6]">
          Please wait while the case file is prepared.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import SEO from '~/mixins/SEO.js'
export default {
  name: 'LegalResearchCasePage',
  layout: 'dashboard',
  mixins: [SEO],
  data() {
    return {
      isPageLoaded: false,
      caseId: null,
      caseFile: null,
      tempCaseFile: null,
      caseTitle: null,
      caseStyle: null,
      htmlData: null,
      loadHtmlData: false,
      loadState: 'loading',
      loadError: '',
      seo: {
        title: 'Legal Research | NWLR Online',
        description:
          'Relevant materials including: Statutes & Rules and Laws of the Federation.',
        image: 'https://nwlronline.com/icon_new.png',
      },
    }
  },
  methods: {
    async getCaseFile() {
      this.loadState = 'loading'
      this.loadError = ''
      this.loadHtmlData = false
      this.caseFile = null

      try {
        const { data } = await this.$api.research.loadCase(this.caseId)
        this.tempCaseFile = data
        this.caseFile = data
        this.loadHtmlData = true
        this.loadState = 'loaded'
        await this.getCaseMetadata()
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') console.trace(errorResponse)
        this.loadState = 'error'
        this.loadError =
          errorResponse.message ||
          'The case could not be loaded. Please retry or return to legal research.'
        this.$notify({
          type: 'error',
          title: 'Unable to open case',
          text: this.loadError,
          duration: 7000,
        })
      } finally {
        this.isPageLoaded = true
      }
    },

    retryCaseFile() {
      return this.getCaseFile()
    },

    returnToResearch() {
      this.$router.push({ name: 'dashboard-legal-research' })
    },

    getDataFromResponse(selector, type = 'tagname') {
      const parser = new DOMParser()
      const htmlDoc = parser.parseFromString(this.tempCaseFile, 'text/html')
      let element
      switch (type) {
        case 'tagname':
          element = htmlDoc.getElementsByTagName(selector)
          break
        case 'id':
          element = htmlDoc.getElementById(selector)
          break
        case 'class':
          element = htmlDoc.getElementsByClassName(selector)
          break
        case 'selector':
          element = htmlDoc.querySelectorAll(selector)
          break
        default:
          break
      }
      return element
    },

    getCaseTitle() {
      let result = ''
      const allElements = this.getDataFromResponse(
        'span.headerMidLeft',
        'selector'
      )
      allElements.forEach((element) => {
        if (
          element.innerText.toLowerCase().includes('v.') &&
          result.length <= 2
        )
          result = element.innerText
      })
      if (result.length <= 2) {
        const round2 = this.getDataFromResponse('p.headerLeft', 'selector')
        round2.forEach((element) => {
          if (
            element.innerText.toLowerCase().includes('v.') &&
            result.length <= 2
          )
            result = element.innerText
        })
      }
      this.caseTitle = result
    },

    getStyles() {
      const result = this.getDataFromResponse('style', 'tagname')
      this.caseStyle = result[1].innerText
    },

    getPages() {
      const allPages = []
      const allElements = this.getDataFromResponse(
        "div[class^='WordSection']",
        'selector'
      )
      allElements.forEach((element) => {
        allPages.push(element.outerHTML)
      })
      this.caseFile = allPages.join('')
    },

    getPagesAsImage() {
      try {
        const html2canvas = require('html2canvas')
        // wait for 5 seconds
        setTimeout(() => {
          const allPages = document.querySelectorAll(
            'div[class^="WordSection"]'
          )
          allPages.forEach((page) => {
            html2canvas(page).then(() => {})
          })
        }, 5000)
      } catch (error) {}
    },

    async getCaseMetadata() {
      try {
        const { data } = await this.$api.research.getCaseMetadata(
          this.caseId
        )
        const citation = `${data.data.case_name} (${data.data.year}) ${data.data.volume} NWLR (Pt. ${data.data.part}) ${data.data.page_start}`
        this.caseTitle = citation
      } catch (error) {
        this.getCaseTitle()
      }
    },
  },
  mounted() {
    const decodedSlug = decodeURIComponent(this.$route.params.slug)
    this.caseId = decodedSlug
    if (!/^\d+_1_\d+$/.test(this.caseId)) {
      this.$router.go(-1)
      return false
    }
    this.getCaseFile()
  },
}
</script>
