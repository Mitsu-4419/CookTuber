<template>
  <div class="cookVideoCard" v-if="cookVideoDetail">
    <router-link
      :to="{ name: 'video', query: { key:videoId  } }"
      style="text-decoration:none;color:black;"
    >
      <q-img id="ytplayer" :src="cookVideoDetail.thumbnail"></q-img>
      <div class="videoDetail" v-if="YoutubersChannel_info[cookVideoDetail.channelId]">
        <q-avatar size="md" style="margin-right:10px">
          <img :src="YoutubersChannel_info[cookVideoDetail.channelId].iconUrl" />
        </q-avatar>
        <div class="videoWrapper">
          <div class="videoTitle">{{ cookVideoDetail.videoTitle}}</div>
          <div class="videoChannel">{{ cookVideoDetail.channelTitle }}</div>
          <star-rating
            :read-only="true"
            v-model="starAverageNumber"
            :star-size="20"
            :increment="0.1"
            :padding="7"
            active-color="#ffd400"
            text-class="custom-Text"
          ></star-rating>
        </div>
      </div>
    </router-link>
  </div>
</template>


<script>
import { mapState } from "vuex";
export default {
  props: ["videoId", "cookVideoDetail"],
  data() {
    return {
      starAverageNumber: 0
    };
  },
  computed: {
    ...mapState("youtubers", ["YoutubersChannel_info"])
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
.ytp-large-play-button .ytp-button {
  display: none;
}
.videoDetail {
  width: 98%;
  overflow: hidden;
  display: flex;
  margin-top: 12px;
  padding-right: 8px;
}
.videoTitle {
  height: 45px;
}
.youTuberIcon {
  display: block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
}

@media screen and (min-width: 1736px) {
  /* card内の動画の設定 */
  .cookVideoChannelWrapper {
    margin-top: 3px;
    background: rgb(199, 198, 198);
    height: 30px;
    padding-bottom: 5px;
  }
  .cookVideoChannel {
    font-size: 11px;
  }
  .custom-Text {
    color: black;
    font-size: 15px;
    margin-bottom: 9px;
  }
  .vue-star-rating {
    margin-top: -1.5px;
    margin-right: 3px;
  }
}
@media screen and (min-width: 1600px) {
  .cookVideoCard {
    width: 24%;
    padding-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  #ytplayer {
    width: 100%;
    /* height: 145.278px; */
    margin-left: auto;
    margin-right: auto;
  }
  .videoTitle {
    font-size: 14px;
    color: #030303;
    font-weight: 500;
    font-family: Roboto, Arial, sans-serif;
    max-width: 190px;
    overflow: hidden;
  }
  .videoChannel {
    font-size: 12px;
    color: #606060;
    font-family: Roboto, Arial, sans-serif;
    max-width: 190px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
/* ビデオを横に４つ並べる範囲 */
@media screen and (min-width: 1410px) and (max-width: 1735px) {
  /* card内の動画の設定 */
  .cookVideoCard {
    width: 24%;
    padding-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .videoTitle {
    font-size: 14px;
    color: #030303;
    font-weight: 500;
    font-family: Roboto, Arial, sans-serif;
    max-width: 260px;
    overflow: hidden;
  }
  .videoChannel {
    font-size: 12px;
    color: #606060;
    font-family: Roboto, Arial, sans-serif;
    max-width: 240px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
@media screen and (min-width: 1025px) and (max-width: 1409px) {
  /* card内の動画の設定 */
  .cookVideoCard {
    width: 32%;
    padding-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .videoTitle {
    font-size: 14px;
    color: #030303;
    font-weight: 500;
    font-family: Roboto, Arial, sans-serif;
    max-width: 260px;
    overflow: hidden;
  }
  .videoChannel {
    font-size: 12px;
    color: #606060;
    font-family: Roboto, Arial, sans-serif;
    max-width: 240px;
    overflow: hidden;
  }
}
@media screen and (min-width: 1025px) and (max-width: 1129px) {
  .videoChannel,
  .videoTitle {
    max-width: 200px;
    overflow: hidden;
  }
}
@media screen and (min-width: 900px) and (max-width: 1024px) {
  .videoChannel,
  .videoTitle {
    max-width: 280px;
    overflow: hidden;
  }
  /* card内の動画の設定 */
  .cookVideoCard {
    width: 48%;
    padding-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
@media screen and (min-width: 750px) and (max-width: 899px) {
  .videoChannel,
  .videoTitle {
    max-width: 220px;
    overflow: hidden;
  }
  /* card内の動画の設定 */
  .cookVideoCard {
    width: 48%;
    padding-top: 10px;
    margin-top: 10px;
    margin-right: 3px;
    margin-left: 3px;
    margin-bottom: 10px;
  }
  #ytplayer {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 600px) and (max-width: 749px) {
  .videoChannel,
  .videoTitle {
    max-width: 210px;
    /* text-overflow: ellipsis;
    white-space: nowrap; */
    overflow: hidden;
  }
  /* card内の動画の設定 */
  .cookVideoCard {
    width: 48%;
    padding-top: 10px;
    margin-top: 10px;
    margin-right: 3px;
    margin-left: 3px;
    margin-bottom: 10px;
  }
  #ytplayer {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 500px) and (max-width: 599px) {
  .videoChannel,
  .videoTitle {
    max-width: 165px;
    /* text-overflow: ellipsis;
    white-space: nowrap; */
    overflow: hidden;
  }
  /* card内の動画の設定 */
  .cookVideoCard {
    width: 48%;
    padding-top: 10px;
    margin-top: 10px;
    margin-right: 3px;
    margin-left: 3px;
    margin-bottom: 10px;
  }
  #ytplayer {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  /* 星の大きさ */
  .vue-star-rating-star {
    width: 18px;
  }
}
/* スマホの設定 */
@media screen and (min-width: 350px) and (max-width: 499px) {
  .videoChannel,
  .videoTitle {
    font-size: 8px;
    max-width: 110px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  /* card内の動画の設定 */
  .cookVideoCard {
    width: 48%;
    padding-top: 8px;
    margin-top: 8px;
    margin-right: 3px;
    margin-left: 3px;
    margin-bottom: 8px;
  }
  #ytplayer {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  /* 星の大きさ */
  .vue-star-rating-star {
    width: 10px;
  }
}
</style>
