export const normalizedText = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()

export const normalizedPlanCategory = (plan = {}) =>
  normalizedText(plan.category)

export const planTitle = (plan = {}) =>
  String(plan.title ?? '').trim()

export const uniqueBy = (items, keyFor) => {
  const result = []
  const seen = new Set()

  items.forEach((item) => {
    const key = keyFor(item)
    if (!key || seen.has(key)) return
    seen.add(key)
    result.push(item)
  })

  return result
}

export const requiresSalesContact = (plan = {}) =>
  Number(plan.amount || 0) <= 0

const rawPlanProducts = (plan = {}) => {
  const directProducts = Array.isArray(plan.products) ? plan.products : []
  const primaryProduct =
    plan.product && typeof plan.product === 'object' ? [plan.product] : []

  return uniqueBy(
    [...primaryProduct, ...directProducts].filter(
      (product) => product && typeof product === 'object'
    ),
    (product) => (product.id == null ? '' : String(product.id))
  )
}

export const planProducts = (plan = {}) =>
  rawPlanProducts(plan)
    .map((product) => ({
      key: String(product.id),
      name: String(product.name ?? '').trim(),
      description: String(product.description ?? '').trim(),
    }))
    .filter((product) => product.name)

export const catalogProducts = (plans = []) =>
  uniqueBy(
    (Array.isArray(plans) ? plans : []).flatMap((plan) => planProducts(plan)),
    (product) => product.key
  )

const productFamilyRankFromName = (value) => {
  const name = normalizedText(value)

  if (/\bnwlr\b/.test(name) || name.includes('nigerian weekly law report')) {
    return 0
  }

  if (/\bncld\b/.test(name) || name.includes('nigerian criminal law digest')) {
    return 1
  }

  return 2
}

export const planProductFamilyRank = (plan = {}) => {
  const primaryProduct =
    plan.product && typeof plan.product === 'object' ? plan.product : null

  return primaryProduct
    ? productFamilyRankFromName(primaryProduct.name)
    : 2
}

export const planFeatures = (plan = {}) => {
  const entitlements = Array.isArray(plan.feature_entitlements)
    ? plan.feature_entitlements
    : []

  return uniqueBy(
    entitlements
      .filter(
        (entitlement) =>
          entitlement &&
          entitlement.is_active !== false &&
          entitlement.id != null &&
          String(entitlement.feature_name ?? '').trim()
      )
      .map((entitlement) => ({
        key: String(entitlement.id),
        name: String(entitlement.feature_name).trim(),
      })),
    (feature) => feature.key
  )
}

export const durationLabel = (plan = {}) => {
  const interval = String(plan.billing_interval || '').trim().toLowerCase()
  const count = Number(plan.interval_count || 0)
  if (!['day', 'week', 'month', 'year'].includes(interval) || !Number.isInteger(count) || count < 1) {
    return 'Duration not configured'
  }

  return `${count} ${interval}${count === 1 ? '' : 's'}`
}

export const categoryLabel = (plan = {}) => {
  const category = normalizedPlanCategory(plan)
  return category.charAt(0).toUpperCase() + category.slice(1)
}

export const productInitials = (names = []) => {
  const initials = names
    .join(' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

  return initials || 'OA'
}

export const planProductSignature = (plan = {}) =>
  planProducts(plan)
    .map((product) => product.key)
    .sort()
    .join('|')

export const planProductLabel = (plan = {}) =>
  planProducts(plan)
    .map((product) => product.name)
    .sort()
    .join(' + ')

const categoryRank = (plan = {}) => {
  const category = normalizedPlanCategory(plan)
  if (category === 'individual') return 0
  if (category === 'corporate') return 1
  return 2
}

export const comparePlansForCatalog = (left = {}, right = {}) => {
  const categoryDifference = categoryRank(left) - categoryRank(right)
  if (categoryDifference) return categoryDifference

  const productFamilyDifference =
    planProductFamilyRank(left) - planProductFamilyRank(right)
  if (productFamilyDifference) return productFamilyDifference

  const productDifference = planProductLabel(left).localeCompare(
    planProductLabel(right)
  )
  if (productDifference) return productDifference

  if (normalizedPlanCategory(left) === 'individual') {
    const premiumDifference = Number(Boolean(right.is_premium)) - Number(Boolean(left.is_premium))
    if (premiumDifference) return premiumDifference
  }

  const amountDifference =
    Number(right.amount || 0) - Number(left.amount || 0)
  if (amountDifference) return amountDifference

  const orderDifference =
    Number(left.sort_order || 0) - Number(right.sort_order || 0)
  if (orderDifference) return orderDifference

  return planTitle(left).localeCompare(planTitle(right))
}

export const comparePlansByProductAndCost = comparePlansForCatalog

export const markPremiumPlansByProduct = (plans = []) => {
  const source = Array.isArray(plans) ? plans : []
  const highestIndividualAmountByProduct = new Map()

  source.forEach((plan) => {
    if (normalizedPlanCategory(plan) !== 'individual') return

    const key = planProductSignature(plan)
    if (!key) return

    const amount = Number(plan.amount || 0)
    const current = highestIndividualAmountByProduct.get(key)

    if (current == null || amount > current) {
      highestIndividualAmountByProduct.set(key, amount)
    }
  })

  return source.map((plan) => {
    const productSignature = planProductSignature(plan)

    return {
      ...plan,
      is_premium:
        Boolean(productSignature) &&
        normalizedPlanCategory(plan) === 'individual' &&
        Number(plan.amount || 0) ===
          highestIndividualAmountByProduct.get(productSignature),
    }
  })
}
