<template>
  <div class="my-6 max-w-5xl">
    <div class="flex gap-5 items-center">
      <span class="w-5 h-5 bg-[#DDC524]"></span>
      <span class="font-medium text-lg">Set Your Password</span>
    </div>

    <div
      class="mt-5 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900"
    >
      You signed in with a one-time password. Before you can use NWLR Online,
      enter that one-time password as your old password and choose a new
      password known only to you.
    </div>

    <dashboard-my-account-change-password />
  </div>
</template>

<script>
export default {
  name: 'PasswordChangeRequiredPage',
  layout: 'dashboard',
}
</script>
