export default (nuxtContext) => ({
  onlyNumberInput: ($event) => {
    let keyCode = $event.keyCode ? $event.keyCode : $event.which
    if (keyCode < 48 || keyCode > 57) {
      $event.preventDefault()
    }
  },

  resetInputValidation: (validator) => {
    validator.$reset()
  },

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  },

  greetUser() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  },

  generateRandomCode(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      code += charset.charAt(randomIndex)
    }
    return code
  },

  formatAmount(amount) {
    /*
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Change to your desired currency code
      minimumFractionDigits: 2, // Minimum number of decimal places
      maximumFractionDigits: 2, // Maximum number of decimal places
    });

    // Format a number as an amount
    const amount = 1234.567;
    const formattedAmount = formatter.format(amount);
    */
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  formatEmail: (email) => {
    const splittedMail = email.split('@')
    const name =
      splittedMail[0].length > 5 ? splittedMail[0].slice(0, 5) : splittedMail[0]
    return `${name}****@${splittedMail[1]}`
  },

  formatPhone: (phone) => {
    const number = phone.length > 4 ? phone.slice(0, 4) : phone
    return `${number} *** ${phone.slice(-4)}`
  },

  formatMoney: (money, validator = null) => {
    if (validator) validator.$reset()
    if (!money) return ''
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  passwordGrade: (pass) => {
    if (pass.length < 8) return 0

    let score = 0
    let lengthScore = 0
    let hasLowerCase = false
    let hasUpperCase = false
    let hasNumber = false
    let hasSpecialChar = false
    let repeatCharCount = new Set()

    for (let i = 0; i < pass.length; i++) {
      const char = pass[i]
      if ('a' <= char && char <= 'z') {
        hasLowerCase = true
      } else if ('A' <= char && char <= 'Z') {
        hasUpperCase = true
      } else if ('0' <= char && char <= '9') {
        hasNumber = true
      } else {
        hasSpecialChar = true
      }
      repeatCharCount.add(char)
    }

    const hasRepeatChars = repeatCharCount.size < pass.length - 3

    // Adjust length score based on password length and repeat characters
    if (pass.length > 25 && !hasRepeatChars) lengthScore = 3
    else if (pass.length > 12 && !hasRepeatChars) lengthScore = 2
    else if (pass.length > 8) lengthScore = 1

    // Calculate score based on character mix and length
    score += lengthScore
    if (hasLowerCase || hasUpperCase) score += hasNumber ? 1 : 0
    if (hasUpperCase && hasLowerCase) score += 1
    if ((hasLowerCase || hasUpperCase || hasNumber) && hasSpecialChar)
      score += 1

    return Math.min(score, 4)
  },

})
