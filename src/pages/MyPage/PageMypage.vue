<template>
  <div>
    <q-page padding>
      <div class="row">
        <router-link
          v-if="from == 'reviewersPage'"
          to="/reviewtotal"
          style="text-decoration: none; color: black"
        >
          <q-icon name="chevron_left" size="xl" color="black" />
          <span class="text-h6 text-grey-7 vertical-middle"
            >Reviewer一覧へ</span
          >
        </router-link>
        <router-link
          v-else-if="from == 'topPage'"
          to="/"
          style="text-decoration: none; color: black"
        >
          <q-icon name="chevron_left" size="xl" color="black" />
          <span class="text-h6 text-grey-7 vertical-middle"
            >Reviewer一覧へ</span
          >
        </router-link>
        <router-link
          v-else-if="from == 'videoDetail'"
          :to="{ name: 'video', query: { key: videoId, from: 'topPage' } }"
          style="text-decoration: none; color: black"
        >
          <q-icon name="chevron_left" size="xl" color="black" />
          <span class="text-h6 text-grey-7 vertical-middle"
            >動画詳細ページへ</span
          >
        </router-link>
      </div>
      <!-- --------------------------- -->
      <!-- 料理を登録するForm -->
      <!-- --------------------------- -->
      <div class="formWrapper">
        <form
          @submit.prevent="showReviewMakeModal"
          class="urlInputForm row"
          name="urlSubmitForm"
        >
          <input
            type="text"
            id="youtubeURLInput"
            name="registerURL"
            v-model="registerURL"
            placeholder="　Youtube料理動画のつくれぽをかこう！"
          />
          <q-btn
            class="registerButton shadow-5"
            label="登録"
            type="submit"
          ></q-btn>
        </form>
      </div>
      <div class="ctlLayout" v-if="usersPublicInfo[pageUserId]">
        <!-- ユーザープロフィール情報 -->
        <div class="row profileWrapper">
          <q-avatar class="myPageAvator">
            <img :src="usersPublicInfo[pageUserId].photoURL" />
          </q-avatar>
          <div class="column userProfile">
            <div class="userName">
              {{ usersPublicInfo[pageUserId].nickName }}
            </div>
            <div class="introduction">
              {{ usersPublicInfo[pageUserId].introduction }}
            </div>
          </div>
        </div>

        <!-- ---------------------------- -->
        <!-- つくったかこれからつくるのかのTAB -->
        <!-- ---------------------------- -->
        <q-tabs v-model="tab" inline-label style="margin-top: 18px">
          <q-tab
            name="cooked"
            class="cookedTab"
            icon="fas fa-utensils"
            label="料理済み"
          ></q-tab>
          <q-tab
            name="NotCooked"
            class="cookedTab"
            icon="fas fa-carrot"
            label="後で作る"
          />
        </q-tabs>
        <div class="row cookVideoReview" v-if="tab == 'cooked'">
          <transition-group
            appear
            enter-active-class="animated fadeInLeft"
            class="row"
          >
            <MyPageCookVideoReviewCard
              v-for="(reviewInfo, key) in getfavoriteCookedObject(
                pageUserId,
                tab
              )"
              :key="key"
              :docId="key"
              :reviewInfo="reviewInfo"
              :userOrNot="userOrNot"
              :pageUserId="pageUserId"
              from="mypage"
            />
          </transition-group>
        </div>
        <div class="NonCookVideoReview" v-else-if="tab == 'NotCooked'">
          <transition-group
            appear
            enter-active-class="animated fadeInLeft"
            class="row"
          >
            <MyPageNonCookVideoCard
              v-for="(reviewInfo, key) in getfavoriteCookedObject(
                pageUserId,
                tab
              )"
              :key="key"
              :docId="key"
              :reviewInfo="reviewInfo"
              :userOrNot="userOrNot"
              :pageUserId="pageUserId"
              from="mypage"
            />
          </transition-group>
        </div>
      </div>
    </q-page>
    <!-- ユーザー登録をする様に促すDialog -->
    <q-dialog v-model="alertToSignUp">
      <ToLoginAlert />
    </q-dialog>
    <!-- レビューをかく促すDialog -->
    <q-dialog v-model="reviewSubmit">
      <registerReviewModal :registerURL="registerURL" :snippet="Snippet" />
    </q-dialog>
    <!-- 同じ動画は投稿できませんModal -->
    <q-dialog v-model="doubleRegistAlert" persistent>
      <doubleRegistered />
    </q-dialog>
    <!-- 料理動画以外は投稿できません -->
    <q-dialog v-model="genreAlert" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red" text-color="white" size="sm" />
          <span class="q-ml-sm">料理動画以外は投稿できません</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="black" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- 料理を作ったのか、これからつくるかのModal -->
    <q-dialog v-model="cookedOrWillCook" persistent>
      <CookedOrWillCook @setMadeOrNot="SetMadeOrNot" />
    </q-dialog>
    <!-- 料理を後でつくるに登録しましたのModal -->
    <q-dialog v-model="noticeRegistered" persistent>
      <NoticeRegistered :userId="userId" />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { firestoreDb } from "src/boot/firebase";
