<template>
  <div class="cookVideoCard" v-if="cookVideoDetail">
    <router-link
      :to="{ name: 'video', query: { key: cookVideoDetail.videoId, from: from } }"
      style="text-decoration:none;color:black;"
    >
      <q-img v-if="rankInfo == 1" class="rankIcon" src="statics/rankIcon/crown_gold.png"></q-img>
      <q-img v-else-if="rankInfo == 2" class="rankIcon" src="statics/rankIcon/crown_silver.png"></q-img>
      <q-img v-else-if="rankInfo == 3" class="rankIcon" src="statics/rankIcon/crown_copper.png"></q-img>
      <q-img id="ytplayer" :src="cookVideoDetail.thumbnail" :ratio="16 / 9"></q-img>
      <div class="videoDetail">
        <q-avatar
          size="md"
          style="margin-right:10px"
          v-if="YoutubersChannel_info[cookVideoDetail.channelId]"
        >
          <img :src="YoutubersChannel_info[cookVideoDetail.channelId].iconUrl" />
        </q-avatar>
        <div class="videoWrapper">
          <div class="videoTitleCookPage2">{{ cookVideoDetail.videoTitle }}</div>
          <div class="videoChannel">{{ cookVideoDetail.channelTitle }}</div>
          <div class="starRatingLarge">
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
          <div class="starRatingSmall">
            <star-rating
              :read-only="true"
              v-model="starAverageNumber"
              :star-size="13"
              :increment="0.1"
              :padding="4"
              active-color="#ffd400"
              text-class="custom-TextSmall"
            ></star-rating>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["cookVideoDetail", "id", "from"],
  data() {
    return {
      starAverageNumber: 0,
      rankInfo: this.id + 1
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
};
</script>

<style>
.rankIcon {
  width: 38px;
  height: 38px;
  margin-left: 3px;
  margin-top: -45px;
  z-index: 10;
  position: absolute;
}
.videoDetail {
  width: 98%;
  overflow: hidden;
  display: flex;
  margin-top: 12px;
  padding-right: 8px;
}
.videoTitleCookPage2 {
  height: 45px;
  padding: 0;
  font-weight: bold;
}
#ytplayer {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
.videoTitleCookPage2 {
  font-size: 14px;
  color: #030303;
  font-weight: 600;
  font-family: Roboto, Arial, sans-serif;
  max-width: 190px;
  overflow: hidden;
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
}
@media screen and (min-width: 1600px) {
  #ytplayer {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
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
  .videoTitleCookPage2 {
    max-width: 200px;
    overflow: hidden;
  }
}
@media screen and (min-width: 900px) and (max-width: 1024px) {
  .videoChannel,
  .videoTitleCookPage2 {
    max-width: 280px;
    overflow: hidden;
  }
}
@media screen and (min-width: 750px) and (max-width: 899px) {
  .videoChannel,
  .videoTitleCookPage2 {
    max-width: 220px;
    overflow: hidden;
  }
}
@media screen and (min-width: 600px) and (max-width: 749px) {
  .videoChannel,
  .videoTitleCookPage2 {
    max-width: 210px;
    /* text-overflow: ellipsis;
    white-space: nowrap; */
    overflow: hidden;
  }
}
@media screen and (min-width: 500px) and (max-width: 599px) {
  .videoChannel,
  .videoTitleCookPage2 {
    max-width: 165px;
    /* text-overflow: ellipsis;
    white-space: nowrap; */
    overflow: hidden;
  }
}

@media screen and (min-width: 500px) {
  .starRatingSmall {
    display: none;
  }
}

/* スマホの設定 */
@media screen and (min-width: 300px) and (max-width: 499px) {
  .videoChannel,
  .videoTitleCookPage2 {
    font-size: 8px;
    max-width: 110px;
    height: 25px;
    /* text-overflow: ellipsis;
    white-space: nowrap; */
    overflow: hidden;
  }
  .starRatingLarge {
    display: none;
  }
  .starRatingSmall {
    margin-top: -8px;
  }
  .rankIcon {
    width: 25px;
    height: 25px;
    margin-left: 3px;
    margin-top: -25px;
    z-index: 10;
    position: absolute;
  }
  .custom-TextSmall {
    color: black;
    font-size: 12px;
    margin-bottom: 9px;
  }
}
@media screen and (min-width: 1670px) {
  .cookVideoCard {
    width: 19%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
}
@media screen and (min-width: 1288px) and (max-width: 1669px) {
  .cookVideoCard {
    width: 24%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
}
@media screen and (min-width: 880px) and (max-width: 1287px) {
  .cookVideoCard {
    width: 32%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
}
@media screen and (min-width: 414px) and (max-width: 879px) {
  .cookVideoCard {
    width: 48%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
}
@media screen and (min-width: 300px) and (max-width: 413px) {
  .cookVideoCard {
    width: 48%;
    margin-right: 4px;
    margin-bottom: 4px;
  }
}
</style>
