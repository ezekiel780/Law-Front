<template>
  <div class="my-6">
    <div v-if="isImageAvailable" class="relative">
      <flipbook
        class="flipbook absolute top-0 left-0"
        :pages="imageList"
        :singlePage="true"
        ref="flipbook"
      />
    </div>
    <div v-else>
      <div class="w-full bg-[#ccc]" v-html="caseFile" ref="caseElement"></div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
export default {
  props: {
    caseFile: {
      type: String,
      default: 'Hello World!',
    },
  },
  name: 'Search',
  data() {
    return {
      isSaving: false,
      isImageAvailable: false,
      imageList: [],
    }
  },
  watch: {
    caseFile: {
      deep: true,
      handler(newVal, oldVal) {
        // Do something when caseFile prop changes
        // this.getPagesAsImage();
      },
    },
  },
  computed: {},
  methods: {
    getPagesAsImage() {
      try {
        const html2canvas = require('html2canvas')
        // wait for 5 seconds
        setTimeout(() => {
          const allPages = document.querySelectorAll(
            'div[class^="WordSection"]'
          )
          allPages.forEach(async (page) => {
            const canvas = await html2canvas(page)
            const image = await canvas.toDataURL('image/png')
            this.imageList.push(image)

            if (this.imageList.length === allPages.length) {
              this.gsapFlip()
              this.isImageAvailable = true
            }
          })
        }, 5000)
      } catch (error) {}
    },

    gsapFlip() {},
  },
}
</script>

<style>
/* .flipbook {
    width: 90vw;
    height: calc(100vh - 50px - 40px);
  } */

.flipbook .viewport {
  width: 100%;
  height: auto;
}

.flipbook .bounding-box {
  box-shadow: 0 0 20px #000;
}

[class^='WordSection'] {
  max-width: 700px;
  margin-right: auto !important;
  margin-left: auto !important;
  background-color: white;
}

[class^='WordSection'] {
  /*height: 1000px;*/
  height: auto;
  /*min-height: 1000px;*/
  min-height: 700px;
  padding: 0px;
  padding-bottom: 60px;
  margin-bottom: 17px;
  box-shadow: 0px 0px 10px black;
}

[class*='Heading'] {
  font-weight: bold !important;
}

.headers {
  border-bottom: 2px solid black;
  /**word-spacing: 12px;**/
  margin-top: 0px;
  display: flex;
  flex: 0 0 5%;
  margin-bottom: 0px;
  width: 85%;
  margin-left: 9%;
  margin-right: auto;
}

.headers span {
  font-size: 8pt !important;
  font-weight: bold;
}

.headerLeft {
  flex: 0 0 20%;
  align-self: flex-start;
}

.headerMidLeft {
  flex: 1 1 45%;
  align-self: center;
  text-align: center;
}

.headerMidRight {
  flex: 1 1 25%;
  align-self: center;
  text-align: center;
}

.headerRight {
  flex: 0 0 20%;
  align-self: flex-end;
  text-align: right;
}
.caseReal {
  flex: 1 1 92%;
  display: flex;
  flex-flow: row;
  width: 90%;
}

.casePara {
  display: flex;
  flex-flow: column;
  align-content: stretch;
  padding: 0px;
  /*min-height: 900px;*/
  min-height: 700px;
  margin: 0px;
  margin-top: 16px;
  flex: 0 0 5%;
  border: 1px solid yellow;
}

.contentRecreate {
  width: 530px;
  word-wrap: break-word;
  margin-left: auto;
  margin-right: auto;
  hyphens: auto;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  -o-hyphens: auto;
  margin-top: 16px;
  padding-bottom: 15px;
  flex: 1 1 95%;
  border: 1px solid black;
}

.contentRecreate p {
  display: block;
  margin: 0px;
  padding: 0px;
}

.contentRecreatex {
  min-width: 530px;
  margin-left: auto;
  margin-right: auto;
}

[class^='WordSection']:nth-child(odd) .caseReal {
  margin-left: 4%;
}

[class^='WordSection']:nth-child(even) .caseReal {
  margin-left: 9%;
}

[class^='WordSection']:nth-child(odd) .casePara {
  order: 0;
}

[class^='WordSection']:nth-child(even) .casePara {
  order: 1;
}

.casePara p {
  /*flex: 1 1 11.8%;*/
  margin: 0px;
  padding: 0px 10px;
}

.casePara p:first-child {
  padding-top: 0px;
}

.markedOption {
  /**background-color: hotpink;**/
  color: white;
  border-radius: 3px;
}

.left {
  text-align: left;
  align-self: center;
}
.centre {
  text-align: center;
}
.right {
  text-align: right;
}
.justify {
  text-align: justify;
}
.halfSpacing {
  line-height: 2em;
}
.indentText {
  text-indent: 30px;
}

.spaceWord {
  word-spacing: 5px;
}
.listHolder {
  display: flex !important;
  flex-flow: row;
}

.listNum {
  /*margin-right: 0px;*/
  flex: 0 0 7%;
}

.listContent {
  flex: 1 1 93%;
}

.hiddenWords {
  display: none;
}
</style>
