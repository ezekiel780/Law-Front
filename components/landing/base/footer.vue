<!-- Footer.vue -->
<template>
  <div>
    <footer class="bg-[#08085E] text-[#DDDDDD]">
      <div class="max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
        <!-- Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div class="col-span-full lg:col-span-2">
            <nuxt-link
              class="flex-none text-xl font-semibold text-white"
              to="/"
              aria-label="NWLR home"
            >
              <img
                class="h-8 w-auto sm:h-10"
                src="@/assets/images/logo.png"
                alt="NWLR Logo"
              />
            </nuxt-link>

            <p class="text-sm my-4">Get to Know</p>

            <!-- Social media buttons clickable + accessible -->
            <div class="flex items-center gap-x-4">
              <a
                href="https://www.facebook.com/NigerianWeeklyLawReports"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                class="cursor-pointer hover:opacity-80 transition"
              >
                <img src="@/assets/icons/facebook.svg" alt="Facebook Icon" />
              </a>

              <a
                href="https://www.x.com/NWLRonline"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                class="cursor-pointer hover:opacity-80 transition"
              >
                <img src="@/assets/icons/twitter.svg" alt="Twitter Icon" />
              </a>

              <a
                href="https://www.linkedin.com/company/nigerian-weekly-law-report/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                class="cursor-pointer hover:opacity-80 transition"
              >
                <img src="@/assets/icons/linkedin.svg" alt="LinkedIn Icon" />
              </a>

              <a
                href="https://www.instagram.com/NigerianWeeklyLawReports"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                class="cursor-pointer hover:opacity-80 transition"
              >
                <img src="@/assets/icons/instagram.svg" alt="Instagram Icon" />
              </a>
            </div>
          </div>
          <!-- End Col -->

          <div class="col-span-2">
            <h4 class="font-semibold text-gray-100">Information</h4>

            <div class="mt-3 grid space-y-3 text-sm">
              <!-- Contact Us clickable -->
              <p>
                <nuxt-link
                  class="inline-flex gap-x-2 hover:text-white transition"
                  to="/contact-us"
                >
                  Contact Us
                </nuxt-link>
              </p>

              <!-- Tel clickable -->
              <p>
                <span class="inline-flex gap-x-2">
                  <span class="font-semibold">Tel:</span>
                  <span class="space-x-2">
                    <a
                      href="tel:02016316950"
                      class="hover:text-white transition"
                      aria-label="Call 02016316950"
                    >
                      02016316950
                    </a>
                    <span>|</span>
                    <a
                      href="tel:08105046858"
                      class="hover:text-white transition"
                      aria-label="Call 08105046858"
                    >
                      08105046858
                    </a>
                    <span>|</span>
                    <a
                      href="tel:08102623522"
                      class="hover:text-white transition"
                      aria-label="Call 08102623522"
                    >
                      08102623522
                    </a>
                  </span>
                </span>
              </p>

              <!-- Email clickable -->
              <p>
                <span class="inline-flex gap-x-2">
                  <span class="font-semibold">Email:</span>
                  <a
                    href="mailto:contact@nigerianlawpublications.com?subject=Inquiry%20from%20NWLR%20Website&body=Hello%20Nigerian%20Law%20Publications%20Team%2C%0A%0A"
                    class="hover:text-white transition"
                  >
                    contact@nigerianlawpublications.com
                  </a>
                </span>
              </p>

              <p>
                <span class="inline-flex gap-x-2">
                  <span class="font-semibold">Working Hours:</span>
                  <span>8am-5pm(Monday-Friday)</span>
                </span>
              </p>
            </div>
          </div>
          <!-- End Col -->

          <div class="col-span-1">
            <h4 class="font-semibold text-gray-100">Information</h4>

            <div class="mt-3 grid space-y-3">
              <p>
                <a
                  class="inline-flex gap-x-2 hover:text-white transition"
                  href="https://nigerianlawpublications.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NLP
                </a>
              </p>
              <p>
                <nuxt-link
                  class="inline-flex gap-x-2 hover:text-white transition"
                  to="/"
                >
                  Home
                </nuxt-link>
              </p>
              <p>
                <nuxt-link
                  class="inline-flex gap-x-2 hover:text-white transition"
                  to="/dictionary-hardcopy"
                >
                  Dictionary (Hardcopy)
                </nuxt-link>
              </p>
              <p>
                <a
                  class="inline-flex gap-x-2 hover:text-white transition"
                  href="https://shop.nigerianlawpublications.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop
                </a>
              </p>
              <p>
                <nuxt-link
                  class="inline-flex gap-x-2 hover:text-white transition"
                  to="/about-us"
                >
                  About Us
                </nuxt-link>
              </p>
              <p>
                <nuxt-link
                  class="inline-flex gap-x-2 hover:text-white transition"
                  to="/contact-us"
                >
                  Enquiries
                </nuxt-link>
              </p>
            </div>
          </div>
          <!-- End Col -->
        </div>
        <!-- End Grid -->
      </div>
    </footer>

    <div class="bg-[#150043] text-[#DDDDDD]">
      <div class="max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div
          class="grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-center sm:items-center"
        >
          <div class="flex justify-center items-center">
            <p class="text-sm">
              Copyright &copy; {{ year }} Nigerian Law Publications Ltd. All
              Rights Reserved.
            </p>
          </div>
          <!-- End Col -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
}
</script>
