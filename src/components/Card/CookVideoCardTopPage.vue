<template>
  <div class="cookVideoCardTopPage" v-if="cookVideoDetail">
    <router-link
      :to="{ name: 'video', query: { key:videoId  } }"
      style="text-decoration:none;color:black;"
    >
      <q-img
        v-if="cookVideoDetail.rankInfo == 1"
        class="rankIcon"
        src="statics/rankIcon/crown_gold.png"
      ></q-img>
      <q-img
        v-else-if="cookVideoDetail.rankInfo == 2"
        class="rankIcon"
        src="statics/rankIcon/crown_silver.png"
      ></q-img>
      <q-img
        v-else-if="cookVideoDetail.rankInfo == 3"
        class="rankIcon"
        src="statics/rankIcon/crown_copper.png"
      ></q-img>
      <div class="cookVideoThumbnailWrapperTopPage">
        <q-img id="cookVideoThumbnail" :src="cookVideoDetail.thumbnail"></q-img>
      </div>
      <div class="videoWrapper">
        <div class="cookVideotitle">{{ cookVideoDetail.videoTitle }}</div>
        <div class="row cookVideoChannelWrapperTopPage">
          <q-space></q-space>
          <!-- <div class="cookVideoCshannel">{{cookVideoDetail.channelTitle}}</div> -->
          <star-rating
            :read-only="true"
            v-model="starAverageNumber"
            :star-size="15"
            :increment="0.1"
            :padding="5"
            active-color="yellow"
            text-class="custom-Text"
          ></star-rating>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ["videoId", "cookVideoDetail"],
  data() {
    return {
      starAverageNumber: 0
    };
  },
  created() {
    if (this.cookVideoDetail) {
      this.starAverageNumber =
        Number(this.cookVideoDetail.starPoint) /
        Number(this.cookVideoDetail.registerCount);
    }
  }
};
</script>

<style>
.rankIcon {
  width: 45px;
  height: 45px;
  margin-left: 3px;
  margin-bottom: -10px;
  z-index: 10;
  position: absolute;
}
.cookVideoCardTopPage {
  width: 24%;
  max-width: 250px;
  margin-right: 7px;
  margin-bottom: 7px;
}
.cookVideoThumbnailWrapperTopPage {
  width: 100%;
  display: flex;
  justify-self: center;
}
#cookVideoThumbnail {
  width: 98%;
  /* height: 145.278px; */
  margin-left: auto;
  margin-right: auto;
}
.videoWrapper {
  padding: 8px;
}
.cookVideotitle {
  font-size: 12px;
  height: 38px;
  overflow: hidden;
}
.cookVideoChannelWrapperTopPage {
  margin-top: 1px;
}
.cookVideoChannel {
  font-size: 11px;
}
.custom-Text {
  color: black;
  font-size: 15px;
  margin-bottom: 9px;
}

/* @media screen and (min-width: 1600px) {
  .cookVideoCardTopPage {
    width: 19%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
}
@media screen and (min-width: 1025px) and (max-width: 1599px) {
  .cookVideoCardTopPage {
    width: 24%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
}
@media screen and (min-width: 700px) and (max-width: 1024px) {
  .cookVideoCardTopPage {
    width: 32%;
    margin-right: 7px;
    margin-bottom: 7px;
  } */
/* } */
</style>
