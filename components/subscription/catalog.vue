<template>
  <div class="plan-catalog">
    <section
      v-for="group in productGroups"
      :key="group.key"
      class="product-section"
    >
      <div class="product-heading">
        <div>
          <div class="product-title-row">
            <span class="category-section-badge">
              {{ group.categoryLabel }}
            </span>
            <h3>{{ group.name }}</h3>
            <span v-if="group.isBundle" class="bundle-badge">
              Product bundle
            </span>
          </div>
          <p v-if="group.description">{{ group.description }}</p>
        </div>
        <span class="plan-count">
          {{ group.plans.length }} plan{{ group.plans.length === 1 ? '' : 's' }}
        </span>
      </div>

      <div class="plan-grid">
        <article
          v-for="plan in group.plans"
          :key="`plan-${plan.id}`"
          class="plan-card"
          :class="{ 'plan-card-premium': isPremium(plan) }"
        >
          <subscription-plan-card
            :plan="plan"
            :premium="isPremium(plan)"
            @select-plan="selectPlan"
          />
        </article>
      </div>
    </section>

    <div v-if="!hasPlans" class="empty-state">
      <div class="empty-state-icon">
        <i class="ri-file-list-3-line"></i>
      </div>
      <h3>No subscription plans are currently available</h3>
      <p>Please check again later or contact Customer Service.</p>
    </div>
  </div>
</template>

<script>
import SubscriptionPlanCard from '~/components/subscription/plan-card.vue'
import {
  categoryLabel,
  comparePlansForCatalog,
  markPremiumPlansByProduct,
  normalizedPlanCategory,
  planProducts,
  uniqueBy,
} from '~/utils/subscription-plan.js'

export default {
  name: 'SubscriptionCatalog',
  components: {
    SubscriptionPlanCard,
  },
  props: {
    plans: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    normalizedPlans() {
      const plans = uniqueBy(
        (this.plans || []).filter((plan) => plan && plan.id != null),
        (plan) => String(plan.id)
      )

      return markPremiumPlansByProduct(plans).sort(comparePlansForCatalog)
    },
    premiumPlanIds() {
      return new Set(
        this.normalizedPlans
          .filter((plan) => plan.is_premium)
          .map((plan) => String(plan.id))
      )
    },
    productGroups() {
      const groups = new Map()

      this.normalizedPlans.forEach((plan) => {
        const products = planProducts(plan)
        const signature = products
          .map((product) => product.key)
          .sort()
          .join('|')
        const category = normalizedPlanCategory(plan)
        const key = `${category}:${signature}`

        if (!groups.has(key)) {
          const names = products.map((product) => product.name)
          const descriptions = products
            .map((product) => product.description)
            .filter(Boolean)

          groups.set(key, {
            key,
            category,
            categoryLabel: categoryLabel(plan),
            name: names.length > 1 ? names.join(' + ') : names[0],
            description:
              names.length > 1
                ? `Combined access to ${names.join(' and ')}.`
                : descriptions[0] || '',
            isBundle: products.length > 1,
            plans: [],
          })
        }

        groups.get(key).plans.push(plan)
      })

      return Array.from(groups.values())
        .map((group) => ({
          ...group,
          plans: group.plans.slice().sort(comparePlansForCatalog),
        }))
        .sort((left, right) =>
          comparePlansForCatalog(left.plans[0], right.plans[0])
        )
    },
    hasPlans() {
      return this.normalizedPlans.length > 0
    },
  },
  methods: {
    isPremium(plan) {
      return this.premiumPlanIds.has(String(plan.id))
    },
    selectPlan(plan) {
      this.$emit('select-plan', plan)
    },
  },
}
</script>

<style>
.plan-catalog {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.product-section {
  min-width: 0;
}

.product-section + .product-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
}

.product-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
}

.product-title-row h3 {
  color: #111827;
  font-size: 1.15rem;
  font-weight: 800;
}

.product-heading p {
  margin-top: 0.25rem;
  color: #667085;
  font-size: 0.8rem;
  line-height: 1.5;
}