import axios from "axios";
import { getParam } from "src/functions/getParam.js";
export default {
  data() {
    return {
      alert: false,
      pageUserId: "",
      nickName: "",
      current: 1,
      userOrNot: false,
      tab: "cooked",
      from: "",
      videoId: "",
      registerURL: "",
      alertToSignUp: false,
      VideoId: "",
      Snippet: "",
      reviewSubmit: false,
      genreAlert: false,
      cookedOrWillCook: false,
      noticeRegistered: false,
      doubleRegistAlert: false,
      SETMadeOrNot: false,
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn", "userId"]),
    ...mapState("usersPublic", ["usersPublicInfo"]),
    ...mapGetters("usersPublic", ["getfavoriteCookedObject"]),
  },
  methods: {
    ...mapActions("usersPublic", ["addFavoriteVTR"]),
    ...mapActions("videos", ["addNewVideoData"]),
    ...mapActions("youtubers", ["addNewYoutuberInfo"]),
    async showReviewMakeModal() {
      const RegisterURL = document.urlSubmitForm.registerURL.value;
      if (!this.loggedIn) {
        // ログインしていなかったらユーザー登録する様にDialogをだす
        this.alertToSignUp = true;
        this.registerURL = "";
      } else if (RegisterURL == "") {
        alert("有効なURLを入れてください");
        this.registerURL = "";
      } else if (
        RegisterURL.includes("https://m.youtube.com/watch?v=") ||
        RegisterURL.includes("https://www.youtube.com/watch?v=") ||
        RegisterURL.includes("https://youtu.be/")
      ) {
        // VideoId をURLから取り出す
        let videoId;
        if (
          RegisterURL.includes("https://m.youtube.com/watch?v=") ||
          RegisterURL.includes("https://www.youtube.com/watch?v=")
        ) {
          const splicedURL1 = RegisterURL.split("&")[0];
          videoId = splicedURL1.split("v=")[1];
        } else if (RegisterURL.includes("https://youtu.be/")) {
          videoId = RegisterURL.split("youtu.be/")[1];
        }
        // dataのVideoIdにデータを入れている。
        this.VideoId = videoId;
        // videoIdのsnippetを取ってきて、Categoryが明らかに違うものは弾くようにする。
        const res = await axios.get(
          "https://www.googleapis.com/youtube/v3/videos",
          {
            params: {
              key: "AIzaSyAU2_xBQsYmmlTMvW8nmMbbvfDmfOp5gig",
              id: videoId,
              part: "snippet",
            },
          }
        );
        const snippet = res.data.items[0].snippet;
        console.log(snippet);
        this.Snippet = snippet;
        // ここで同じ動画を登録していないか動画をチェックする
        // 同じVideoを登録できないようにする処理
        let ObjectArray = Object.values(
          this.usersPublicInfo[this.userId].favoriteVTRObj
        );
        let videoArray = [];
        for (let i = 0; i < ObjectArray.length; i++) {
          videoArray.push(ObjectArray[i].videoId);
        }
        if (videoArray.includes(videoId)) {
          this.doubleRegistAlert = true;
          return;
        } else if (
          snippet.categoryId == 24 ||
          snippet.categoryId == 26 ||
          snippet.categoryId == 22 ||
          snippet.categoryId == 19 ||
          snippet.categoryId == 23
        ) {
          this.cookedOrWillCook = true;
        } else {
          this.genreAlert = true;
        }
      } else {
        alert("有効なURLを入れてください");
        this.registerURL = "";
      }
    },
    SetMadeOrNot(value) {
      this.SETMadeOrNot = value;
      this.cookedOrWillCook = false;
      if (value == true) {
        this.reviewSubmit = true;
      } else {
        this.addFavoriteVTR({
          uid: this.userId,
          review: "",
          favoriteVTRvideoID: this.VideoId,
          star_number: 0,
          snippet: this.Snippet,
          cooked: false,
        });
        this.addNewVideoData({
          uid: this.userId,
          favoriteVTRvideoID: this.VideoId,
          snippet: this.Snippet,
        });
        this.addNewYoutuberInfo({
          uid: this.userId,
          channelId: this.Snippet.channelId,
          favoriteVTRvideoID: this.VideoId,
          snippet: this.Snippet,
        });
        this.noticeRegistered = true;
      }
    },
  },
  mounted() {
    this.pageUserId = getParam("id");
    this.from = getParam("from");
    this.videoId = getParam("videoId");
    if (this.userId == this.pageUserId) {
      this.userOrNot = true;
    }
  },
  components: {
    ToLoginAlert: require("components/Modals/ToLoginAlert.vue").default,
    registerReviewModal: require("components/Modals/registerReviewModal.vue")
      .default,
    CookedOrWillCook: require("components/Modals/CookedOrWillCook.vue").default,
    NoticeRegistered: require("components/Notice/NoticeRegistered.vue").default,
    doubleRegistered: require("components/Notice/doubleRegistered.vue").default,
    MyPageCookVideoReviewCard: require("components/Card/MyPageVideoCard/MyPageCookVideoReviewCard.vue")
      .default,
    MyPageNonCookVideoCard: require("components/Card/MyPageVideoCard/MyPageNonCookVideoCard.vue")
      .default,
  },
  watch: {
    $route(to, from) {
      this.pageUserId = getParam("id");
      if (this.userId == this.pageUserId) {
        this.userOrNot = true;
      }
    },
  },
};
</script>

<style>
.ctlLayout {
  margin-top: 40px;
  margin-left: 5px;
  margin-right: 5px;
}
.myPageAvator {
  width: 100px;
  height: 100px;
}
.userName {
  font-size: 27px;
  padding-top: 8px;
  padding-right: 24px;
  padding-left: 24px;
}
.introduction {
  font-size: 18px;
  padding-top: 8px;
  padding-right: 24px;
  padding-left: 24px;
}
.profileWrapper {
  width: 89%;
  margin-right: auto;
  margin-left: auto;
}
.modifyButton {
  width: 160px;
  height: 45px;
  margin-top: 20px;
}
.onAirTabs {
  margin-bottom: 16px;
}
.selectButtonWrapper {
  width: 87%;
  margin-right: auto;
  margin-left: auto;
}
.cookVideoReview {
  width: 100%;
  margin-top: 30px;
}
/* FormのところのCSS */
.formWrapper {
  margin-top: 26px;
}
#youtubeURLInput {
  width: 60%;
  background: white;
  height: 40px;
  margin-right: 0px;
  margin-left: auto;
  border-radius: 25px;
  margin-top: 3px;
  border: solid 1px rgb(103, 102, 102);
}
.registerWrapper {
  width: 360px;
  margin-top: 131px;
}
.urlInputForm {
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-content: center;
  padding-bottom: -5px;
}
.registerButton {
  width: 13%;
  border-radius: 25px;
  font-weight: bold;
  margin-right: auto;
  margin-left: 4px;
  margin-top: 4px;
  margin-bottom: 4px;
  background-color: #ff9933;
  color: white;
}

