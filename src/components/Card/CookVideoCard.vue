<template>
  <div class="cookVideoCard" v-if="cookVideoDetail">
    <router-link
      :to="{ name: 'show', query: { key:cookVideoDetail.channelId  } }"
      style="text-decoration:none;color:black;"
    >
      <div class="cookVideoThumbnailWrapper">
        <q-img id="cookVideoThumbnail" :src="cookVideoDetail.thumbnail"></q-img>
      </div>
      <div class="videoWrapper">
        <div class="cookVideotitle">{{ cookVideoDetail.videoTitle }}</div>
        <div class="row cookVideoChannelWrapper">
          <q-space></q-space>
          <!-- <div class="cookVideoCshannel">{{cookVideoDetail.channelTitle}}</div> -->
          <star-rating
            :read-only="true"
            v-model="starAverageNumber"
            :star-size="20"
            :increment="0.1"
            :padding="7"
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
  //   components: {
  //     LiveVideoCard: require("components/VideoCard/LiveVideoCard.vue").default
  //   }
};
</script>

<style>
.cookVideoThumbnailWrapper {
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
.cookVideoChannelWrapper {
  margin-top: 8px;
}
.cookVideoChannel {
  font-size: 11px;
}
.custom-Text {
  color: black;
  font-size: 15px;
  margin-bottom: 9px;
}

@media screen and (min-width: 1600px) {
  .cookVideoCard {
    width: 19%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
}
@media screen and (min-width: 1025px) and (max-width: 1599px) {
  .cookVideoCard {
    width: 24%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
}
</style>
