<template>
  <div
    class="flex flex-col md:flex-row justify-between gap-10 items-center my-10 relative"
  >
    <div class="rounded-lg get-started-img-bg w-full h-36 relative">
      <div
        class="get-started-card p-10 rounded-lg h-full flex flex-col justify-center gap-5"
      >
        <p class="text-white">Empower your legal research</p>
        <nuxt-link to="/dashboard/legal-research">
          <button
            type="button"
            class="w-52 py-2 px-4 inline-flex justify-center items-center gap-2 rounded-full border border-transparent bg-[#FCFCFF54] text-[#F5F6FB]"
          >
            Start Legal Research
          </button>
        </nuxt-link>
      </div>
    </div>
    <div class="rounded-lg bg-[#babcd4] w-full h-36">
      <div class="p-8 rounded-lg h-full flex flex-col justify-center gap-5">
        <p class="text-[#08085E]" v-show="subscription.subscription_status">
          {{ subscription.message1 }}<br />
          Subscription expires on
          <span class="font-medium">{{
            $moment(subscription.expiry_date).format('dddd, DD MMM, YYYY')
          }}</span
          >.
        </p>
        <p v-if="!subscription.subscription_status">
          {{ subscription.message1 }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.get-started-card {
  background: linear-gradient(90deg, #08085e 24.6%, rgba(8, 8, 94, 0) 79.79%);
}

.get-started-img-bg {
  background-image: url('@/assets/images/get-started-card-bg.png');
  background-color: lightgray;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>

<script>
export default {
  props: {
    subscription: {
      type: Object,
      default: () => ({
        message1: null,
        subscription_status: null,
      }),
    },
  },
  name: 'HeaderCards',
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {},
}
</script>
