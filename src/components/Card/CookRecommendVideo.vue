<template>
  <router-link
    :to="{ name: 'video', query: { key: videoId } }"
    style="text-decoration:none;color:black;"
  >
    <div class="RecommendVideoCardTotalWrapper">
      <div class="cookVideoCardRecommend" v-if="cookVideoDetail">
        <q-img
          id="ytplayerRecommend"
          :src="cookVideoDetail.thumbnail"
          :ratio="16 / 9"
        ></q-img>
      </div>
      <div class="videoWrapperRecommend column">
        <div style="margin-top:auto;margin-bottom:auto;">
          <div class="videoTitleCookPage2Recommend">
            {{ cookVideoDetail.videoTitle }}
          </div>
          <div class="videoChannelRecommend">
            {{ cookVideoDetail.channelTitle }}
          </div>
          <star-rating
            :read-only="true"
            v-model="starAverageNumber"
            :star-size="11"
            :increment="0.1"
            :padding="7"
            :show-rating="false"
            active-color="#ffd400"
            text-class="custom-Text"
          ></star-rating>
        </div>
      </div>
    </div>
  </router-link>
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
};
</script>

<style>
.ytp-large-play-button .ytp-button {
  display: none;
}
.RecommendVideoCardTotalWrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 3px;
}
.videoWrapperRecommend {
  width: 30%;
  overflow: hidden;
  padding: 3px;
}
.videoTitleCookPage2Recommend {
  font-size: 12px;
  color: #030303;
  font-weight: 500;
  font-family: Roboto, Arial, sans-serif;
  max-width: 190px;
  max-height: 38px;
  overflow: hidden;
}
.youTuberIcon {
  display: block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
}
#ytplayerRecommend {
  width: 95%;
  max-width: 300px;
  /* height: 145.278px; */
  margin: auto;
}
.cookVideoCardRecommend {
  width: 70%;
  display: flex;
  justify-content: center;
}
.videoChannelRecommend {
  font-size: 12px;
  color: #606060;
  font-family: Roboto, Arial, sans-serif;
  max-width: 190px;
  max-height: 50px;
  text-overflow: ellipsis;
  white-space: nowrap;
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
@media screen and (max-width: 999px) {
  .cookVideoCardRecommend {
    width: 40%;
    display: flex;
    justify-content: center;
  }
  .videoWrapperRecommend {
    width: 60%;
    overflow: hidden;
    padding: 3px;
  }
  .videoTitleCookPage2Recommend {
    font-size: 13px;
    color: #030303;
    font-weight: 500;
    font-family: Roboto, Arial, sans-serif;
    max-width: 100%;
    overflow: hidden;
  }
  .videoChannelRecommend {
    font-size: 13px;
    color: #606060;
    font-family: Roboto, Arial, sans-serif;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
@media screen and (min-width: 500px) and (max-width: 599px) {
}
/* スマホの設定 */
@media screen and (min-width: 350px) and (max-width: 499px) {
}
</style>
