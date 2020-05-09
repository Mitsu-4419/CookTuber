<template>
  <q-page padding>
    <div class="back_button row">
      <router-link to="/youtubers">
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">YouTuber 一覧</span>
      </router-link>
    </div>
    <!-- ーーーーーーーーーーー -->
    <!-- ページ上部のプロフィール載せる欄 -->
    <!-- ーーーーーーーーーーー -->
    <div class="row card-holder">
      <div class="card-wrapper">
        <q-video
          id="ytplayer"
          type="text/html"
          :src="
            'https://www.youtube.com/embed/' +
             key
          "
          frameborder="0"
        ></q-video>
        <div class="row q-mt-lg">
          <q-icon name="perm_identity" size="md" class="q-mr-sm" />
          <div class="text-h6 tex-bold">{{cookVideos[key].channelTitle }}</div>
        </div>
        <div class="row q-mt-lg">
          <q-icon name="play_circle_outline" size="md" class="q-mr-sm" />
          <div class="text-h6 tex-bold">{{ cookVideos[key].videoTitle }}</div>
        </div>
        <div class="StarWrapper">
          <star-rating
            :read-only="true"
            v-model="starPoint"
            :star-size="21"
            :increment="0.1"
            :padding="12"
            active-color="yellow"
            text-class="custom-Text"
          ></star-rating>
        </div>
        <div class="tagsWrapper">
          <q-chip
            size="sm"
            v-for="(tag,tagName) in cookVideos[key].tagMap"
            :key="tag"
          >{{allTags[tagName].tagName}}</q-chip>
        </div>
      </div>

      <div class="cardDetailWrapper" v-if="cookVideos[key]">
        <div class="row" @click.prevent="switchFav()">
          <q-icon
            name="fas fa-utensils"
            size="1.9em"
            :class="cooked == true ? 'cookActive' : 'cookNonActive'"
          />
          <span class="favoriteNum">{{cookVideos[key].registerCount }}</span>
        </div>
        <div class="price-buy-detail q-mt-lg">
          <q-scroll-area style="height: 180px; max-width: 400px;">
            <div class="text-body1 text-grey-7">{{ cookVideos[key].videoDescription }}</div>
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
    <!-- レビュー投稿モーダル -->
    <!-- <q-dialog v-model="writeReview">
      <reviewSubmit
        @closeReviewSubmit="closeReviewSubmi"
        @addstar="addstar"
        :channelInfo="YoutubersChannel_info[key]"
      />
    </q-dialog>-->
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
      alertToSignUp: false,
      writeReview: false,
      confirmReview: false,
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
  },
  methods: {
    // URLのパラメーターからChannelIdを取る関数
    getParam(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    async getUserReviews() {
      const videoId = this.getParam("key");
      let obj = this.getYoutuberReview(videoId);
      console.log(obj);
      Object.keys(obj).forEach(documentId => {
        const uid = obj[documentId].uid;
        let payload = {
          uid: uid,
          review: obj[documentId].review,
          nickName: this.usersPublicInfo[uid].nickName,
          photoURL: this.usersPublicInfo[uid].photoURL,
          createdAt: this.usersPublicInfo[uid].createdAt,
          LikeArray: obj[documentId].LikeArray,
          docId: documentId
        };
        Vue.set(this.userReviews, uid, payload);
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
    ToLoginAlert: require("components/Card/ToLoginAlert.vue").default,
    // reviewSubmit: require("components/ReviewCard/reviewSubmit.vue").default,
    userReviewCard: require("components/Card/userReviewCard.vue").default
  },
  mounted() {
    this.getUserReviews();
    // this.checkIfFavorite();
  },
  created() {
    this.key = this.getParam("key");
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
.card-wrapper {
  min-width: 350px;
  width: 40%;
  margin-right: 48px;
}
.card-LiveVTR-wrapper {
  width: 90%;
}
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
.cardDetailWrapper {
  min-width: 340px;
  width: 40%;
  height: 340px;
  margin: 8px;
  padding: 8px;
  justify-content: center;
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
/* ユーザーレビューカードのところ */
.review_title_wrapper {
  font-size: 19px;
}
.userReview_wrapper {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  margin-top: 90px;
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
    width: 90%;
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