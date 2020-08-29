<template>
  <div>
    <q-page>
      <div class="topPageImageWrapper row" v-if="Object.keys(TopPageImage).length > 0">
        <div class="topImageWrapperLeft col">
          <div class="topImageTitleWrapper">
            <span>本日のおすすめ簡単料理</span>
          </div>
          <div class="topImage-1-wrapper">
            <router-link
              :to="{
                name: 'video',
                query: {
                  key: TopPageImage['topImage']['top1'].id,
                  from: 'topPage'
                }
              }"
              style="text-decoration:none;color:black;"
            >
              <q-img
                class="topImage-1"
                :src="TopPageImage['topImage']['top1'].url"
                :ratio="16 / 9"
              />
              <div class="topPagetitleImageWrapper">
                <q-avatar
                  class="topPageAvator"
                  v-if="
                    YoutubersChannel_info[
                      TopPageImage['topImage']['top1'].channelId
                    ]
                  "
                >
                  <img
                    :src="
                      YoutubersChannel_info[
                        TopPageImage['topImage']['top1'].channelId
                      ].iconUrl
                    "
                  />
                </q-avatar>
                <div
                  class="topPagetitleImageDescriptionWrapper"
                  v-if="Object.keys(cookVideos).length>0"
                >
                  <div class="topPagevideoTitleCookPage2">
                    {{
                    cookVideos[TopPageImage['topImage']['top1'].id].videoTitle
                    }}
                  </div>
                  <div class="topPagevideoChannel">
                    {{
                    cookVideos[TopPageImage['topImage']['top1'].id].channelTitle
                    }}
                  </div>
                </div>
                <div v-else>お待ちください</div>
              </div>
            </router-link>
          </div>
        </div>
        <!-- ---------------------------------------- -->
        <!--  幅が５００px以上の時のトップページのレイアウト -->
        <!-- ---------------------------------------- -->
        <div class="topImageWrapperRight" v-if="Object.keys(TopPageImage).length>0">
          <q-virtual-scroll :items="heavylist">
            <template v-slot="{ item, index }">
              <router-link
                :to="{
              name: 'video',
              query: {
                key: TopPageImage['topImage'][item].id,
                from: 'topPage'
              }
            }"
                style="text-decoration:none;color:black;"
                :key="index"
              >
                <div class="topImage-2-wrapper">
                  <q-img
                    class="topImage-2"
                    :src="TopPageImage['topImage'][item].url"
                    :ratio="16 / 9"
                  />
                </div>
              </router-link>
            </template>
          </q-virtual-scroll>
        </div>
      </div>
      <div v-else>
        <div class="spinnerWrapper">
          <q-spinner color="black" size="4em" />
        </div>
      </div>
      <!-- ---------------------------------------- -->
      <!--  幅が５００px以下の時のトップページのレイアウト -->
      <!-- ---------------------------------------- -->
      <q-virtual-scroll
        virtual-scroll-horizontal
        :items="heavylist"
        class="topImageWrapperRightSmall"
        v-if="Object.keys(TopPageImage).length>0"
      >
        <template v-slot="{ item, index }">
          <router-link
            :to="{
              name: 'video',
              query: {
                key: TopPageImage['topImage'][item].id,
                from: 'topPage'
              }
            }"
            style="text-decoration:none;color:black;"
            :key="index"
          >
            <div class="topImage-2-wrapper">
              <q-img class="topImage-2" :src="TopPageImage['topImage'][item].url" :ratio="16 / 9" />
            </div>
          </router-link>
        </template>
      </q-virtual-scroll>
      <form @submit.prevent="showReviewMakeModal" class="urlInputForm column" name="urlSubmitForm">
        <input
          type="text"
          id="youtubeURLInput"
          name="registerURL"
          v-model="registerURL"
          placeholder="好きな料理Youtube動画のURLを貼ってください"
        />

        <q-btn class="registerButton shadow-5" label="登録" type="submit"></q-btn>
      </form>
      <!-- --------------------------- -->
      <!-- １段目のジャンルで選択するのところ -->
      <!-- --------------------------- -->
      <topPageSegment flag="genre" />
      <topPageSegment flag="material" />
      <topPageSegment flag="menu" />
      <!-- --------------------------- -->
      <!-- Youtuberのところ -->
      <!-- --------------------------- -->
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <div class="menuIconWrapper">
            <q-icon name="live_tv" size="sm" class="topPageIcon"></q-icon>
          </div>
          <div class="menuTitleWrapper">
            <span class="cookImageWrapperTopPage-title-span">高評価の多い料理チャンネル</span>
          </div>
          <q-space />
          <div class="MoreButton_wrapper">
            <q-btn flat to="/youtubers" class="moreButton" label="もっとみる"></q-btn>
          </div>
        </div>
        <div class="cookImageTopPageWrapper">
          <div class="topPageYoutuberWrapper row">
            <CardYoutuber
              v-for="(channelInfo, key) in getTop5Youtuber"
              :key="key"
              :id="key"
              :channelId="key"
              :channelInfo="channelInfo"
              from="topPage"
            />
          </div>
        </div>
      </div>
      <!-- --------------------------- -->
      <!-- Reviewrのところ -->
      <!-- --------------------------- -->
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <div class="menuIconWrapper">
            <q-icon name="fas fa-users" size="sm" class="topPageIcon"></q-icon>
          </div>
          <div class="menuTitleWrapper">
            <span class="cookImageWrapperTopPage-title-span">高評価の多いReviewer</span>
          </div>
          <q-space />
          <div class="MoreButton_wrapper">
            <q-btn flat to="/reviewtotal" class="moreButton" label="もっとみる"></q-btn>
          </div>
        </div>
        <div class="cookImageTopPageWrapper row">
          <div class="topPageYoutuberWrapper row">
            <ReviewerTotalPageCard
              :usersInfo="usersInfo"
              v-for="(usersInfo, key) in getTop5Reviewer"
              :key="key"
              :id="key"
              from="topPage"
            />
          </div>
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
    <!-- 最初におとづれたときのチュートリアル的なモーダル -->
    <!-- <q-dialog v-model="firstVisitOrNot">
      <FirstVisitModal @closeIntro="firstVisitOrNot = false" />
    </q-dialog>-->
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import axios from "axios";
import { LocalStorage } from "quasar";

