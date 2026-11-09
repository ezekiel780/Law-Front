<template>
  <div class="p-5">
    <div
      class="flex flex-col md:flex-row justify-between items-center space-y-3 w-full"
    >
      <div class="w-full md:w-1/4">
        <input
          type="text"
          class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2]"
          placeholder="Search"
        />
      </div>
      <div class="w-full md:w-2/4 relative">
        <input
          type="text"
          class="bg-[#E6E6F4] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-[#3939A2] focus:ring-[#3939A2] h-10"
          :class="{
            'border-[1px] border-[#F05252] text-[#E02424] placeholder:text-[#E0242469] bg-[#FDF2F2]':
              $v.email.$error,
          }"
          placeholder="Enter email of new user"
          @input="$helper.resetInputValidation($v)"
          v-model="email"
          @keyup.enter="addUser"
        />
        <utils-button
          class="bg-[#08085E] text-white hover:bg-[#3939A2] focus:outline-none focus:ring-2 focus:ring-[#3939A2] focus:ring-offset-2 transition-all text-sm font-medium py-2 px-8 absolute right-0 top-0 h-10"
          :on-click="addUser"
          :button-state="isLoading"
        >
          Add User
        </utils-button>

        <div
          class="absolute top-2 right-36 cursor-pointer"
          v-show="$v.email.$error"
        >
          <i class="ri-information-fill text-[#E02424]" />
        </div>
        <utils-input-validation
          :field="$v.email"
          :field-name="'Email'"
          v-show="$v.email.$error"
        />
      </div>
    </div>
    <!-- table -->
    <div class="my-10 w-full">
      <table class="w-full divide-y divide-gray-200 hidden md:block">
        <thead class="bg-[#E6E6F4]">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-xs font-medium text-[#3D3D3D]"
            >
              S/N
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-xs font-medium text-[#3D3D3D] text-left"
            >
              First Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-xs font-medium text-[#3D3D3D] text-left"
            >
              Last Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-xs font-medium text-[#3D3D3D] text-left"
            >
              Email
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-xs font-medium text-[#3D3D3D] text-left"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-xs font-medium text-[#3D3D3D]"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-[#3D3D3D]">
          <tr class="" v-for="(user, index) in allUsers" :key="`cu-${index}`">
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center"
            >
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ user.firstName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ user.lastName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button
                class="px-3 py-1.5 bg-[#D6F3E9] rounded-full"
                :class="{
                  'text-[#0B973A]': user.status == 'success',
                  'text-[#E02424]': user.status != 'success',
                }"
              >
                {{ formatStatus(user.status) }}
              </button>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center"
            >
              <button
                type="button"
                class="py-2 px-8 flex justify-center items-center gap-2 font-medium text-[#E02424] w-full text-lg"
                @click.prevent="toggleDeleteModal(user.id)"
              >
                <i class="ri-delete-bin-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="md:hidden">
        <div
          class="grid grid-cols-2 gap-3 border-b mt-5 pb-5"
          v-for="(user, index) in allUsers"
          :key="`cu-m-${index}`"
        >
          <div>
            <span class="font-semibold text-[#1A1A1A]">First Name</span><br />
            <span class="text-[#545454]">{{ user.firstName }}</span>
          </div>
          <div class="text-right">
            <span class="font-semibold text-[#1A1A1A]">Last Name</span><br />
            <span class="text-[#545454]">{{ user.lastName }}</span>
          </div>
          <div>
            <span class="font-semibold text-[#1A1A1A]">Email</span><br />
            <span class="text-[#545454]">{{ user.email }}</span>
          </div>
          <div class="text-right">
            <span class="mt-6">
              <button
                class="text-[#0B973A] px-3 py-1.5 bg-[#D6F3E9] rounded-full"
                :class="{
                  'text-[#0B973A]': user.status == 'success',
                  'text-[#E02424]': user.status != 'success',
                }"
              >
                {{ formatStatus(user.status) }}
              </button>
            </span>
          </div>
          <div class="col-span-2">
            <utils-button
              class="bg-white text-[#E02424] hover:bg-[#E02424] border-[1px] border-[#E02424] hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all text-sm font-medium py-3 px-10 w-full"
              :on-click="
                () => {
                  toggleDeleteModal(user.id)
                }
              "
              :button-state="false"
            >
              Remove User
            </utils-button>
          </div>
        </div>
      </div>
    </div>
    <!-- delete confirmation modal -->
    <dashboard-subscription-delete-user-modal
      :modal-state="deleteModalState"
      :user-id="userId"
      @toggle-modal="closeModal"
      v-if="deleteModalState"
    />
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      allUsers: [],
      email: '',
      isLoading: false,
      deleteModalState: false,
      userId: null,
      query: null,
    }
  },
  validations() {
    return {
      email: { required, email },
    }
  },
  methods: {
    formatStatus(status) {
      return String(status || 'pending')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    },
    async getUsers() {
      try {
        const { data } = await this.$api.subscription.getCorporateUsers()
        this.allUsers = data.success.data
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') console.trace(errorResponse)
        this.$notify({
          type: 'info',
          title: 'Notice',
          text: errorResponse.message,
          duration: 5000,
        })
      }
    },

    async addUser() {
      try {
        this.$v.$touch()
        if (this.$v.$invalid) return false
        this.isLoading = true
        const subscriptionId = await this.$user.getSubscriptionId()
        const { data } = await this.$api.subscription.addCorporateUser({
          email: this.email,
          subscription_id: subscriptionId.toString(),
        })
        await this.getUsers()
        this.$notify({
          type: 'success',
          title: 'Success',
          text: `${data.success.message}`,
          duration: 5000,
        })
      } catch (error) {
        const errorResponse = this.$errorHandler.setAndParse(error)
        if (process.env.NODE_ENV === 'development') console.trace(errorResponse)
        this.$notify({
          type: 'info',
          title: 'Notice',
          text: errorResponse.message,
          duration: 5000,
        })
      } finally {
        this.email = ''
        this.$helper.resetInputValidation(this.$v)
        this.isLoading = false
      }
    },
    toggleDeleteModal(userId = null) {
      this.userId = userId
      this.deleteModalState = !this.deleteModalState
    },
    async closeModal(res) {
      this.userId = null
      this.deleteModalState = false
      const { status, msg } = res
      if (status == 'success') await this.getUsers()
      if (msg)
        this.$notify({
          type: status,
          title: status.toUpperCase(),
          text: msg,
          duration: 5000,
        })
    },
    searchUser() {
      const allUsers = this.allUsers
    },
  },
  mounted() {
    this.getUsers()
  },
}
</script>
