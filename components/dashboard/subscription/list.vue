<template>
  <div class="my-6">
    <!-- breadcrumb -->
    <div class="flex gap-5 items-center">
      <span class="w-5 h-5 bg-[#DDC524]"></span>
      <span class="font-medium text-lg">My Subscription</span>
    </div>
    <!-- content -->
    <div class="bg-white rounded-lg">
      <div class="flex justify-between items-center my-5 p-5 md:py-10">
        <div></div>
        <div
          class="rounded-md border-[1px] border-[#babcd4] flex flex-col md:flex-row w-full md:w-fit gap-3 p-1.5"
        >
          <button
            type="button"
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border[1px] border-[#08085E] font-medium hover:bg-[#3939A2] hover:text-[#fff] transition-all text-sm"
            :class="
              buttonStates.plans
                ? 'bg-[#08085E] text-[#fff]'
                : 'bg-[#fff] text-[#08085E]'
            "
            @click.prevent="toggleButton('plans', true)"
          >
            Plans
          </button>
          <button
            type="button"
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border[1px] border-[#08085E] font-medium hover:bg-[#3939A2] hover:text-[#fff] transition-all text-sm"
            :class="
              buttonStates.history
                ? 'bg-[#08085E] text-[#fff]'
                : 'bg-[#fff] text-[#08085E]'
            "
            @click.prevent="toggleButton('history', true)"
          >
            History
          </button>
          <button
            v-if="canManagePlanChanges"
            type="button"
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border[1px] border-[#08085E] font-medium hover:bg-[#3939A2] hover:text-[#fff] transition-all text-sm"
            :class="
              buttonStates.planChange
                ? 'bg-[#08085E] text-[#fff]'
                : 'bg-[#fff] text-[#08085E]'
            "
            @click.prevent="toggleButton('planChange', true)"
          >
            Change Plan
          </button>
          <button
            v-if="canManageCorporateUsers"
            type="button"
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border[1px] border-[#08085E] font-medium hover:bg-[#3939A2] hover:text-[#fff] transition-all text-sm"
            :class="
              buttonStates.manageUser
                ? 'bg-[#08085E] text-[#fff]'
                : 'bg-[#fff] text-[#08085E]'
            "
            @click.prevent="toggleButton('manageUser', true)"
          >
            Manage User
          </button>
          <button
            v-if="canManageAutoRenewal"
            type="button"
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border[1px] border-[#08085E] font-medium hover:bg-[#3939A2] hover:text-[#fff] transition-all text-sm"
            :class="
              buttonStates.autoRenewal
                ? 'bg-[#08085E] text-[#fff]'
                : 'bg-[#fff] text-[#08085E]'
            "
            @click.prevent="toggleButton('autoRenewal', true)"
          >
            Auto-Renewal
          </button>
        </div>
        <div></div>
      </div>

      <dashboard-subscription-plan
        v-if="buttonStates.plans"
        :subscription-data="data"
      />
      <dashboard-subscription-history v-if="buttonStates.history" />
      <dashboard-subscription-plan-change
        v-if="canManagePlanChanges && buttonStates.planChange"
        :subscription-data="data"
      />
      <dashboard-subscription-manage-user
        v-if="canManageCorporateUsers && buttonStates.manageUser"
      />
      <dashboard-subscription-auto-renewal
        v-if="canManageAutoRenewal && buttonStates.autoRenewal"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    canManageCorporateUsers: {
      type: Boolean,
      default: false,
    },
    canManageAutoRenewal: {
      type: Boolean,
      default: false,
    },
    canManagePlanChanges: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      buttonStates: {
        plans: true,
        history: false,
        planChange: false,
        manageUser: false,
        autoRenewal: false,
      },
    }
  },
  watch: {
    canManagePlanChanges(canManage) {
      if (!canManage && this.buttonStates.planChange) {
        this.toggleButton('plans', true)
      }
    },
    canManageCorporateUsers(canManage) {
      if (!canManage && this.buttonStates.manageUser) {
        this.toggleButton('plans', true)
      }
    },
    canManageAutoRenewal(canManage) {
      if (!canManage && this.buttonStates.autoRenewal) {
        this.toggleButton('plans', true)
      }
    },
  },
  methods: {
    toggleButton(key, status = null) {
      if (key === 'planChange' && !this.canManagePlanChanges) return
      if (key === 'manageUser' && !this.canManageCorporateUsers) return
      if (key === 'autoRenewal' && !this.canManageAutoRenewal) return
      for (const stateKey in this.buttonStates) {
        if (this.buttonStates.hasOwnProperty(stateKey)) {
          this.buttonStates[stateKey] = false
        }
      }
      this.buttonStates[key] =
        status === null ? !this.buttonStates[key] : status
    },
  },
}
</script>
