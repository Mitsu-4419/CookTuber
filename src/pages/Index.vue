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

      <!-- --------------------------- -->
      <!-- １段目のジャンルで選択するのところ -->
      <!-- --------------------------- -->
      <!-- <topPageSegment flag="meat" /> -->
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

    <!-- 最初におとづれたときのチュートリアル的なモーダル -->
    <!-- <q-dialog v-model="firstVisitOrNot">
      <FirstVisitModal @closeIntro="firstVisitOrNot = false" />
    </q-dialog>-->
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { LocalStorage } from "quasar";
export default {
  data() {
    return {
      // firstVisitOrNot: true,
      heavylist: [
        "top2",
        "top3",
        "top4",
        "top5",
        "top6",
        "top7",
        "top8",
        "top9",
        "top10",
        "top11",
        "top12",
        "top13",
      ],
      TAGArray: [],
    };
  },
  computed: {
    ...mapState("youtubers", ["YoutubersChannel_info"]),
    ...mapState("videos", ["cookVideos"]),
    ...mapState("usersPublic", ["usersPublicInfo"]),
    ...mapState("topPageImage", ["TopPageImage"]),
    ...mapGetters("youtubers", ["getTop5Youtuber"]),
    ...mapGetters("usersPublic", ["getTop5Reviewer"]),
    getYoutubeURL() {
      return document.getElementsByClassName("youtuberURL").item(0).textContent;
    },
  },
  components: {
    CardYoutuber: require("components/Card/YoutuberCard.vue").default,
    ReviewerTotalPageCard: require("components/Card/ReviewerTotalPageCard.vue")
      .default,
    topPageSegment: require("components/topPageSegment.vue").default,
    // FirstVisitModal: require("components/FirstVisitModal/FirstVisitModal.vue")
    //   .default,
  },
};
</script>

<style  lang="scss">
// ---------------------------------
// ページのトップ画面
// ----------------------------------

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
    height: 360px;
  }
}
@media screen and (min-width: 857px) and (max-width: 904px) {
  .topPageImageWrapper {
    height: 330px;
  }
}
@media screen and (min-width: 769px) and (max-width: 856px) {
  .topPageYoutuberWrapper {
    width: 420px;
    margin-left: auto;
    margin-right: auto;
  }
  .topPageImageWrapper {
    height: 360px;
  }
}
@media screen and (min-width: 680px) and (max-width: 768px) {
  .topPageYoutuberWrapper {
    width: 630px;
    margin-left: auto;
    margin-right: auto;
  }
  .topPageImageWrapper {
    height: 340px;
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
    height: 310px;
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
    height: 290px;
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
    height: 250px;
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
