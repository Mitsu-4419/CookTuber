<template>
  <q-page padding>
    <!-- 検索バー -->
    <div v-if="key == 'webPage'" class="fromWebPageTitle">
      <span style="margin-left:18px;">検索結果一覧</span>
    </div>
    <div class="searchBarInMobile" v-else>
      <q-input
        rounded
        outlined
        placeholder="料理チャンネル名を検索"
        v-model="searchField"
        bottom-slots
        :rules="[
                  val =>
                    val.length >= 3 ||
                    val.length == 0 ||
                    '３文字以上入力してください'
                ]"
      >
        <template v-slot:append>
          <q-icon name="close" @click="searchField = ''" class="cursor-pointer deleteicon" />
          <!-- <q-icon name="search" /> -->
        </template>
      </q-input>
    </div>
    <div class="indexLiveNowWrapperSearch" v-if="Object.keys(searchAllYoutubers).length > 0">
      <div class="liveFront">
        <div class="liveNowTitle">
          <q-icon name="fas fa-circle" color="orange" class="q-mr-sm"></q-icon>
          <span>料理チャンネル</span>
        </div>
      </div>
      <div class="row overflow-auto YouTuberCardWrapper">
        <CardYoutuber
          v-for="(channelInfo, key) in searchAllYoutubers"
          :key="key"
          :channelId="key"
          :channelInfo="channelInfo"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      key: ""
    };
  },
  computed: {
    ...mapState("youtubers", ["search", "YoutubersChannel_info"]),
    ...mapGetters("youtubers", ["searchAllYoutubers"]),
    searchField: {
      get() {
        return this.search;
      },
      set(value) {
        this.setSearch(value);
      }
    }
  },
  methods: {
    ...mapActions("youtubers", ["setSearch"])
  },
  components: {
    CardYoutuber: require("components/Card/CardYoutuber.vue").default
  },
  created() {
    this.key = this.$route.query.key;
  }
};
</script>
<style>
.fromWebPageTitle {
  font-size: 26px;
  margin-top: 10px;
  font-weight: bold;
  color: #443f5f;
}
.searchBarInMobile {
  margin-top: 20px;
  width: 90%;
  margin-right: auto;
  margin-left: auto;
}
.indexLiveNowWrapperSearch {
  width: 100%;
  min-height: 200px;
  margin-top: 16px;
  margin-left: auto;
  margin-right: auto;
  border-block-start: 1px solid rgba(0, 0, 0, 0.12);
}
/* 画面のサイズが1600以上の時は横にCard6枚並べる */
@media screen and (min-width: 1780px) {
  .YouTuberCardWrapper {
    width: 1540px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 1565px) and (max-width: 1779px) {
  .YouTuberCardWrapper {
    width: 1320px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard4枚並べる */
@media screen and (min-width: 1330px) and (max-width: 1564px) {
  .YouTuberCardWrapper {
    width: 1100px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 1110px) and (max-width: 1329px) {
  .YouTuberCardWrapper {
    width: 880px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 1025px) and (max-width: 1109px) {
  .YouTuberCardWrapper {
    width: 660px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 900px) and (max-width: 1024px) {
  .YouTuberCardWrapper {
    width: 880px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 900px) and (max-width: 1024px) {
  .YouTuberCardWrapper {
    width: 880px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 680px) and (max-width: 899px) {
  .YouTuberCardWrapper {
    width: 660px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 500px) and (max-width: 679px) {
  .YouTuberCardWrapper {
    width: 440px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* ipnoheX,iphone6-8 */
@media screen and (min-width: 360px) and (max-width: 499px) {
  .genreTabs {
    display: none;
  }
  .genreTabsMobile {
    margin-top: 20px;
    width: 330px;
    height: 30px;
    margin-left: auto;
    margin-right: auto;
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
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
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
@media screen and (min-width: 500px) {
  .genreTabsMobile {
    display: none;
  }
}
</style>