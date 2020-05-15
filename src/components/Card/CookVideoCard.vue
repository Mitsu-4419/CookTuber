<template>
  <div class="cookVideoCard" v-if="cookVideoDetail">
    <router-link
      :to="{ name: 'video', query: { key:videoId  } }"
      style="text-decoration:none;color:black;"
    >
      <q-img id="ytplayer" :src="cookVideoDetail.thumbnail"></q-img>
      <div class="videoDetail">
        <img
          class="youTuberIcon livePerson"
          :src="YoutubersChannel_info[cookVideoDetail.channelId].iconUrl"
        />
        <div class="videoWrapper">
          <div class="videoTitle">{{ cookVideoDetail.videoTitle}}</div>
          <div class="videoChannel">{{ cookVideoDetail.channelTitle }}</div>
          <star-rating
            :read-only="true"
            v-model="starAverageNumber"
            :star-size="14"
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
.youTuberIcon {
  display: block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
}
.videoTitle {
  font-size: 14px;
  color: #030303;
  font-weight: 500;
  font-family: Roboto, Arial, sans-serif;
  max-width: 190px;
  text-overflow: ellipsis; /* 幅を超えた部分を...にする */
  overflow: hidden;
}
.videoChannel {
  font-size: 14px;
  color: #606060;
  font-family: Roboto, Arial, sans-serif;
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
@media screen and (min-width: 1025px) and (max-width: 1265px) {
  .cookVideoCard {
    width: 24%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
  .videoChannel,
  .videoTitle {
    max-width: 160px;
  }
}
@media screen and (min-width: 900px) and (max-width: 1024px) {
  .cookVideoCard {
    width: 32%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
  .videoChannel,
  .videoTitle {
    max-width: 165px;
  }
}
@media screen and (min-width: 750px) and (max-width: 899px) {
  .cookVideoCard {
    width: 32%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
  .videoChannel,
  .videoTitle {
    max-width: 150px;
  }
}
@media screen and (min-width: 600px) and (max-width: 749px) {
  .cookVideoCard {
    width: 48%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
  .videoChannel,
  .videoTitle {
    max-width: 230px;
  }
}
@media screen and (min-width: 500px) and (max-width: 599px) {
  .cookVideoCard {
    width: 48%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
  .videoChannel,
  .videoTitle {
    max-width: 160px;
  }
}
/* スマホレイアウト */
@media screen and (min-width: 350px) and (max-width: 499px) {
  .cookVideoCard {
    width: 100%;
    margin-right: 7px;
    margin-bottom: 7px;
  }
  .videoTitle {
    max-width: 320px;
  }
  .videoChannel {
    max-width: 300px;
  }
}
/* 画像の大きさを微調整（400以下は不要） */
@media screen and (min-width: 400px) and (max-width: 499px) {
  #ytplayer {
    width: 385px;
  }
}
</style>
