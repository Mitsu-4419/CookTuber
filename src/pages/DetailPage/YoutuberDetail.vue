<template>
  <q-page padding>
    <div class="back_button row">
      <router-link v-if="from == 'youtuberPage'" to="/youtubers">
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">YouTuber 一覧</span>
      </router-link>
      <router-link v-else-if="from == 'topPage'" to="/">
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">トップページへ</span>
      </router-link>
      <router-link
        v-else-if="from == 'videoDetail'"
        :to="{ name: 'video', query: { key: VDID, from: 'menuPage' } }"
      >
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">動画詳細ページへ</span>
      </router-link>
    </div>
    <!-- ーーーーーーーーーーー -->
    <!-- ページ上部のプロフィール載せる欄 -->
    <!-- ーーーーーーーーーーー -->
    <div class="row YoutuberDetailcard-holder">
      <div class="YoutuberDetailcard-wrapperLEFT">
        <div class="YoutuberDetailcard-imgWrapper">
          <q-img class="YoutuberDetailcard-img" :src="YoutubersChannel_info[key].iconUrl"></q-img>
        </div>
        <div class="YoutuberDetail-reviewNumberWrapper">
          <span style="font-size:15px;margin-top:4px;">レビュー投稿数</span>
          <span
            style="font-size:20px;font-weight:bold;margin-left:10px"
          >{{ YoutubersChannel_info[key].reviewCount }}</span>
        </div>
        <div class="YoutuberDetail-starWrapperLarge">
          <star-rating
            :read-only="true"
            v-model="starYoutuberDetail"
            :star-size="35"
            :increment="0.1"
            :padding="8"
            active-color="#ffd400"
            text-class="custom-Text"
          ></star-rating>
        </div>
        <div class="YoutuberDetail-starWrapperSmall">
          <star-rating
            :read-only="true"
            v-model="starYoutuberDetail"
            :star-size="25"
            :increment="0.1"
            :padding="8"
            active-color="#ffd400"
            text-class="custom-Text"
          ></star-rating>
        </div>
      </div>
      <div class="YoutuberDetailcard-wrapperRIGHT">
        <div class="row">
          <div class="YoutuberDetail-name">{{ YoutubersChannel_info[key].name }}</div>
        </div>
        <div class="q-mt-lg">
          <q-scroll-area style="height: 250px; max-width: 450px;">
            <div class="text-body1 text-grey-7">{{ YoutubersChannel_info[key].description }}</div>
          </q-scroll-area>
        </div>
        <div class="infoWrapper">
          <!-- チャンネル登録日 -->
          <div class="registerDateWrapper">
            <span>チャンネル登録日：</span>
            <span class="text-bold">
              {{
              YoutubersChannel_info[key].register_date
              }}
            </span>
          </div>
          <!-- 現時点でのチャンネル登録者数 -->
          <div class="subscriberCountsWrapper">
            <span>現チャンネル登録者数：</span>
            <span class="text-bold">
              {{
              YoutubersChannel_info[key].subscriberCounts
              }}
            </span>
          </div>
          <!-- Twitterアカウント -->
          <div class="iconsWrapper" v-if="YoutubersChannel_info[key].twitterId">
            <a v-bind:href="YoutubersChannel_info[key].twitterId" target="_blank">
              <img src="../../statics/socialIcons/twitter.png" width="40px" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="YoutubeDetail_popularVideowrapper">
      <div class="review_title_wrapper row">
        <span>人気の料理動画</span>
        <q-select
          class="YoutuberDetailSelect"
          dense
          rounded
          outlined
          v-model="model"
          :options="options"
          bg-color="white"
          color="grey-5"
        />
      </div>
      <q-separator style="height:3px;margin-top:10px;margin-bottom:13px;" />
      <div class="YoutuberDetailpopularVideoWrapper">
        <transition-group
          appear
          enter-active-class="animated fadeInLeft"
          class="row YoutuberDetailpopularVideoWrapper"
        >
          <CookVideoCard
            v-for="(cookVideoDetail, id) in cookVideoYoutuberSort(key, model)"
            :key="id"
            :videoId="id"
            :cookVideoDetail="cookVideoDetail"
            from="YoutuberDetail"
          />
        </transition-group>
      </div>
    </div>

    <!-- ユーザー登録をする様に促すDialog -->
    <q-dialog v-model="alertToSignUp">
      <ToLoginAlert />
    </q-dialog>
  </q-page>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { SessionStorage } from "quasar";
