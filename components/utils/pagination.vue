<template>
  <div>
    <div class="py-1">
      <nav class="flex items-center justify-end gap-2 flex-wrap">
        <button
          type="button"
          class="text-[#08085E] px-3 py-2 inline-flex items-center gap-2 font-medium rounded-lg border-[1px] border-[#08085E] transition-all"
          :class="{
            'opacity-40 cursor-not-allowed': isFirstPage,
            'hover:text-[#fff] hover:bg-[#08085E] cursor-pointer': !isFirstPage,
          }"
          :disabled="isFirstPage"
          @click="goToPage(1)"
          aria-label="Go to first page"
        >
          First
        </button>

        <button
          type="button"
          class="text-[#08085E] px-3 py-2 inline-flex items-center gap-2 font-medium rounded-lg border-[1px] border-[#08085E] transition-all"
          :class="{
            'opacity-40 cursor-not-allowed': isFirstPage,
            'hover:text-[#fff] hover:bg-[#08085E] cursor-pointer': !isFirstPage,
          }"
          :disabled="isFirstPage"
          @click="goToPage(safeCurrentPage - 1)"
          aria-label="Go to previous page"
        >
          <span aria-hidden="true">«</span>
          <span>Previous</span>
        </button>

        <div class="flex items-center gap-2">
          <template v-for="(item, idx) in paginationItems">
            <span
              v-if="item === '...'"
              :key="`pg-${idx}-${item}`"
              class="px-2 text-[#08085E] opacity-70 select-none"
            >
              …
            </span>

            <button
              v-else
              :key="`pge-${idx}-${item}`"
              type="button"
              class="w-10 h-10 inline-flex justify-center items-center text-center text-sm font-medium rounded-full border-[1px] transition-all"
              :class="{
                'bg-[#08085E] text-white border-[#08085E] cursor-default':
                  item === safeCurrentPage,
                'text-[#08085E] border-[#08085E] hover:bg-[#08085E] hover:text-white cursor-pointer':
                  item !== safeCurrentPage,
              }"
              :aria-current="item === safeCurrentPage ? 'page' : null"
              :disabled="item === safeCurrentPage"
              @click="goToPage(item)"
            >
              {{ item }}
            </button>
          </template>
        </div>

        <button
          type="button"
          class="text-[#08085E] px-3 py-2 inline-flex items-center gap-2 font-medium rounded-lg border-[1px] border-[#08085E] transition-all"
          :class="{
            'opacity-40 cursor-not-allowed': isLastPage,
            'hover:text-[#fff] hover:bg-[#08085E] cursor-pointer': !isLastPage,
          }"
          :disabled="isLastPage"
          @click="goToPage(safeCurrentPage + 1)"
          aria-label="Go to next page"
        >
          <span>Next</span>
          <span aria-hidden="true">»</span>
        </button>

        <button
          type="button"
          class="text-[#08085E] px-3 py-2 inline-flex items-center gap-2 font-medium rounded-lg border-[1px] border-[#08085E] transition-all"
          :class="{
            'opacity-40 cursor-not-allowed': isLastPage,
            'hover:text-[#fff] hover:bg-[#08085E] cursor-pointer': !isLastPage,
          }"
          :disabled="isLastPage"
          @click="goToPage(safeTotalPages)"
          aria-label="Go to last page"
        >
          Last
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: { type: Number, default: 1 },
    totalPages: { type: Number, default: 1 },
    windowSize: { type: Number, default: 2 },
  },
  computed: {
    safeCurrentPage() {
      const n = Number(this.currentPage)
      return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
    },
    safeTotalPages() {
      const n = Number(this.totalPages)
      return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
    },
    isFirstPage() {
      return this.safeCurrentPage <= 1
    },
    isLastPage() {
      return this.safeCurrentPage >= this.safeTotalPages
    },
    paginationItems() {
      const total = this.safeTotalPages
      const current = this.safeCurrentPage
      const win = Number.isFinite(Number(this.windowSize))
        ? Number(this.windowSize)
        : 2

      if (total <= 1) return [1]

      const start = Math.max(1, current - win)
      const end = Math.min(total, current + win)

      const items = []
      items.push(1)

      if (start > 2) items.push('...')

      for (let p = start; p <= end; p++) {
        if (p !== 1 && p !== total) items.push(p)
      }

      if (end < total - 1) items.push('...')

      items.push(total)

      const out = []
      for (const x of items) if (!out.includes(x)) out.push(x)
      return out
    },
  },
  methods: {
    goToPage(page) {
      const total = this.safeTotalPages
      const p = Number(page)

      if (!Number.isFinite(p)) return

      const target = Math.min(Math.max(Math.floor(p), 1), total)
      if (target === this.safeCurrentPage) return

      this.$emit('go-to-page', target)

      // optional legacy emits (won't hurt)
      if (target === this.safeCurrentPage + 1)
        this.$emit('call-next-page', true)
      if (target === this.safeCurrentPage - 1)
        this.$emit('call-previous-page', true)
    },
  },
}
</script>
