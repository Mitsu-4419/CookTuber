<template>
  <q-page padding>
    <div class="column">
      <!-- ソートのSelect　登録者が多い順or登録者が少ない順 -->
      <div class="row PageYoutubers-topContainer">
        <div class="videoTitleCookPage row">
          <q-icon
            name="live_tv"
            color="grey-14"
            size="md"
            class="q-mr-md q-ml-sm"
          ></q-icon>
          <div class="cookVideoTitleYoutuber">料理チャンネル一覧</div>
        </div>
        <q-select
          outlined
          v-model="model"
          :options="options"
          dense
          color="black"
          class="youtuberSelectBox"
        />
      </div>
      <div class="row YouTuberCardWrapper widthAdjust" name="youtubers">
        <transition-group
          appear
          enter-active-class="animated fadeInLeft"
          class="row"
        >
          <YoutuberCard
            :channelInfo="channelInfo"
            v-for="(channelInfo, key) in getSortedYoutubers(model)"
            :id="key"
            :key="key"
          />
        </transition-group>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { SessionStorage, Quasar, QDialog, ClosePopup } from "quasar";
import Vue from "vue";
export default {
  data() {
    return {
      model: "高評価が多い順",
      options: [
        "高評価が多い順",
        "登録者数が多い順",
        "登録者数が少ない順",
        "レビュー数が多い順"
      ]
    };
  },
  computed: {
    // ...mapState("youtubers", ["YoutubersChannel_info"]),
    ...mapGetters("youtubers", ["getSortedYoutubers"])
  },
  methods: {
    ...mapActions("youtubers", ["setSearch"]),
    getPageNum() {
      const pageTotal = Math.ceil(
        Object.keys(this.YoutubersChannel_info).length / 50
      );
      return pageTotal;
    },
    setSelectedTab(genre) {
      this.tab = genre;
      this.othersmodal = false;
    }
  },
  components: {
    YoutuberCard: require("components/Card/CardYoutuber.vue").default
  }
};
</script>

<style>
.PageYoutubers-topContainer {
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
.YouTuberCardWrapper {
  margin-right: auto;
  margin-left: auto;
  margin-top: 40px;
}
.cookVideoTitleYoutuber {
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
}
/* 画面のサイズが1600以上の時は横にCard6枚並べる */
@media screen and (min-width: 1780px) {
  .YouTuberCardWrapper {
    width: 1490px;
  }
}
@media screen and (min-width: 1485px) and (max-width: 1779px) {
  .YouTuberCardWrapper {
    width: 1270px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard4枚並べる */
@media screen and (min-width: 1266px) and (max-width: 1484px) {
  .YouTuberCardWrapper {
    width: 1050px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 1053px) and (max-width: 1265px) {
  .YouTuberCardWrapper {
    width: 840px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 847px) and (max-width: 1052px) {
  .YouTuberCardWrapper {
    width: 630px;
  }
}
@media screen and (min-width: 769px) and (max-width: 846px) {
  .YouTuberCardWrapper {
    width: 420px;
  }
}
@media screen and (min-width: 680px) and (max-width: 768px) {
  .YouTuberCardWrapper {
    width: 630px;
  }
}
@media screen and (min-width: 500px) and (max-width: 679px) {
  .YouTuberCardWrapper {
    width: 440px;
  }
}

/* ipnoheX,iphone6-8 */
@media screen and (min-width: 360px) and (max-width: 499px) {
  .GenreTabsMobile {
    margin-top: 20px;
    width: 310px;
    height: 30px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
  }
  .genreTabs {
    display: none;
  }

  .my-card.q-card {
    width: 168px;
    margin-left: 8px;
    height: 264px;
  }
  .card_description {
    height: 50px;
  }
  .YouTuberCardWrapper {
    width: 352px;
  }
  .genreTabs {
    margin-top: 20px;
    width: 250px;
    margin-left: auto;
    margin-right: auto;
  }
  .youtuberSortTab {
    font-size: 10px;
    padding: 13px;
  }
  .allLiveWaitTabs {
    width: 280px;
    margin-right: auto;
    margin-left: auto;
  }
  .gameImgMobile {
    width: 20px;
    height: 12px;
  }
}
@media screen and (min-width: 300px) and (max-width: 499px) {
  .PageYoutubers-topContainer {
    margin-top: 5px;
  }
  .YouTuberCardWrapper {
    margin-top: 5px;
  }
  .youtuberSelectBox {
    margin-left: 200px;
  }
}
</style>
