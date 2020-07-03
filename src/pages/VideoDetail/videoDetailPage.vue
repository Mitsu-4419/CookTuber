<template>
  <q-page padding>
    <div class="back_button row">
      <router-link v-if="from == 'genrePage'" to="/genreCookvideos">
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">料理動画一覧</span>
      </router-link>
      <router-link v-else-if="from == 'menuPage'" to="/menuCookvideos">
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">料理動画一覧</span>
      </router-link>
      <router-link v-else-if="from == 'materialPage'" to="/materialCookvideos">
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">料理動画一覧</span>
      </router-link>
      <router-link v-else-if="from == 'mypage'" :to="{ name: 'mypage', query: { id: pageUid } }">
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">マイページへ</span>
      </router-link>
      <router-link v-else-if="from == 'topPage'" to="/">
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">トップページへ</span>
      </router-link>
    </div>
    <!-- ーーーーーーーーーーー -->
    <!-- ページ上部のプロフィール載せる欄 -->
    <!-- ーーーーーーーーーーー -->
    <div class="card-holder">
      <div class="row cookDetailPageVideoTitleWrapper">
        <q-avatar
          size="60px;"
          style="margin-right:5px;margin-top:auto;margin-bottom:auto;"
          class="avatorLarge"
        >
          <img :src="YoutubersChannel_info[cookVideos[key].channelId].iconUrl" style="width:100%" />
        </q-avatar>
        <q-avatar
          size="lg"
          style="margin-right:5px;margin-top:auto;margin-bottom:auto;"
          class="avatorMedium"
        >
          <img :src="YoutubersChannel_info[cookVideos[key].channelId].iconUrl" style="width:100%" />
        </q-avatar>
        <q-avatar
          size="md"
          style="margin-right:5px;margin-top:auto;margin-bottom:auto;"
          class="avatorSmall"
        >
          <img :src="YoutubersChannel_info[cookVideos[key].channelId].iconUrl" style="width:100%" />
        </q-avatar>
        <div class="videoTitleAndName column">
          <div>
            <q-icon
              name="fas fa-utensils"
              size="1.4em"
              :class="cooked == true ? 'cookActive' : 'cookNonActive'"
              style="z-index:100;cursor:pointer"
              @click.prevent="ShowReviewMakeModal()"
            >
              <q-tooltip>お気に入りに登録しますか？</q-tooltip>
            </q-icon>
            <span class="favoriteNum">{{ cookVideos[key].registerCount }}</span>
          </div>
          <div class="StarWrapperVideoDetailPage">
            <star-rating
              :read-only="true"
              :rating="cookVideos[key].AverageStar"
              :star-size="20"
              :increment="0.1"
              :padding="6"
              active-color="#ffd400"
              text-class="custom-Text"
            ></star-rating>
          </div>
        </div>
      </div>
      <div class="CookVideoWrapperUpper">
        <q-video id="ytplayer" type="text/html" :src="videoURL" frameborder="0" :ratio="16 / 9"></q-video>
      </div>
    </div>
    <div
      style="margin-top:10px;margin-left:auto;margin-right:auto;width:100%;display:flex;justify-content:center;"
    >
      <div class="CookVideoWrapperDownLeft">
        <div class="receipeWrapper shadow-3">
          <q-scroll-area class="price-buy-detailMaterial" v-if="cookVideos[key].materials">
            <q-list dense bordered padding class="recepieDetailWrapper">
              <div v-for="item in Object.keys(cookVideos[key].materials)" :key="item">
                <span style="font-weight:bold;margin-left:5px">{{ item }}</span>
                <div v-for="(volume, key) in cookVideos[key].materials[item]" :key="key">
                  <q-item clickable v-ripple>
                    <q-checkbox
                      class="materialcheck"
                      keep-color
                      color="grey-5"
                      v-model="val"
                      size="xs"
                    />
                    <q-item-section class="materialItem">
                      {{
                      key
                      }}
                    </q-item-section>
                    <q-item-section class="materialItem">
                      {{
                      volume
                      }}
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </q-list>
          </q-scroll-area>
          <q-scroll-area class="noDetail column" v-else>
            <div class="no-detail-icon">
              <q-icon name="fas fa-wrench" size="xl"></q-icon>
            </div>
            <span class="nodetail-title">Now working ......</span>
          </q-scroll-area>
        </div>
      </div>
      <div class="CookVideoWrapperDownRight">
        <div class="CookVideoDetail shadow-3">
          <q-scroll-area class="price-buy-detail" v-if="cookVideos[key].videoSummary">
            <q-list dense padding class="rounded-borders">
              <div v-for="(howto, key) in cookVideos[key].videoSummary" :key="key">
                <q-item v-ripple>
                  <q-item-section
                    style="z-index:100;cursor:pointer;color:blue"
                    @click.prevent="changeURL(Number(key))"
                    class="howtoLeft"
                  >
                    {{ Math.floor(Number(key) / 60) }}:{{
                    Number(key) % 60
                    }}
                  </q-item-section>
                  <q-item-section class="howtoRight">
                    {{
                    howto
                    }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-scroll-area>
          <q-scroll-area class="noDetail column" v-else>
            <div class="no-detail-icon">
              <q-icon name="fas fa-wrench" size="xl"></q-icon>
            </div>
            <span class="nodetail-title">Now working ......</span>
          </q-scroll-area>
        </div>
      </div>
    </div>
    <!-- --------------------- -->
    <!-- ページの下段のところ -->
    <!-- --------------------- -->
    <!-- ユーザーのレビューを載せる欄 -->
    <div class="userContentsWrapperLarge row">
      <div class="userReview_wrapper">
        <div class="review_title_wrapper">
          <span>ファンからのオススメ</span>
        </div>
        <q-separator style="height:3px;margin-top:10px;margin-bottom:13px;" />
        <q-scroll-area class="userRecommendVideoScroll">
          <router-link
            :to="{ name: 'mypage', query: { id: userkey, from:'videoDetail', videoId:key } }"
            v-for="(review, userkey) in userReviews"
            :key="userkey"
            class="routerDec"
          >
            <userReviewList :id="key" :review="review" />
          </router-link>
        </q-scroll-area>
      </div>
      <div class="userRecommendVideoWrapper">
        <div class="otherRecommendedVideos">
          <span>その他のおすすめ動画</span>
        </div>
        <q-scroll-area class="userRecommendVideoScroll">
          <CookRecommendVideo
            v-for="videoId in getReviewersFavoriteVideos(
              key
            )"
            :key="videoId"
            :videoId="videoId"
            :cookVideoDetail="cookVideos[videoId]"
          />
        </q-scroll-area>
      </div>
    </div>
    <!-- 画面が1000px以下の時のレイアウト -->
    <div class="userContentsWrapperSmall column">
      <div class="userReview_wrapper">
        <div class="review_title_wrapper">
          <span>ファンからのオススメ</span>
        </div>
        <q-separator style="height:3px;margin-top:10px;margin-bottom:13px;" />
        <router-link
          :to="{ name: 'mypage', query: { id: userkey, from:'videoDetail', videoId:key } }"
          v-for="(review, userkey) in userReviews"
          :key="userkey"
          class="routerDec"
        >
          <userReviewList :id="key" :review="review" />
        </router-link>
      </div>
      <div class="userRecommendVideoWrapper">
        <div class="otherRecommendedVideos">
          <span>その他のおすすめ動画</span>
        </div>
        <q-scroll-area class="userRecommendVideoScroll">
          <CookRecommendVideo
            v-for="videoId in getReviewersFavoriteVideos(
              key
            )"
            :key="videoId"
            :videoId="videoId"
            :cookVideoDetail="cookVideos[videoId]"
          />
        </q-scroll-area>
      </div>
    </div>

    <!-- ユーザー登録をする様に促すDialog -->
    <q-dialog v-model="alertToSignUp">
      <ToLoginAlert />
    </q-dialog>
    <!-- 料理を作ったのか、これからつくるかのModal -->
    <q-dialog v-model="cookedOrWillCook" persistent>
      <CookedOrWillCook @setMadeOrNot="SetMadeOrNot" />
    </q-dialog>
    <!-- レビューをかく促すDialog -->
    <q-dialog v-model="reviewSubmit">
      <registerReviewFromCard
        :videoId="key"
        :channelId="cookVideos[key].channelId"
        @closeRegiModal="reviewMaded"
      />
    </q-dialog>
  </q-page>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { SessionStorage } from "quasar";