.bundle-badge,
.category-section-badge,
.category-badge,
.featured-badge,
.premium-badge,
.product-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-weight: 700;
}

.category-section-badge {
  border: 1px solid #c7d2fe;
  background: #eef2ff;
  color: #3730a3;
  padding: 0.2rem 0.5rem;
  font-size: 0.65rem;
}

.bundle-badge {
  border: 1px solid #e3d36a;
  color: #756500;
  padding: 0.2rem 0.5rem;
  font-size: 0.65rem;
}

.plan-count {
  flex: 0 0 auto;
  color: #98a2b3;
  font-size: 0.72rem;
  font-weight: 600;
}

.plan-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.9rem;
}

.plan-card {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border-radius: 0.9rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.plan-card:hover {
  border-color: #b8bdd0;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.07);
}

.plan-card-premium {
  border-color: #d5bd28;
  box-shadow: inset 0 3px 0 #ddc524;
}

.plan-card-inner {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
}

.plan-card-topline {
  display: flex;
  min-height: 1.45rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
}

.category-badge {
  color: #667085;
  font-size: 0.68rem;
}

.premium-badge {
  background: #fff8cc;
  color: #6f5e00;
  padding: 0.22rem 0.5rem;
  font-size: 0.66rem;
}

.featured-badge {
  background: #ecfdf3;
  color: #067647;
  padding: 0.22rem 0.5rem;
  font-size: 0.66rem;
}

.product-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.65rem;
}

.product-pill {
  border: 1px solid #e5e7eb;
  color: #667085;
  padding: 0.2rem 0.45rem;
  font-size: 0.64rem;
}

.plan-title {
  margin-top: 0.65rem;
  color: #111827;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.3;
}

.plan-description {
  margin-top: 0.35rem;
  color: #667085;
  font-size: 0.78rem;
  line-height: 1.5;
}

.plan-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
  color: #667085;
  font-size: 0.72rem;
  font-weight: 600;
}

.plan-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.feature-list {
  margin-top: 0.85rem;
  border-top: 1px solid #f0f1f4;
  padding-top: 0.75rem;
}

.feature-heading {
  color: #475467;
  font-size: 0.68rem;
  font-weight: 700;
}

.feature-list ul {
  display: grid;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  color: #475467;
  font-size: 0.74rem;
  line-height: 1.35;
}

.feature-check {
  color: #08085e;
  font-size: 0.78rem;
}

.more-features {
  margin-top: 0.5rem;
  color: #667085;
  font-size: 0.7rem;
  font-weight: 600;
}

.plan-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-top: 1px solid #f0f1f4;
  padding-top: 0.8rem;
}

.price-label {
  display: none;
}

.price-value {
  color: #08085e;
  font-size: 1.25rem;
  font-weight: 900;
  line-height: 1;
}

.currency-symbol {
  margin-right: 0.08rem;
  font-size: 0.9rem;
}

.price-value-custom {
  font-size: 0.92rem;
}

.plan-cta {
  display: inline-flex;
  min-height: 2.35rem;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border-radius: 0.65rem;
  background: #08085e;
  color: white;
  padding: 0.6rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 800;
}

.plan-cta:hover {
  background: #25258c;
}

.plan-cta-premium {
  background: #08085e;
  color: #ffffff;
}

.empty-state {
  display: flex;
  min-height: 14rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  border: 1px dashed #cfd3e5;
  padding: 2rem;
  text-align: center;
}

.empty-state-icon {
  color: #08085e;
  font-size: 1.4rem;
}

.empty-state h3 {
  margin-top: 0.75rem;
  color: #111827;
  font-weight: 800;
}

.empty-state p {
  margin-top: 0.3rem;
  color: #667085;
  font-size: 0.82rem;
}

@media (min-width: 768px) {
  .plan-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .plan-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .product-heading,
  .plan-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .plan-count {
    display: none;
  }

  .plan-cta {
    width: 100%;
  }
}
</style>
