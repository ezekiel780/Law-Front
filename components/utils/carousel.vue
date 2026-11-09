<template>
  <div class="mx-4">
    <VueSlickCarousel v-bind="settings">
      <slot />

      <template #prevArrow="arrowOption">
        <div class="custom-arrow">
          <!-- {{ arrowOption.currentSlide }}/{{ arrowOption.slideCount }} -->
          <utils-svg-loader
            icon="previous"
            class="cursor-pointer"
            color="#DDC524"
          />
        </div>
      </template>

      <template #nextArrow="arrowOption">
        <div class="custom-arrow">
          <!-- {{ arrowOption.currentSlide }}/{{ arrowOption.slideCount }} -->
          <utils-svg-loader
            icon="next"
            class="cursor-pointer"
            color="#DDC524"
          />
        </div>
      </template>
    </VueSlickCarousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      settings: {
        arrows: true,
        autoplay: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      },
    }
  },
}
</script>
