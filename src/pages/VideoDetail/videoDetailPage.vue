<template>
  <q-page padding>
    <div class="back_button row">
      <router-link to="/cookvideos">
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">料理動画一覧</span>
      </router-link>
    </div>
    <!-- ーーーーーーーーーーー -->
    <!-- ページ上部のプロフィール載せる欄 -->
    <!-- ーーーーーーーーーーー -->
    <div class="row card-holder">
      <!-- ページの左側 -->
      <div class="CookVideoWrapperLeft">
        <q-video
          id="ytplayer"
          type="text/html"
          :src="
            'https://www.youtube.com/embed/' +
             key
          "
          frameborder="0"
        ></q-video>
        <div class="row q-mt-md">
          <div class="cookDetailPageVideoTitle">{{ cookVideos[key].videoTitle }}</div>
        </div>
        <div class="row q-mt-sm">
          <q-space></q-space>
          <div style="font-size:16px;">{{cookVideos[key].channelTitle }}</div>
        </div>
        <div class="StarWrapperVideoDetailPage">
          <star-rating
            :read-only="true"
            v-model="starPoint"
            :star-size="30"
            :increment="0.1"
            :padding="12"
            active-color="yellow"
            text-class="custom-Text"
          ></star-rating>
        </div>
      </div>
      <!-- ページの右側 -->
      <div class="CookVideoWrapperRight" v-if="cookVideos[key]">
        <div class="row" style="margin-top:60px;" @click.prevent="ShowReviewMakeModal()">
          <q-icon
            name="fas fa-utensils"
            size="2.1em"
            :class="cooked == true ? 'cookActive' : 'cookNonActive'"
          />
          <span class="favoriteNum">{{cookVideos[key].registerCount }}</span>
        </div>
        <div class="tagsWrapperVideoDetailPage">
          <q-chip
            size="14px"
            v-for="(tag,tagName) in cookVideos[key].tagMap"
            :key="tag"
          >{{allTags[tagName].tagName}}</q-chip>
        </div>
        <div class="q-mt-lg">
          <q-scroll-area class="price-buy-detail">
            <div>{{ cookVideos[key].videoDescription }}</div>
          </q-scroll-area>
        </div>
      </div>
    </div>

    <!-- ユーザーのレビューを載せる欄 -->
    <div class="userReview_wrapper">
      <div class="review_title_wrapper">
        <span>ファンからのオススメ</span>
      </div>
      <q-separator style="height:3px;margin-top:10px;margin-bottom:13px;" />
      <div class>
        <q-scroll-area horizontal style="width:95%;height:300px;">
          <div class="row no-wrap">
            <userReviewCard
              :review="review"
              :id="key"
              v-for="(review, key) in userReviews"
              :key="key"
            />
          </div>
          <div class="msgLayout">{{msg}}</div>
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
      <registerReviewFromCard :videoId="key" :channelId="cookVideos[key].channelId" />
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
      starPoint: 0,
      userReviews: {},
      documentId: "",
      msg: ""
    };
  },
  computed: {
    ...mapState("usersPublic", ["usersPublicInfo"]),
    ...mapState("tags", ["allTags"]),
    ...mapState("videos", ["cookVideos"]),
    ...mapGetters("usersPublic", ["getYoutuberReview"]),
    ...mapState("auth", ["userId", "loggedIn"])
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
      console.log("hoge");
      if (!this.loggedIn) {
        // ログインしていなかったらユーザー登録する様にDialogをだす
        this.alertToSignUp = true;
      } else {
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
    }
    // setYoutuberKey(value) {
    //   SessionStorage.set("YoutuberKey", value);
    // },
    // ユーザーがこのYoutuberを登録しているかどうかのチェック
    // checkIfFavorite() {
    //   if (this.loggedIn == false) {
    //     this.ratingModel = 1;
    //   } else if (this.loggedIn == true) {
    //     const p = this.getParam("key");
    //     let object = this.usersPublicInfo[this.userId].favoriteYoutuberObj;
    //     // let object = Object.values(this.userInfo)[0].favoriteYoutuberObj;
    //     let array = [];
    //     for (let j = 0; j < Object.values(object).length; j++) {
    //       array.push(Object.values(object)[j].channelId);
    //     }
    //     if (array.includes(p)) {
    //       this.ratingModel = 1;
    //     } else {
    //       this.ratingModel = 0;
    //     }
    //   } else {
    //     console.log("何らかのエラーが発生しました。");
    //   }
    // },
    // checkWritedReview() {
    //   let getReview = this.getYoutuberReview(this.key);
    //   let userReview;
    //   if (this.loggedIn) {
    //     if (!Object.keys(getReview).length) {
    //       this.msg = "まだ誰もお気に入り登録をしていません。";
    //     } else {
    //       Object.keys(getReview).forEach(key => {
    //         if (getReview[key].uid == this.usersPublicInfo[this.userId].id) {
    //           userReview = getReview[key].review;
    //           // DocumentId をStateに入れる
    //           this.documentId = key;
    //         }
    //       });
    //     }
    //   }
    // },
    // closeReviewSubmi() {
    //   (this.writeReview = false), (this.ratingModel = 0);
    // },
    // addstar() {
    //   this.ratingModal = 1;
    // }
  },
  components: {
    ToLoginAlert: require("components/AlertModal/ToLoginAlert.vue").default,
    userReviewCard: require("components/Card/userReviewCard.vue").default,
    CookedOrWillCook: require("components/CookCheckModal/CookedOrWillCook.vue")
      .default,
    registerReviewFromCard: require("components/RegisterReviewModal/registerReviewFromCard.vue")
      .default
  },
  mounted() {
    this.getUserReviews();
    // this.checkIfFavorite();
  },
  created() {
    this.key = getParam("key");
    if (this.cookVideos[this.key]) {
      this.starPoint = this.cookVideos[this.key].starPoint;
      // this.checkWritedReview();
    }
  }
};
</script>
<style scoped>
.back_button {
  height: 24px;
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
  margin: 16px auto;
  justify-content: center;
}
.CookVideoWrapperLeft {
  min-width: 350px;
  width: 48%;
  margin-right: 48px;
}
.cookDetailPageVideoTitle {
  font-size: 16px;
  font-weight: bold;
}
.StarWrapperVideoDetailPage {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  background: rgb(147, 143, 143);
}
.tagsWrapperVideoDetailPage {
  padding: 4px;
  margin-top: 15px;
}
.CookVideoWrapperRight {
  width: 46%;
}
.card-LiveVTR-wrapper {
  width: 90%;
}
.price-buy-detail {
  width: 100%;
  height: 300px;
  font-size: 15px;
  color: rgb(89, 87, 87);
}
/* .price-buy-detail {
  height: 400px;
} */
/* 表示する動画or画像 */
#ytplayer {
  min-width: 200px;
}
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
/* .cardDetailWrapper {
  min-width: 340px;
  width: 40%;
  height: 340px;
  margin: 8px;
  padding: 8px;
  justify-content: center;
} */
/* お気に入り星の数表示 */
.favoriteNum {
  font-size: 21px;
  font-weight: bold;
  margin-left: 10px;
  margin-top: 1px;
}
/* 右側のDetailのランの文字 */
.infoWrapper {
  margin-top: 16px;
}
/* ユーザーレビューカードのところ */
.review_title_wrapper {
  font-size: 19px;
}
.userReview_wrapper {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  margin-top: 70px;
}
.detailReviewCardWrapper {
  width: 96%;
  height: 250px;
  /* overflow-x: auto;
  white-space: nowrap; */
}
/* .userReviewCardWrapper {
  overflow: scroll;
} */
.cookActive {
  color: #babdc2;
}
.cookNonActive {
  color: #5d5e61;
}
/* レビューない時のメッセージのレイアウト */
.msgLayout {
  margin-top: 8px;
}
@media screen and (min-width: 821px) {
  #ytplayer {
    width: 100%;
    height: 315.25px;
    margin: auto;
    margin-top: 70px;
  }
  .userReview_wrapper {
    width: 95%;
  }
  /* .q-card {
    width: 360px;
    height: 256px;
  } */
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

  #ytplayer {
    width: 366px;
    height: 253px;
    margin-left: auto;
    margin-right: auto;
  }
  .userReview_wrapper {
    width: 750px;
  }
  /* .q-card {
    width: 336px;
    height: 256px;
  } */
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
  #ytplayer {
    width: 366px;
    height: 253px;
    margin-left: auto;
    margin-right: auto;
  }
  .review_title_wrapper {
    margin-left: 8px;
  }
  .userReview_wrapper {
    width: 600px;
  }
  /* .q-card {
    width: 100%;
    height: 256px;
  } */
  /* レビューない時のメッセージのレイアウト */
  .msgLayout {
    margin-left: 8px;
  }
}
@media screen and (min-width: 500px) and (max-width: 599px) {
  .card-wrapper {
    padding-top: 0px;
    margin-top: 16px;
    margin-right: 0px;
  }
  #ytplayer {
    width: 366px;
    height: 253px;
    margin-left: auto;
    margin-right: auto;
  }
  .card-holder {
    margin-right: 32px;
  }
  .review_title_wrapper {
    margin-left: 8px;
  }
  .userReview_wrapper {
    width: 500px;
  }
  /* .q-card {
    width: 100%;
    height: 234px;
    margin-right: 16px;
  } */
  /* レビューない時のメッセージのレイアウト */
  .msgLayout {
    margin-left: 8px;
  }
}
@media screen and (min-width: 400px) and (max-width: 499px) {
  .card-wrapper {
    padding-top: 0px;
    margin-right: 0px;
    margin-top: 16px;
  }
  #ytplayer {
    max-width: 100%;
    height: 279px;
  }
  .back_button {
    display: none;
  }
  .cardDetailWrapper {
    height: 320px;
    margin: 16px;
  }
  /* .card-holder {
    margin: 0px;
  } */
  .card-wrapper {
    margin: 0px;
    padding-top: 0px;
  }
  .q-video {
    margin: 0px;
  }
  .card-img {
    max-width: 100%;
  }
  .q-img {
    width: 75%;
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
  .userReview_wrapper {
    width: 410px;
    margin-left: 8px;
  }
  /* .q-card {
    width: 100%;
    height: 224px;
    margin-left: 16px;
  } */
  /* レビューない時のメッセージのレイアウト */
  .msgLayout {
    margin-bottom: 24px;
    margin-left: 8px;
  }
}
@media screen and (min-width: 300px) and (max-width: 399px) {
  .card-wrapper {
    padding-top: 0px;
    margin-right: 0px;
  }
  #ytplayer {
    max-width: 100%;
    height: 258px;
  }
  .back_button {
    display: none;
  }
  .card-holder {
    margin: 0px;
  }
  .card-img {
    max-width: 100%;
  }
  .q-img {
    width: 75%;
    height: 340px;
    margin-left: 4px;
    padding-top: 0px;
  }
  .userReview_wrapper {
    width: 375px;
    margin-left: 8px;
  }
  /* レビューない時のメッセージのレイアウト */
  .msgLayout {
    margin-bottom: 24px;
    margin-left: 8px;
  }
}
</style>