import { firestoreDb } from "src/boot/firebase";
import Vue from "vue";
import { getParam } from "src/functions/getParam";

export default {
  data() {
    return {
      key: "",
      alertToSignUp: false,
      writeReview: false,
      confirmReview: false,
      cookedOrWillCook: false,
      reviewSubmit: false,
      cooked: false,
      userReviews: {},
      documentId: "",
      teal: false,
      val: false,
      Seconds: 0,
      videoURL: "",
      reviewUserUidArray: [],
      from: "",
      pageUid: ""
    };
  },
  computed: {
    ...mapState("usersPublic", ["usersPublicInfo"]),
    ...mapState("videos", ["cookVideos"]),
    ...mapGetters("videos", ["getReviewersFavoriteVideos"]),
    ...mapGetters("usersPublic", ["getYoutuberReview"]),
    ...mapState("auth", ["userId", "loggedIn"]),
    ...mapState("youtubers", ["YoutubersChannel_info"]),
    ...mapState("timeTag", ["timeTag"]),
    ...mapState("genreTag", ["genreTag"])
  },
  methods: {
    ...mapActions("usersPublic", ["addFavoriteVTRFromCard"]),
    async getUserReviews() {
      const videoId = getParam("key");
      let obj = this.getYoutuberReview(videoId);
      Object.keys(obj).forEach(documentId => {
        if (obj[documentId].cooked == true) {
          const uid = obj[documentId].uid;
          let payload = {
            uid: uid,
            review: obj[documentId].review,
            nickName: this.usersPublicInfo[uid].nickName,
            photoURL: this.usersPublicInfo[uid].photoURL,
            createdAt: this.usersPublicInfo[uid].createdAt,
            LikeArray: obj[documentId].LikeArray,
            star_number: this.usersPublicInfo[uid].favoriteVTRObj[documentId]
              .star_number,
            docId: documentId
          };
          this.reviewUserUidArray.push(uid);
          Vue.set(this.userReviews, uid, payload);
        }
      });
    },
    switchFav() {
      if (this.loggedIn == false) {
        // ログインしていなかったらユーザー登録する様にDialogをだす
        this.alertToSignUp = true;
      } else if (this.loggedIn == true && this.ratingModel == false) {
        // this.writeReview = true;
      } else if (this.loggedIn == true && this.ratingModel == true) {
        console.log("nothing");
      }
    },
    ShowReviewMakeModal() {
      if (!this.loggedIn) {
        // ログインしていなかったらユーザー登録する様にDialogをだす
        this.alertToSignUp = true;
      } else if (this.loggedIn && this.cooked == false) {
        this.cookedOrWillCook = true;
      }
    },
    // レビューを書くのか、ただブックマークするのかのチェック
    SetMadeOrNot(value) {
      this.SETMadeOrNot = value;
      this.cookedOrWillCook = false;
      if (value == true) {
        this.reviewSubmit = true;
      } else {
        this.addFavoriteVTRFromCard({
          uid: this.userId,
          review: "",
          favoriteVTRvideoID: this.key,
          selectedTags: [],
          star_number: 0,
          channelId: this.cookVideos[this.key].channelId,
          cooked: false
        });
      }
    },
    changeURL(value) {
      this.videoURL =
        "https://www.youtube.com/embed/" +
        this.key +
        "?start=" +
        value +
        "&autoplay=1";
    },
    reviewMaded() {
      this.reviewSubmit = false;
      this.cooked = true;
    }
  },
  components: {
    ToLoginAlert: require("components/AlertModal/ToLoginAlert.vue").default,
    userReviewList: require("components/Lists/userReviewList.vue").default,
    CookedOrWillCook: require("components/CookCheckModal/CookedOrWillCook.vue")
      .default,
    registerReviewFromCard: require("components/RegisterReviewModal/registerReviewFromCard.vue")
      .default,
    CookRecommendVideo: require("components/Card/CookRecommendVideo.vue")
      .default
  },
  mounted() {
    this.getUserReviews();
    // this.checkIfFavorite();
    if (this.cookVideos[this.key].materials) {
      this.materialNameArray = Object.keys(this.cookVideos[this.key].materials);
    }
  },
  created() {
    this.key = getParam("key");
    this.from = getParam("from");
    this.pageUid = getParam("pageUid");
    this.videoURL = "https://www.youtube.com/embed/" + getParam("key");
    const userInfo = this.usersPublicInfo;
    const userFavObj = userInfo[this.userId].favoriteVTRObj;
    let array = [];
    Object.keys(userFavObj).forEach(key => {
      array.push(userFavObj[key].videoId);
    });
    if (array.includes(this.key)) {
      this.cooked = true;
    }
  },
  watch: {
    $route(to, from) {
      this.key = getParam("key");
      this.videoURL = "https://www.youtube.com/embed/" + getParam("key");
      const userInfo = this.usersPublicInfo;
      const userFavObj = userInfo[this.userId].favoriteVTRObj;
      let array = [];
      Object.keys(userFavObj).forEach(key => {
        array.push(userFavObj[key].videoId);
      });
      if (array.includes(this.key)) {
        this.cooked = true;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.back_button {
  height: 50px;
  display: flex;
  align-items: center;
  width: 80%;
  /* margin: 0 auto; */
}
.back_button a {
  text-decoration: none;
}
/* 画面全体 */
.card-holder {
  margin-right: auto;
  margin-left: auto;
  margin-top: -20px;
}
/* ページの下段の左側 */
.CookVideoWrapperDownLeft {
  width: 49%;
  height: 470px;
  background-color: rgb(255, 224, 224);
}
.CookVideoWrapperDownRight {
  width: 49%;
  height: 470px;
  background-color: rgb(235, 242, 252);
}
.cookDetailPageVideoTitle {
  font-size: 15px;
  font-weight: bold;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.CookVideoDetail {
  padding: 10px;
  background: white;
  width: 96%;
  margin-right: auto;
  margin-left: auto;
  margin-top: 10px;
  height: 450px;
  .q-item {
    height: 55px;
  }
  .howtoLeft {
    width: 50px;
    height: 25px;
    flex: none;
  }
  .howtoRight {
    width: 269px;
    height: 25px;
    flex: none;
  }
}
.receipeWrapper {
  width: 96%;
  margin-right: auto;
  margin-left: auto;
  margin-top: 10px;
  height: 450px;
  padding: 5px;
  background: white;
  z-index: 100;
  overflow: scroll;
  color: #111111;
  .q-item__section--main {
    width: 138px;
    height: 25px;
    flex: none;
  }
}
.cookDetailPageVideoTitleWrapper {
  padding: 5px;
  width: 100%;
  margin-top: 10px;
}
.StarWrapperVideoDetailPage {
  margin-top: 1px;
  display: flex;
  justify-content: start;
  /* margin-left: 80px; */
  /* background: rgb(147, 143, 143); */
}

.price-buy-detail {
  width: 100%;
  height: 100%;
  font-size: 15px;
  color: rgb(89, 87, 87);
}
.price-buy-detailMaterial {
  width: 100%;
  height: 100%;
  font-size: 15px;
  margin: 5px;
  color: rgb(89, 87, 87);
}
.noDetail {
  width: 100%;
  height: 100%;
  background: rgba(84, 84, 84, 0.153);
  text-align: center;
}
.no-detail-icon {
  width: 50px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 150px;
}
.nodetail-title {
  font-size: 20px;
  margin-top: 15px;
}
/* 表示する動画or画像 */
.card-img {
  max-width: 330px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
}
.q-video {
  margin-left: 16px;
}
.q-img {
  min-width: 340px;
  width: 40%;
  height: 340px;
  padding-top: 40px;
  margin-left: 16px;
}
/* お気に入り星の数表示 */
.favoriteNum {
  font-size: 15px;
  font-weight: bold;
  margin-left: 10px;
  margin-top: 0px;
}
// ---------------------------
/* ユーザーレビューカードのところ */
// ---------------------------
.userContentsWrapperLarge {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  margin-top: 50px;
  margin-bottom: 50px;
}
.userRecommendVideoWrapper {
  width: 40%;
  min-height: 300px;
  padding: 5px;
}
.userRecommendVideoScroll {
  width: 100%;
  height: 330px;
}
.review_title_wrapper {
  font-size: 19px;
}
.userReview_wrapper {
  width: 60%;
}
.cookActive {
  color: #fea545;
}
.cookNonActive {
  color: #5d5e61;
}
.routerDec {
  text-decoration: none;
  color: black;
}
#ytplayer {
  width: 100%;
  margin: auto;
  min-width: 200px;
  max-width: 945px;
}
.videoTitleAndName {
  width: 85%;
  display: flex;
  margin-top: 16px;
  margin-bottom: 2px;
  margin-left: 10px;
}
.recepieDetailWrapper {
  border: 0px;
}
.materialItem {
  width: 150px;
}
.materialcheck {
  height: 25px;
}
.otherRecommendedVideos {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 15px;
}
// 画面サイズ1000pxを境に下のユーザーレビューのところのレイアウトを変更する
@media screen and (min-width: 1000px) {
  .userContentsWrapperSmall {
    display: none;
  }
}
@media screen and (max-width: 999px) {
  .userContentsWrapperLarge {
    display: none;
  }
  .userReview_wrapper {
    width: 95%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
  .userRecommendVideoWrapper {
    width: 95%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 30px;
  }
}
@media screen and (min-width: 500px) and (max-width: 699px) {
  .price-buy-detail {
    width: 100%;
    height: 100%;
    font-size: 13px;
    color: rgb(89, 87, 87);
  }
  .price-buy-detailMaterial {
    width: 100%;
    height: 100%;
    font-size: 13px;
    margin: 5px;
    color: rgb(89, 87, 87);
  }
  .q-item {
    padding-left: 0px;
  }
  .CookVideoDetail {
    .q-item {
      height: 30px;
    }
  }
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
}
@media screen and (min-width: 600px) and (max-width: 769px) {
  .card-wrapper {
    padding-top: 0px;
    margin-right: 24px;
  }
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
    width: 250px;
    height: 320px;
  }
  .text-body1 {
    overflow-wrap: break-word;
  }
  .review_title_wrapper {
    margin-left: 8px;
  }
}
@media screen and (min-width: 500px) and (max-width: 599px) {
  .card-wrapper {
    padding-top: 0px;
    margin-top: 16px;
    margin-right: 0px;
  }
  .review_title_wrapper {
    margin-left: 8px;
  }
}
@media screen and (min-width: 300px) and (max-width: 499px) {
  .card-wrapper {
    padding-top: 0px;
    margin-right: 0px;
    margin-top: 16px;
  }
  .cardDetailWrapper {
    height: 320px;
    margin: 16px;
  }
  .card-wrapper {
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
  .price-buy-detailMaterial {
    width: 100%;
    height: 100%;
    font-size: 12px;
    margin: 5px;
    color: rgb(89, 87, 87);
  }
  .price-buy-detail {
    width: 100%;
    height: 100%;
    font-size: 12px;
    color: rgb(89, 87, 87);
  }
  .q-item {
    min-height: 41px;
  }
  .CookVideoDetail {
    padding: 10px;
    background: white;
    width: 96%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 10px;
    height: 450px;
    .q-item {
      height: 45px;
      padding-left: 4px;
    }
    .howtoLeft {
      width: 30px;
      height: 25px;
      flex: none;
    }
    .howtoRight {
      width: 269px;
      height: 25px;
      flex: none;
    }
  }
}
@media screen and (min-width: 300px) and (max-width: 413px) {
  .CookVideoDetail {
    padding: 10px;
    background: white;
    width: 96%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 10px;
    height: 450px;
    .q-item {
      height: 55px;
      padding-left: 4px;
    }
    .howtoLeft {
      width: 30px;
      height: 25px;
      flex: none;
    }
    .howtoRight {
      height: 25px;
      flex: none;
    }
  }
}
@media screen and (min-width: 949px) {
  .avatorMedium {
    display: none;
  }
  .avatorSmall {
    display: none;
  }
}
@media screen and (min-width: 500px) and (max-width: 948px) {
  .avatorLarge {
    display: none;
  }
  .avatorSmall {
    display: none;
  }
  .videoTitleAndName {
    width: 78%;
  }
}
@media screen and (min-width: 300px) and (max-width: 499px) {
  .avatorMedium {
    display: none;
  }
  .avatorLarge {
    display: none;
  }
}
</style>
