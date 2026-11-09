<template>
  <section class="subscription-showcase px-4 py-14 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="showcase-heading">
        <p>Subscription plans</p>
        <h2>Choose the access you need</h2>
        <span>
          Select a plan for your legal research and reference work.
        </span>
      </div>

      <subscription-catalog :plans="allPlans" @select-plan="payForPlan" />
    </div>
  </section>
</template>

<script>
import GtagEvents from '~/mixins/GtagEvents.js'

export default {
  mixins: [GtagEvents],
  props: {
    allPlans: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    payForPlan(plan) {
      this.trackGtagEvent('select_item', {
        item_list_name: 'Subscription Plans',
        currency: plan.currency || 'NGN',
        value: Number(plan.amount) || 0,
        items: [
          {
            item_id: String(plan.id),
            item_name: plan.title,
            item_category: plan.category || 'Subscription',
            price: Number(plan.amount) || 0,
            quantity: 1,
          },
        ],
      })

      if (Number(plan.amount || 0) <= 0) {
        this.$router.push('/contact-us')
        return
      }

      this.$router.push({
        path: '/dashboard/my-subscription',
        query: { plan: String(plan.id) },
      })
    },
  },
}
</script>

<style scoped>
.subscription-showcase {
  background: #ffffff;
}

.showcase-heading {
  margin: 0 auto 1.75rem;
  max-width: 42rem;
  text-align: center;
}

.showcase-heading p {
  color: #8a7600;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.showcase-heading h2 {
  margin-top: 0.35rem;
  color: #111827;
  font-size: 1.6rem;
  font-weight: 900;
  line-height: 1.2;
}

.showcase-heading span {
  display: block;
  margin-top: 0.5rem;
  color: #667085;
  font-size: 0.88rem;
  line-height: 1.55;
}
</style>
