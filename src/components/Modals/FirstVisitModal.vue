<template>
  <div class="bg-white q-gutter-md">
    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      control-color="grey"
      height="330"
      arrows
      class="bg-white text-blackrounded-borders firstVisitCarousal"
    >
      <q-carousel-slide
        name="style"
        class="column no-wrap flex-center text-center"
        style="width:500px;"
      >
        <span class="carousal-1-text">
          お気に入りの料理Youtube動画を
          <br />ブックマークできます
        </span>
        <q-img src="statics/introMovie/CookTuber-intro1.gif"></q-img>
      </q-carousel-slide>
      <q-carousel-slide
        name="tv"
        class="column no-wrap flex-center text-center"
        style="width:500px;"
      >
        <span class="carousal-1-text">
          ジャンル、メニュー、材料で検索できます！
          <br />他の人の動画もブックマークできます！
        </span>
        <q-img src="statics/introMovie/CookTuber-intro2.gif"></q-img>
      </q-carousel-slide>
    </q-carousel>
    <div class="row q-pa-sm">
      <q-space></q-space>
      <q-btn style="background-color:#ff9933;color:white;" label="Close" @click="closeModal" />
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      slide: "style",
      lorem:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.",
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeIntro");
    },
  },
};
</script>

<style scoped>
.q-carousel__slide {
  width: 328px;
}
.firstVisitCarousal {
  height: 330px;
}
.carousal-1-text {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 10px;
}
@media screen and (min-width: 300px) and (max-width: 499px) {
  .q-carousel__slide {
    width: 328px !important;
  }
  .firstVisitCarousal {
    height: 280px;
  }
  .carousal-1-text {
    font-size: 15px;
  }
}
</style>