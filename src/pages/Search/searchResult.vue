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
        placeholder="料理名・YouTuber・ユーザーを検索"
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
    <!-- 上段 -->
    <div class="indexWrapperSearch" v-if="Object.keys(searchAllVideo).length > 0">
      <div class="wrapperFront">
        <div class="wrapperTitle">
          <q-icon name="far fa-play-circle" size="sm" style="margin-right:5px;"></q-icon>
          <span class="wrapperSubTitle">料理動画一覧</span>
        </div>
      </div>
      <div class="row overflow-auto cookImageTopPageWrapper">
        <CookVideoCardTopPage
          v-for="(cookVideoDetail, key) in searchAllVideo"
          :key="key"
          :videoId="key"
          :cookVideoDetail="cookVideoDetail"
        />
      </div>
    </div>
    <!-- 中段 -->
    <div class="indexWrapperSearch" v-if="Object.keys(searchAllYoutubers).length > 0">
      <div class="wrapperFront">
        <div class="wrapperTitle">
          <q-icon name="fas fa-desktop" size="sm" style="margin-right:5px;"></q-icon>
          <span class="wrapperSubTitle">料理チャンネル</span>
        </div>
      </div>
      <div class="row overflow-auto cardWrapper">
        <CardYoutuber
          v-for="(channelInfo, key) in searchAllYoutubers"
          :key="key"
          :channelId="key"
          :channelInfo="channelInfo"
        />
      </div>
    </div>
    <!-- 下段 -->
    <div class="indexWrapperSearch" v-if="Object.keys(searchAllReviewer).length > 0">
      <div class="wrapperFront">
        <div class="wrapperTitle">
          <q-icon name="fas fa-user" size="sm" style="margin-right:5px;"></q-icon>
          <span class="wrapperSubTitle">Reviewer一覧</span>
        </div>
      </div>
      <div class="row overflow-auto cardWrapper">
        <ReviewerTotalPageCard
          :usersInfo="usersInfo"
          :uid="key"
          v-for="(usersInfo, key) in searchAllReviewer"
          :key="key"
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
    ...mapState("youtubers", ["search"]),
    ...mapGetters("videos", ["searchAllVideo"]),
    ...mapGetters("youtubers", ["searchAllYoutubers"]),
    ...mapGetters("usersPublic", ["searchAllReviewer"]),
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
    CookVideoCardTopPage: require("components/Card/CookVideoCard.vue").default,
    CardYoutuber: require("components/Card/CardYoutuber.vue").default,
    ReviewerTotalPageCard: require("components/Card/ReviewerTotalPageCard.vue")
      .default
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
.indexWrapperSearch {
  width: 100%;
  min-height: 200px;
  margin-top: 16px;
  margin-left: auto;
  margin-right: auto;
  border-block-start: 1px solid rgba(0, 0, 0, 0.12);
}
.wrapperTitle {
  font-size: 20px;
  font-weight: bold;
  margin-top: 8px;
  margin-bottom: 8px;
}
.wrapperSubTitle {
  margin-left: 4px;
}
/* 画面のサイズが1600以上の時は横にCard6枚並べる */
@media screen and (min-width: 1780px) {
  .cardWrapper {
    width: 1540px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 1565px) and (max-width: 1779px) {
  .cardWrapper {
    width: 1320px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard4枚並べる */
@media screen and (min-width: 1330px) and (max-width: 1564px) {
  .cardWrapper {
    width: 1100px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 1110px) and (max-width: 1329px) {
  .cardWrapper {
    width: 880px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 1025px) and (max-width: 1109px) {
  .cardWrapper {
    width: 660px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 900px) and (max-width: 1024px) {
  .cardWrapper {
    width: 880px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 900px) and (max-width: 1024px) {
  .cardWrapper {
    width: 880px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 680px) and (max-width: 899px) {
  .cardWrapper {
    width: 660px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 500px) and (max-width: 679px) {
  .cardWrapper {
    width: 440px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* ipnoheX,iphone6-8 */
@media screen and (min-width: 360px) and (max-width: 499px) {
  .my-card.q-card {
    width: 168px;
    margin-left: 8px;
    height: 264px;
  }
  .card_description {
    height: 50px;
  }
  .cardWrapper {
    width: 352px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
</style>