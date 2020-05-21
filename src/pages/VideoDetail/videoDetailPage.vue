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
    <div class="card-holder">
      <!-- ページの左側 -->
      <div class="CookVideoWrapperUpper">
        <q-video
          id="ytplayer"
          type="text/html"
          :src="
            'https://www.youtube.com/embed/' +
             key
          "
          frameborder="0"
        ></q-video>
      </div>
    </div>
    <div class="row" style="margin-top:20px;">
      <div class="CookVideoWrapperDownLeft">
        <div class="row cookDetailPageVideoTitleWrapper">
          <q-avatar size="60px" style="margin-right:5px;">
            <img :src="YoutubersChannel_info[cookVideos[key].channelId].iconUrl" />
          </q-avatar>
          <q-space></q-space>
          <div class="column" style=" width: 85%;">
            <div class="row">
              <div class="cookDetailPageVideoTitle">{{ cookVideos[key].videoTitle }}</div>
            </div>
            <div class="row q-mt-sm">
              <div style="font-size:18px;">{{cookVideos[key].channelTitle }}</div>
            </div>
          </div>
        </div>
        <div class="StarWrapperVideoDetailPage">
          <star-rating
            :read-only="true"
            v-model="starPoint"
            :star-size="30"
            :increment="0.1"
            :padding="12"
            active-color="#ffd400"
            text-class="custom-Text"
          ></star-rating>
        </div>
        <div class="tagsWrapperVideoDetailPage" v-if="Object.keys(cookVideos[key].tagMap).length>0">
          <q-chip
            size="14px"
            v-for="(tag,tagName) in cookVideos[key].tagMap"
            :key="tagName"
          >{{allTags[tagName].tagName}}</q-chip>
        </div>
        <div class="row" style="width:100%;margin-right:auto;margin-left:auto;margin-top:13px;">
          <q-icon
            name="fas fa-utensils"
            size="2.1em"
            :class="cooked == true ? 'cookActive' : 'cookNonActive'"
            style="margin-left:70px;z-index:100;cursor:pointer"
            @click.prevent="ShowReviewMakeModal()"
          />
          <span class="favoriteNum">{{cookVideos[key].registerCount }}</span>
        </div>
      </div>
      <div class="CookVideoWrapperDownRight">
        <div class="CookVideoDetail">
          <q-scroll-area class="price-buy-detail">
            <div>{{ cookVideos[key].videoDescription }}</div>
          </q-scroll-area>
        </div>
      </div>
    </div>
    <!-- --------------------- -->
    <!-- ページの下段のところ -->
    <!-- --------------------- -->
    <!-- ユーザーのレビューを載せる欄 -->
    <div class="userReview_wrapper">
      <div class="review_title_wrapper">
        <span>ファンからのオススメ</span>
      </div>
      <q-separator style="height:3px;margin-top:10px;margin-bottom:13px;" />
      <router-link
        :to="{ name: 'mypage', query: { id: key } }"
        v-for="(review, key) in userReviews"
        :key="key"
        class="routerDec"
      >
        <userReviewList :id="key" :review="review" />
      </router-link>
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
      documentId: ""
    };
  },
  computed: {
    ...mapState("usersPublic", ["usersPublicInfo"]),
    ...mapState("tags", ["allTags"]),
    ...mapState("videos", ["cookVideos"]),
    ...mapGetters("usersPublic", ["getYoutuberReview"]),
    ...mapState("auth", ["userId", "loggedIn"]),
    ...mapState("youtubers", ["YoutubersChannel_info"])
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
    // userReviewCard: require("components/Card/userReviewCard.vue").default,
    userReviewList: require("components/Lists/userReviewList.vue").default,
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
  margin-right: auto;
  margin-left: auto;
  margin-top: -20px;
  /* background: red; */
}
/* ページの下段の左側 */
.CookVideoWrapperDownLeft {
  width: 50%;
  /* background: green; */
}
.CookVideoWrapperDownRight {
  width: 48%;
  height: 300px;
  /* background: orange; */
}
.cookDetailPageVideoTitle {
  font-size: 18px;
  font-weight: bold;
  height: 50px;
  overflow: hidden;
}
.CookVideoDetail {
  padding: 10px;
}
.cookDetailPageVideoTitleWrapper {
  padding: 5px;
}
.StarWrapperVideoDetailPage {
  margin-top: 15px;
  display: flex;
  justify-content: start;
  margin-left: 80px;
  /* background: rgb(147, 143, 143); */
}
.tagsWrapperVideoDetailPage {
  padding: 4px;
  margin-top: 15px;
  margin-left: 80px;
}
.CookVideoWrapperRight {
  width: 46%;
}
.card-LiveVTR-wrapper {
  width: 90%;
}
.price-buy-detail {
  width: 100%;
  height: 280px;
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
  margin-top: 90px;
}
.detailReviewCardWrapper {
  width: 96%;
  height: 250px;
  /* overflow-x: auto;
  white-space: nowrap; */
}
.cookActive {
  color: #babdc2;
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
  height: 500px;
  margin: auto;
  margin-top: 70px;
  max-width: 945px;
}
@media screen and (min-width: 821px) and (max-width: 1022px) {
  .userReview_wrapper {
    width: 90%;
  }
  #ytplayer {
    width: 100%;
    height: 450px;
    margin: auto;
    margin-top: 70px;
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
  .userReview_wrapper {
    width: 750px;
  }
  #ytplayer {
    width: 100%;
    height: 400px;
    margin: auto;
    margin-top: 70px;
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
  .userReview_wrapper {
    width: 600px;
  }
  #ytplayer {
    width: 100%;
    height: 400px;
    margin: auto;
    margin-top: 70px;
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
  .userReview_wrapper {
    width: 500px;
  }
  #ytplayer {
    width: 100%;
    height: 350px;
    margin: auto;
    margin-top: 70px;
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
    width: 360px;
    margin-left: 8px;
  }
}
</style>