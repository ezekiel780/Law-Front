<template>
  <button
    class="flex justify-center items-center space-x-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in duration-200"
    @click.prevent="onClick"
  >
    <span>
      <slot>Button</slot>
    </span>
    <utils-loader v-if="buttonState" class="mx-[0.6rem]" />
  </button>
</template>

<script>
export default {
  props: {
    onClick: {
      type: Function,
      default: () => {},
    },
    buttonState: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
