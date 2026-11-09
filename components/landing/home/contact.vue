<template>
  <div class="mt-2 mb-10">
    <!-- Hero -->
    <div class="max-w-[85rem] mx-auto">
      <!-- Grid -->
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div>
          <img src="@/assets/images/envelope-group.png" alt="Hero Image" />
        </div>
        <!-- End Col -->

        <div class="px-4 sm:px-6 lg:px-8 mb-10">
          <h4 class="text-[#1A1A1A] text-2xl font-semibold mt-6">Let's Talk</h4>

          <p class="mt-6 font-light text-[#4A4A4A] text-sm">
            Do you have any idea or feedback to share with us?<br />
            We can create amazing solutions together.<br />
            Let's meet you.
          </p>

          <div class="mt-6 text-[#08085E] flex flex-col space-y-4">
            <!-- Phone -->
            <div class="flex items-center gap-x-4 bg-[#eff0f4] p-4 rounded-xl">
              <img src="@/assets/icons/phone.svg" alt="Phone Icon" />
              <span class="text-sm leading-6">
                Call:
                <a
                  href="tel:02016316950"
                  class="font-semibold hover:underline"
                  aria-label="Call 02016316950"
                  @click="trackPhoneClick('02016316950')"
                >
                  02016316950
                </a>
                <span class="text-[#4A4A4A]"> (9am-5pm) Monday–Friday</span>
                <br />
                <a
                  href="tel:08105046858"
                  class="font-semibold hover:underline"
                  aria-label="Call 08105046858"
                  @click="trackPhoneClick('08105046858')"
                >
                  08105046858
                </a>
                <span class="mx-2 text-[#4A4A4A]">,</span>

                <a
                  href="tel:08102623522"
                  class="font-semibold hover:underline"
                  aria-label="Call 08102623522"
                  @click="trackPhoneClick('08102623522')"
                >
                  08102623522
                </a>
              </span>
            </div>

            <!-- Email -->
            <div class="flex items-center gap-x-4 bg-[#eff0f4] p-4 rounded-xl">
              <img src="@/assets/icons/envelope.svg" alt="Email Icon" />
              <a
                class="font-semibold hover:underline break-all"
                href="mailto:contact@nigerianlawpublications.com?subject=Inquiry%20from%20NWLR%20Website&body=Hello%20Nigerian%20Law%20Publications%20Team%2C%0A%0A"
                aria-label="Email contact@nigerianlawpublications.com"
                @click="trackEmailClick('contact@nigerianlawpublications.com')"
              >
                contact@nigerianlawpublications.com
              </a>
            </div>

            <!-- Location (optional: make it open Google Maps) -->
            <div class="flex items-center gap-x-4 bg-[#eff0f4] p-4 rounded-xl">
              <img src="@/assets/icons/location.svg" alt="Location Icon" />
              <a
                class="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                :href="mapsLink"
                aria-label="Open location in Google Maps"
                @click="trackMapClick"
              >
                Nigerian Law Publications House, Otunba Jobi Fele Way, C.B.D.,
                Alausa, Ikeja, Lagos, Nigeria.
              </a>
            </div>
          </div>
        </div>
        <!-- End Col -->
      </div>
      <!-- End Grid -->
    </div>
    <!-- End Hero -->
  </div>
</template>

<script>
import GtagEvents from '~/mixins/GtagEvents.js'

export default {
  name: 'ContactHero',
  mixins: [GtagEvents],

  computed: {
    mapsLink() {
      return (
        'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(
          'Nigerian Law Publications House, Otunba Jobi Fele Way, C.B.D., Alausa, Ikeja, Lagos, Nigeria'
        )
      )
    },
  },

  methods: {
    trackPhoneClick(phoneNumber) {
      this.trackGtagEvent('contact_phone_click', {
        contact_method: 'phone',
        phone_number: phoneNumber,
      })
    },

    trackEmailClick(email) {
      this.trackGtagEvent('contact_email_click', {
        contact_method: 'email',
        email,
      })
    },

    trackMapClick() {
      this.trackGtagEvent('contact_map_click', {
        contact_method: 'map',
        location_name: 'Nigerian Law Publications House',
      })
    },
  },
}
</script>