import { firestoreDb } from "src/boot/firebase";
import Vue from "vue";
export default {
  data() {
    return {
      key: "",
      from: "",
      VDID: "",
      alertToSignUp: false,
      writeReview: false,
      confirmReview: false,
      ratingModel: 0,
      ratingColors: ["yellow-12"],
      userReviews: {},
      documentId: "",
      starYoutuberDetail: 0,
      model: "星の数順",
      options: ["星の数順", "再生回数順", "レビュー数多い順", "投稿日が最近順"],
    };
  },
  computed: {
    ...mapState("youtubers", ["YoutubersChannel_info"]),
    ...mapState("auth", ["loggedIn", "userId"]),
    ...mapState("usersPublic", ["usersPublicInfo"]),
    ...mapGetters("videos", ["cookVideoYoutuberSort"]),
  },
  methods: {
    getParam(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    switchFav() {
      if (this.loggedIn == false) {
        // ログインしていなかったらユーザー登録する様にDialogをだす
        this.alertToSignUp = true;
      } else if (this.loggedIn == true && this.ratingModel == 0) {
        this.writeReview = true;
      } else if (this.loggedIn == true && this.ratingModel == 1) {
        console.log("nothing");
      }
    },
  },
  components: {
    ToLoginAlert: require("components/Modals/ToLoginAlert.vue").default,
    CookVideoCard: require("components/Card/CookVideoCard.vue").default,
  },
  mounted() {},
  created() {
    this.key = this.getParam("key");
    this.from = this.getParam("from");
    this.VDID = this.getParam("VDID");
    this.starYoutuberDetail = this.YoutubersChannel_info[this.key].averageStar;
  },
};
</script>
<style scoped>
/* 戻るボタン */
.back_button {
  height: 24px;
  display: flex;
  align-items: center;
  width: 80%;
  margin-top: 20px;
}
.back_button a {
  text-decoration: none;
}
/* 画面全体 */
.YoutuberDetailcard-holder {
  margin: 60px auto 25px auto;
  justify-content: center;
}
.YoutuberDetailcard-wrapperLEFT {
  min-width: 350px;
  width: 40%;
  /* margin-right: 48px;
  padding-top: 40px; */
}
.YoutuberDetail-starWrapperLarge {
  display: flex;
  justify-content: center;
  /* background-color: rgb(164, 163, 163); */
  width: 87%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
}
.card-LiveVTR-wrapper {
  width: 90%;
}
/* 表示する動画or画像 */

.YoutuberDetailcard-imgWrapper {
  max-width: 330px;
  width: 98%;
  margin-left: auto;
  margin-right: auto;
  padding-right: 30px;
  display: flex;
  justify-content: center;
}
.YoutuberDetailcard-wrapperRIGHT {
  min-width: 340px;
  width: 46%;
  height: 340px;

  padding: 8px;
  justify-content: center;
}
.YoutuberDetailcard-img {
  border-radius: 20px;
  margin-top: 15px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.YoutuberDetail-name {
  font-size: 18px;
  font-weight: bold;
}

.YoutuberDetail-reviewNumberWrapper {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

/* お気に入り星の数表示 */
.favoriteNum {
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
  margin-top: 3px;
}
/* 右側のDetailのランの文字 */
.infoWrapper {
  margin-top: 16px;
}
.registerDateWrapper {
  font-size: 17px;
}
.subscriberCountsWrapper {
  font-size: 17px;
}
.iconsWrapper {
  margin-top: 8px;
}

/* ユーザーレビューカードのところ */
.review_title_wrapper {
  font-size: 19px;
}
.YoutubeDetail_popularVideowrapper {
  width: 96%;
  margin-right: auto;
  margin-left: auto;
  margin-top: 70px;
}
.YoutuberDetailpopularVideoWrapper {
  width: 96%;
  margin-right: auto;
  margin-left: auto;
}
.starActive {
  color: yellow;
  margin-left: 10px;
}
.starNonActive {
  color: rgb(254, 254, 191);
  margin-left: 10px;
}
.YoutuberDetailSelect {
  width: 180px;
  margin-left: 15px;
  margin-top: -8px;
}

@media screen and (min-width: 770px) and (max-width: 820px) {
  .q-layout-padding {
    padding: 8px;
    margin-bottom: 8px;
  }
  .q-img {
    padding-top: 0px;
    height: 300px;
  }
  .q-video {
    margin-top: 50px;
  }
  .cardDetailWrapper {
    height: 320px;
  }
  .text-body1 {
    overflow-wrap: break-word;
  }

  .iconsWrapper {
    margin-top: 8px;
  }
}
@media screen and (min-width: 500px) {
  .YoutuberDetail-starWrapperSmall {
    display: none;
  }
}
@media screen and (min-width: 300px) and (max-width: 499px) {
  .YoutuberDetail-starWrapperSmall {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}

@media screen and (min-width: 500px) and (max-width: 769px) {
  .q-layout-padding {
    padding: 8px;
    margin-bottom: 8px;
  }
  .q-img {
    padding-top: 0px;
    height: 300px;
  }
  .q-video {
    margin-top: 50px;
  }
  .card-wrapper {
    min-width: 300px;
  }
  .cardDetailWrapper {
    width: 250px;
    height: 320px;
  }
  .text-body1 {
    overflow-wrap: break-word;
  }
  .iconsWrapper {
    margin-top: 8px;
  }
}

@media screen and (min-width: 320px) and (max-width: 499px) {
  .cardDetailWrapper {
    height: 320px;
    margin: 24px;
    padding: 16px;
  }
  .card-holder {
    margin: 0px;
  }
  .card-wrapper {
    margin: 0px;
    padding-top: 0px;
  }
  /* #ytplayer {
    max-width: 100%;
  } */
  .q-video {
    width: 100%;
    margin: 0px;
  }
  .card-img {
    max-width: 100%;
  }
  .q-img {
    width: 100%;
    height: 340px;
    margin: 0px;
    padding-top: 0px;
  }
  .q-layout-padding {
    padding: 0px;
  }
  .q-mt-lg {
    margin-top: 0px;
    margin-bottom: 8px;
  }
  .text-body1 {
    overflow-wrap: break-word;
  }
  .YoutuberDetail-starWrapperLarge {
    display: none;
  }
}
</style>
