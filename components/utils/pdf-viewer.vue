<template>
  <div class="pdf-viewer">
    <div v-if="error">{{ error }}</div>
    <object
      v-if="!error"
      :data="`${pdfSrc}#toolbar=0`"
      type="application/pdf"
      class="pdf-embed"
    />
  </div>
</template>

<script>
export default {
  name: 'PdfViewer',
  props: {
    pdfSrc: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      error: null,
      pdfjsLib: null,
    }
  },
  methods: {
    async checkPdfAvailability() {
      try {
        const response = await fetch(this.pdfSrc)
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`)
      } catch (err) {
        this.error = `Error loading PDF: ${err.message}`
      }
    },
  },
}
</script>

<style scoped>
.pdf-viewer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
canvas {
  border: 1px solid #ccc;
}
.pdf-embed {
  width: 100%;
  height: 100vh; /* or set to a specific height if needed */
  border: none;
}
</style>
