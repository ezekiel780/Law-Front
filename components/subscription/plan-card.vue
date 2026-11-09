<template>
  <div class="plan-card-inner">
    <div>
      <div class="plan-card-topline">
        <span v-if="premium" class="premium-badge">Premium</span>
        <span v-else class="category-badge">{{ category }}</span>
        <span v-if="plan.is_featured" class="featured-badge">Featured</span>
      </div>

      <div
        v-if="products.length > 1"
        class="product-pills"
        aria-label="Included products"
      >
        <span
          v-for="product in products"
          :key="product.key"
          class="product-pill"
        >
          {{ product.name }}
        </span>
      </div>

      <h4 class="plan-title">{{ plan.title }}</h4>
      <p v-if="plan.description" class="plan-description">
        {{ plan.description }}
      </p>

      <div class="plan-meta">
        <span>
          <i class="ri-calendar-line"></i>
          {{ duration }}
        </span>
        <span>
          <i class="ri-user-line"></i>
          {{ seatsLabel }}
        </span>
      </div>

      <div v-if="visibleFeatures.length" class="feature-list">
        <p class="feature-heading">Included access</p>
        <ul>
          <li v-for="feature in visibleFeatures" :key="feature.key">
            <span class="feature-check"><i class="ri-check-line"></i></span>
            <span>{{ feature.name }}</span>
          </li>
        </ul>
        <p v-if="hiddenFeatureCount" class="more-features">
          +{{ hiddenFeatureCount }} more
        </p>
      </div>
    </div>

    <div class="plan-footer">
      <div class="price-block">
        <p
          v-if="salesContactRequired"
          class="price-value price-value-custom"
        >
          Custom pricing
        </p>
        <p v-else class="price-value">
          <span class="currency-symbol">{{ currencySymbol }}</span
          >{{ $helper.formatAmount(plan.amount) }}
        </p>
        <p v-if="priceQualifier" class="mt-1 text-xs font-medium text-slate-500">
          {{ priceQualifier }}
        </p>
      </div>

      <button
        type="button"
        class="plan-cta"
        :class="{ 'plan-cta-premium': premium }"
        @click.prevent="$emit('select-plan', plan)"
      >
        <span>{{ salesContactRequired ? 'Talk to sales' : 'Choose plan' }}</span>
        <i class="ri-arrow-right-line"></i>
      </button>
    </div>
  </div>
</template>

<script>
import {
  categoryLabel,
  durationLabel,
  planFeatures,
  planProducts,
  requiresSalesContact,
} from '~/utils/subscription-plan.js'

export default {
  name: 'SubscriptionPlanCard',
  props: {
    plan: {
      type: Object,
      required: true,
    },
    premium: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    products() {
      return planProducts(this.plan)
    },
    features() {
      return planFeatures(this.plan)
    },
    visibleFeatures() {
      return this.features.slice(0, 3)
    },
    hiddenFeatureCount() {
      return Math.max(0, this.features.length - this.visibleFeatures.length)
    },
    salesContactRequired() {
      return requiresSalesContact(this.plan)
    },
    duration() {
      return durationLabel(this.plan)
    },
    category() {
      return categoryLabel(this.plan)
    },
    seatsLabel() {
      const minimum = Math.max(1, Number(this.plan.min_seats || this.plan.no_of_users || 1))
      const flexible = Boolean(
        this.plan.seat_selection_enabled !== undefined
          ? this.plan.seat_selection_enabled
          : this.plan.allow_user_input
      )

      if (flexible) return `${minimum}+ users`

      if (minimum === 1) return '1 user'
      return `${minimum} users`
    },
    priceQualifier() {
      const flexible = Boolean(
        this.plan.seat_selection_enabled !== undefined
          ? this.plan.seat_selection_enabled
          : this.plan.allow_user_input
      )
      return flexible ? 'per seat' : ''
    },
    currencySymbol() {
      const currency = String(this.plan.currency || 'NGN').toUpperCase()
      if (currency === 'NGN') return '₦'
      if (currency === 'USD') return '$'
      if (currency === 'GBP') return '£'
      if (currency === 'EUR') return '€'
      return `${currency} `
    },
  },
}
</script>
