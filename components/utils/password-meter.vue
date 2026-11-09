<template>
  <div class="flex flex-col space-y-1">
    <div class="flex items-center space-x-1">
      <span
        class="w-9 h-1 border-0"
        :class="{
          'bg-[#c10000]': grade >= 0,
          'bg-[#3939A2]': grade < 0,
        }"
      />
      <span
        class="w-9 h-1 border-0"
        :class="{
          'bg-[#c10000]': grade >= 1,
          'bg-[#3939A2]': grade < 1,
        }"
      />
      <span
        class="w-9 h-1 border-0"
        :class="{
          'bg-[#c10000]': grade >= 2,
          'bg-[#3939A2]': grade < 2,
        }"
      />
      <span
        class="w-9 h-1 border-0"
        :class="{
          'bg-[#c10000]': grade >= 3,
          'bg-[#3939A2]': grade < 3,
        }"
      />
      <span
        class="w-9 h-1 border-0"
        :class="{
          'bg-[#c10000]': grade >= 4,
          'bg-[#3939A2]': grade < 4,
        }"
      />
    </div>
    <p class="text-[#655C5B] text-xs italic">
      NOTE: Password is {{ passwordStrength }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    password: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    grade: 0,
  }),
  computed: {
    passwordStrength() {
      let strength = 'risky'
      switch (this.grade) {
        case 0:
          strength = 'risky'
          break

        case 1:
          strength = 'guessable'
          break

        case 2:
          strength = 'weak'
          break

        case 3:
          strength = 'safe'
          break

        case 4:
          strength = 'secure'
          break

        default:
          strength = 'risky'
          break
      }
      return strength
    },
  },
  watch: {
    password: {
      handler(newValue) {
        this.grade = this.$helper.passwordGrade(newValue)
        this.onPasswordGraded()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onPasswordGraded() {
      this.$emit('graded-result', this.grade)
    }, //end of onPasswordGraded
  },
}
</script>
