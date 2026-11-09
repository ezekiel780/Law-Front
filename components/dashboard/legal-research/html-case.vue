<template>
  <div class="my-6">
    <!-- breadcrumb -->
    <div class="flex gap-5 items-center">
      <span class="w-5 h-5 bg-[#DDC524]"></span>
      <span class="font-medium text-lg">Legal Research</span>
    </div>
    <div class="grid md:grid-cols-4 gap-4 md:gap-8">
      <div class="col-span-4">
        <div class="flex justify-between items-center gap-4 my-15">
          <div class="w-full flex items-center gap-4">
            <p class="font-medium">{{ caseTitle }}</p>
            <utils-button
              v-if="!isInstitutionalSession"
              class="py-2 w-32 rounded-xl border border-transparent bg-[#08085E1A] text-[#08085E] hover:bg-[#3939A2] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm"
              :on-click="saveCase"
              :button-state="isSaving"
            >
              <div class="flex justify-center items-center gap-2">
                <span>Save</span>
                <utils-svg-loader
                  icon="save-icon"
                  class="cursor-pointer"
                  color="#08085E1A"
                />
              </div>
            </utils-button>
          </div>
          <div>
            <button
              type="button"
              class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border[1px] border-[#08085E] font-medium hover:bg-[#3939A2] hover:text-[#fff] transition-all text-sm bg-[#08085E] text-[#fff] my-5"
              @click.prevent="closeTab"
            >
              <i class="ri-arrow-left-s-line text-[#fff]"></i>
              Back
            </button>
          </div>
        </div>
        <div>
          <div v-if="caseFile != null">
            <iframe
              :srcdoc="caseFile"
              class="w-full h-screen pb-3 md-scale-125 transform-gpu"
              id="caseDoc"
              ref="caseDoc"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    caseFile: {
      type: String,
      default: null,
    },
    caseTitle: {
      type: String,
      default: 'Hello World!',
    },
    caseStyle: {
      type: String,
      default: 'Hello World!',
    },
    imageAvailable: {
      type: Boolean,
      default: false,
    },
  },
  name: 'Search',
  data() {
    return {
      isSaving: false,
    }
  },
  computed: {
    isInstitutionalSession() {
      return this.$user.getIsInstitutionalSession()
    },
  },
  methods: {
    async saveCase() {
      if (this.isInstitutionalSession || !this.caseTitle) return
      this.isSaving = true
      try {
        const decodedSlug = decodeURIComponent(this.$route.params.slug)
        await this.$api.subscription.saveCase({
          case_id: decodedSlug,
          case_name: this.caseTitle,
        })
        this.$notify({
          type: 'success',
          title: 'Success',
          text: `Case ${this.caseTitle} has been saved successfully`,
          duration: 5000,
        })
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') console.trace(errorResponse)
        this.$notify({
          type: 'info',
          title: 'Notice',
          text: errorResponse.message,
          duration: 5000,
        })
      } finally {
        this.isSaving = false
      }
    },

    showCaseImage(imageProps) {},

    closeTab() {
      window.close()
    },

    preventCopy() {
      try {
        // Get a reference to the iframe
        const iframe = document.getElementById('caseDoc')

        // Add an event listener to prevent the context menu (right-click)
        iframe.contentDocument.addEventListener('contextmenu', function (e) {
          e.preventDefault()
        })

        // Add an event listener to prevent copying (Ctrl+C)
        iframe.contentDocument.addEventListener('keydown', function (e) {
          if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
            e.preventDefault()
          }
        })
      } catch (error) {
        console.trace(error)
      }
    },
  },
  mounted() {
    this.preventCopy()
    this.$refs.caseDoc.onload = () => {
      const doc = this.$refs.caseDoc.contentWindow.document
      const links = doc.querySelectorAll('a.NWLR')
      links.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault()
          const regex = /NWLR\(Pt\.(\d+)\)(\d+)/
          let text = link.textContent.replace(/\s+/g, '')
          let match = text.match(regex)
          if (!match) {
            text = link
              .getAttribute('href')
              .replace('#', '')
              .replace(/\s+/g, '')
            match = text.match(regex)
          }
          if (match) {
            const part = match[1]
            const page = match[2]
            if (!part || !page) return
            const caseId = `${part}_1_${page}`
            window.open(
              `/dashboard/legal-research/${encodeURIComponent(
                caseId
              )}`,
              '_blank'
            )
          }
        })
      })
    }
  },
}
</script>