/* TABのCSS */
.cookedTab {
  width: 200px;
  color: rgb(82, 87, 135);
}

/* /* /* /* /* /* /* /* /* /* /* /* /* /* /* /* /* 
/* 画面のサイズが1808以上の時は横にCard5枚並べる */
@media screen and (min-width: 1691px) {
  .cookVideoReview {
    width: 1317px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
/* 画面のサイズが1281以上1807以下の時は横にCard4枚並べる */
@media screen and (min-width: 1185px) and (max-width: 1690px) {
  .cookVideoReview {
    width: 962px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
/* 画面のサイズが1129以上1280以下の時は横にCard3枚並べる */
@media screen and (min-width: 1125px) and (max-width: 1184px) {
  .cookVideoReview {
    width: 878px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 1000px) and (max-width: 1124px) {
  .cookVideoReview {
    width: 770px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 500px) and (max-width: 999px) {
  .cookVideoReview {
    width: 500px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 1764px) {
  .NonCookVideoReview {
    width: 1525px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 1452px) and (max-width: 1763px) {
  .NonCookVideoReview {
    width: 1220px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 1145px) and (max-width: 1452px) {
  .NonCookVideoReview {
    width: 915px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 840px) and (max-width: 1144px) {
  .NonCookVideoReview {
    width: 610px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 500px) and (max-width: 839px) {
  .NonCookVideoReview {
    width: 470px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 414px) and (max-width: 499px) {
  .myPageAvator {
    width: 70px;
    height: 70px;
  }
  .userProfile {
    width: 250px;
  }
  .userName {
    padding-top: 0px;
  }
}
@media screen and (min-width: 300px) and (max-width: 413px) {
  .myPageAvator {
    width: 50px;
    height: 50px;
  }
  .userProfile {
    width: 250px;
  }
  .userName {
    padding-top: 0px;
  }
}
</style>
