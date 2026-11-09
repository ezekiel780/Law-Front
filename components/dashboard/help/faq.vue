<template>
  <div class="w-full">
    <div class="bg-[#fff] rounded-lg p-10">
      <div class="mb-16">
        <span class="font-semibold text-md text-[#08085E]"
          >Frequently Asked Questions</span
        >
      </div>
      <div
        class="w-full flex justify-between items-center flex-wrap my-6 cursor-pointer"
        v-for="(item, index) in faqData"
        :key="`faq-${index}`"
        @click.prevent="toggleFaq(index)"
      >
        <p class="w-[90%] font-medium">{{ item.question }}</p>
        <utils-svg-loader
          icon="plus"
          class="cursor-pointer w-[10%]"
          :class="{ 'rotate-45 transform-gpu': item.isOpened }"
        />
        <p class="w-full italic" v-show="item.isOpened">{{ item.answer }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      faqData: [
        {
          question: 'What is NWLROnline?',
          answer:
            'NWLROnline is a web application designed to assist legal professionals and researcher in conduting efficient and effective legal research.',
          isOpened: false,
        },
        {
          question: 'How do I create an account?',
          answer:
            "Click on the 'Sign Up' button on the homepage, fill in the required information, and follow the on-screen instructions to create your account.",
          isOpened: false,
        },
        {
          question: 'I forgot my password, how can I reset it?',
          answer:
            "Visit the login page and click on the 'Forgot Password' link. Follow the prompts to reset your password.",
          isOpened: false,
        },
        {
          question: 'How do I perform a search?',
          answer:
            'Once logged in, you can use the search bar on the dashboard to enter keywords, case names or legal terms. The results will be displayed based on relevance.',
          isOpened: false,
        },
        {
          question: 'Is NWLROnline free?',
          answer:
            'NWLROnline offers a premium subscription plan which comes with full access to over 50,000+ cases.',
          isOpened: false,
        },
      ],
    }
  },
  methods: {
    toggleFaq(index) {
      const currentFaq = this.faqData[index]
      currentFaq.isOpened = !currentFaq.isOpened
      const allItemsUpdated = this.faqData.map((item, i) => {
        const currentItem = { ...item, isOpened: false }
        if (i === index) {
          return currentFaq
        }
        return currentItem
      })
      this.faqData = [...allItemsUpdated]
    },
  },
}
</script>