export default {
  data() {
    return {
      noticeRegistered: false,
      registerURL: "",
      alertToSignUp: false,
      reviewSubmit: false,
      doubleRegistAlert: false,
      genreAlert: false,
      Snippet: "",
      cookedOrWillCook: false,
      SETMadeOrNot: false,
      // firstVisitOrNot: true,
      heavylist: ["top2", "top3", "top4", "top5", "top6", "top7", "top8"],
      VideoId: "",
      TAGArray: [],
    };
  },
  computed: {
    ...mapState("youtubers", ["YoutubersChannel_info"]),
    ...mapState("videos", ["cookVideos"]),
    ...mapState("auth", ["loggedIn", "userId"]),
    ...mapState("usersPublic", ["usersPublicInfo"]),
    ...mapState("topPageImage", ["TopPageImage"]),
    ...mapGetters("youtubers", ["getTop5Youtuber"]),
    ...mapGetters("usersPublic", ["getTop5Reviewer"]),
    getYoutubeURL() {
      return document.getElementsByClassName("youtuberURL").item(0).textContent;
    },
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
        console.log(videoId);
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
          snippet.categoryId == 22
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
  components: {
    ToLoginAlert: require("components/Modals/ToLoginAlert.vue").default,
    registerReviewModal: require("components/Modals/registerReviewModal.vue")
      .default,
    CookedOrWillCook: require("components/Modals/CookedOrWillCook.vue").default,
    CardYoutuber: require("components/Card/YoutuberCard.vue").default,
    ReviewerTotalPageCard: require("components/Card/ReviewerTotalPageCard.vue")
      .default,
    NoticeRegistered: require("components/Notice/NoticeRegistered.vue").default,
    doubleRegistered: require("components/Notice/doubleRegistered.vue").default,
    topPageSegment: require("components/topPageSegment.vue").default,
    // FirstVisitModal: require("components/FirstVisitModal/FirstVisitModal.vue")
    //   .default,
  },
  mounted() {},
  created() {},
};
</script>

<style  lang="scss">
// ---------------------------------
// ページのトップ画面
// ----------------------------------
#youtubeURLInput {
  width: 350px;
  background: white;
  height: 50px;
  margin-right: auto;
  margin-left: auto;
  border-radius: 25px;
}
.topPageImageWrapper {
  width: 95%;
  height: 400px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 10px;
  margin-bottom: 30px;
}
.topPageAvator {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.topPagetitleImageWrapper {
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
  width: 98%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  justify-content: center;
}
.topPagetitleImageDescriptionWrapper {
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.topImage-1-wrapper {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  max-width: 555.66px;
}
.topImage-1 {
  width: 100%;
}
.topPagevideoTitleCookPage2 {
  font-size: 15px;
  font-weight: bold;
}
.topPagevideoChannel {
  font-size: 13px;
  color: #606060;
}
.topImageWrapperLeft {
  width: 70%;
  height: 100%;
}
.topImageTitleWrapper {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
  background: #fff8e3;
  border-radius: 20px;
  padding-left: 10px;
  height: 40px;
  text-align: center;
  padding-top: 5px;
}
@media screen and (min-width: 1500px) and (max-width: 1750px) {
  .topImage-1-wrapper {
    max-width: 650.66px;
  }
  .topPageImageWrapper {
    height: 450px;
  }
  .topPagevideoTitleCookPage2 {
    font-size: 17px;
  }
  .topPagevideoChannel {
    font-size: 15px;
  }
}
@media screen and (min-width: 1750px) {
  .topImage-1-wrapper {
    max-width: 700.66px;
  }
  .topPageImageWrapper {
    height: 500px;
  }
  .topPagevideoTitleCookPage2 {
    font-size: 18px;
  }
  .topPagevideoChannel {
    font-size: 16px;
  }
}
.topImageWrapperRight {
  width: 30%;
  height: 100%;
  overflow-y: scroll;
  background-color: #fffcf5;
}
.topImage-2-wrapper {
  width: 100%;
  display: flex;
  justify-content: start;
}
.topImage-2 {
  width: 80%;
  margin: 5px;
}
.topPageImage {
  width: 95%;
  max-width: 681.18px;
}
.spinnerWrapper {
  width: 100%;
  height: 280px;
  margin-top: 180px;
  display: flex;
  justify-content: center;
}
// ==========================
//  URLのインプットのところ
// ==========================
.registerWrapper {
  width: 360px;
  margin-top: 131px;
}
.urlInputForm {
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-content: center;
}
.registerButton {
  margin-top: 10px;
  width: 150px;
  font-weight: bold;
  margin-right: auto;
  margin-left: auto;
  background-color: #ff9933;
  color: white;
}
// ==========================
//  タグをのせるところ
// ==========================
.TopPageTagWrapper {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 30px;
}
.menuIconWrapper {
  margin-top: auto;
  margin-bottom: auto;
}
.topPageIcon {
  margin-left: 7px;
}
.menuTitleWrapper {
  margin-top: auto;
  margin-bottom: auto;
}
.topPageFirstSelect {
  width: 180px;
  margin-left: 30px;
}
/* ------------------- */
/* 料理動画を載せるところ */
/* ------------------- */
.cookImageWrapperTopPage {
  width: 100%;
  min-height: 430px;
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
  border-block-start: 1px solid rgba(0, 0, 0, 0.12);
}
.cookImageWrapperTopPage-title {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  background: #fffaeb;
  border-radius: 20px;
  height: 50px;
  padding: 5px;
}
.cookImageWrapperTopPage-title-span {
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
  margin-bottom: 5px;
}
/* --------------- */
/* もっとみるボタン */
/* --------------- */
.MoreButton_wrapper {
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
}
.moreButton {
  height: 37px;
  font-size: 14px;
  font-weight: normal;
  color: #161422;
  background-color: rgba(118, 115, 138, 0.1);
  white-space: nowrap;
  cursor: pointer;
  padding: 0px 4px;
  border-radius: 20px;
}
.moreButton-bottom {
  margin-bottom: 50px;
}
.cookImageTopPageWrapper {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
}
@media screen and (min-width: 1344px) {
  .topPageYoutuberWrapper {
    width: 1051px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 1114px) and (max-width: 1343px) {
  .topPageYoutuberWrapper {
    width: 840px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 857px) and (max-width: 1113px) {
  .topPageYoutuberWrapper {
    width: 630px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 995px) and (max-width: 1050px) {
  .topPageImageWrapper {
    height: 380px;
  }
}
@media screen and (min-width: 905px) and (max-width: 994px) {
  .topPageImageWrapper {
    height: 350px;
  }
}
@media screen and (min-width: 857px) and (max-width: 904px) {
  .topPageImageWrapper {
    height: 320px;
  }
}
@media screen and (min-width: 769px) and (max-width: 856px) {
  .topPageYoutuberWrapper {
    width: 420px;
    margin-left: auto;
    margin-right: auto;
  }
  .topPageImageWrapper {
    height: 350px;
  }
}
@media screen and (min-width: 680px) and (max-width: 768px) {
  .topPageYoutuberWrapper {
    width: 630px;
    margin-left: auto;
    margin-right: auto;
  }
  .topPageImageWrapper {
    height: 330px;
  }
  .topImageTitleWrapper {
    font-size: 19px;
  }
}
@media screen and (min-width: 659px) and (max-width: 679px) {
  .topPageYoutuberWrapper {
    width: 420px;
    margin-left: auto;
    margin-right: auto;
  }
  .topPageImageWrapper {
    height: 300px;
  }
  .topImageTitleWrapper {
    font-size: 17px;
  }
}
@media screen and (min-width: 500px) and (max-width: 658px) {
  .topPageYoutuberWrapper {
    width: 420px;
    margin-left: auto;
    margin-right: auto;
  }
  .topPageImageWrapper {
    height: 280px;
  }
  .topImageTitleWrapper {
    font-size: 17px;
  }
  .topPagevideoTitleCookPage2 {
    font-size: 13px;
  }
  .topPagevideoChannel {
    font-size: 12px;
  }
  .topPageAvator {
    width: 30px;
    height: 30px;
  }
}
@media screen and (min-width: 590px) and (max-width: 880px) {
  .cookImageWrapperTopPage-title-span {
    font-size: 18px;
    font-weight: bold;
    margin-left: 15px;
  }
  .topPageFirstSelect {
    width: 150px;
    margin-left: 20px;
  }
}
@media screen and (min-width: 500px) and (max-width: 589px) {
  .cookImageWrapperTopPage-title-span {
    font-size: 16px;
    font-weight: bold;
    margin-left: 10px;
  }
  .topPageFirstSelect {
    width: 130px;
    font-size: 12px;
    margin-left: 10px;
  }
}

@media screen and (min-width: 500px) {
  .topImageWrapperRightSmall {
    display: none;
  }
}

@media screen and (min-width: 300px) and (max-width: 499px) {
  .topPageAvator {
    width: 20px;
    height: 20px;
  }
  .topPagevideoTitleCookPage2 {
    font-size: 12px;
  }
  .topPagevideoChannel {
    font-size: 12px;
  }
  .topPageImageWrapper {
    height: 240px;
  }
  .topImage-1-wrapper {
    width: 86%;
  }
  .topImageTitleWrapper {
    font-size: 15px;
    height: 30px;
    width: 95%;
  }
  .TopPageTagWrapper {
    margin-bottom: 15px;
  }
  .moreButton {
    height: 30px;
    font-size: 13px;
    font-weight: normal;
    color: #161422;
    background-color: rgba(118, 115, 138, 0.1);
    white-space: nowrap;
    cursor: pointer;
    padding: 0px 4px;
    border-radius: 20px;
  }
  .cookImageTopPageWrapper {
    margin-top: 25px;
  }
  .topPageFirstSelect {
    display: none;
  }
  .registerWrapper {
    margin-top: 74px;
  }
  .cookImageWrapperTopPage {
    margin-top: 4px;
  }
  .cookImageWrapperTopPage-title-span {
    font-size: 14px;
    font-weight: bold;
    margin-left: 9px;
  }
  .topPageFirstSelect {
    width: 158px;
    margin-left: 15px;
  }
  .topPageIcon {
    margin-left: 10px;
  }
  .topImageWrapperRight {
    display: none;
  }
  .topImageWrapperLeft {
    width: 90%;
    height: 100%;
  }
  .topImage-2-wrapper {
    width: 130px;
  }
  .topImageWrapperRightSmall {
    margin-bottom: 10px;
  }
}
@media screen and (min-width: 300px) and (max-width: 413px) {
  .registerURLInput {
    width: 90%;
    margin-right: auto;
    margin-left: auto;
    font-size: 10px;
  }
  .topImage-2 {
    width: 90%;
    margin: 2px;
  }
}
</style>

<!-- <div class="column registerWrapper">
          <form
            @submit.prevent="showReviewMakeModal"
            class="urlInputForm column"
            name="urlSubmitForm"
          >
            <input
              type="text"
              id="youtubeURLInput"
              name="registerURL"
              v-model="registerURL"
              placeholder="好きな料理Youtube動画のURLを貼ってください"
            /> -->
<!-- <form name="URLForm">
            <q-input
              name="URLForm2"
              ref="VTRurl"
              bg-color="white"
              class="registerURLInput"
              id="youtubeURLInput"
              rounded
              outlined
              v-model="registerURL"
              label="好きな料理Youtube動画のURLを貼ってください"
              label-color="black"
              :rules="[
                val =>
                  val.includes('https://www.youtube.com/watch?v=') ||
                  '登録できるのはYoutube動画のみです'
              ]"
            ></q-input>
            </form>-->
<!-- <q-btn
              class="registerButton shadow-5"
              label="登録"
              type="submit"
            ></q-btn>
          </form> -->
