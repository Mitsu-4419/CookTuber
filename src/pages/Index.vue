<template>
  <div>
    <q-page>
      <div class="topPageImageWrapper">
        <div class="column registerWrapper">
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
            />
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
            <q-btn
              class="registerButton shadow-5"
              label="登録"
              style="font-weight:bold; background-color:#ff9933;color:white;"
              type="submit"
            ></q-btn>
          </form>
        </div>
      </div>
      <!-- --------------------------- -->
      <!-- １段目のジャンルで選択するのところ -->
      <!-- --------------------------- -->
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <div style="padding-top:5px;">
            <q-icon name="restaurant" size="sm" class="topPageIcon"></q-icon>
            <span class="cookImageWrapperTopPage-title-span"
              >ジャンルで選ぶ</span
            >
          </div>
          <q-select
            class="topPageFirstSelect"
            dense
            rounded
            outlined
            v-model="model"
            :options="options"
            bg-color="white"
            color="grey-5"
          />
        </div>
        <div class="TopPageTagWrapper">
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedGenreTag('country'))"
              :key="tag"
              :tagName="genreTag[tag].name"
              :id="tag"
              @setActivatedTag="setTagArray"
              flag="topPage"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedGenreTag('material'))"
              :key="tag"
              :tagName="genreTag[tag].name"
              :id="tag"
              @setActivatedTag="setTagArray"
              flag="topPage"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedGenreTag('special'))"
              :key="tag"
              :tagName="genreTag[tag].name"
              :id="tag"
              @setActivatedTag="setTagArray"
              flag="topPage"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(timeTag)"
              :key="tag"
              :tagName="timeTag[tag].name"
              :id="tag"
              :TAGArray="tagTimeArray"
              @setActivatedTag="setTagArray"
              flag="topPage"
            />
          </div>
        </div>
        <div class="cookImageTopPageWrapper row">
          <CookVideoCardTopPage
            v-for="(cookVideoDetail, key) in sortByTagOfCookVideosTop5(
              { genreArray: tagGenreArray, timeArray: tagTimeArray },
              model
            )"
            :key="key"
            :id="key"
            :cookVideoDetail="cookVideoDetail"
            from="topPage"
          />
        </div>
      </div>
      <div class="MoreButton_wrapper">
        <q-btn
          flat
          to="/genreCookvideos"
          class="moreButton"
          label="もっとみる"
        ></q-btn>
      </div>
      <!-- -------------------------->
      <!-- Menuで料理を選ぶところ -->
      <!-- -------------------------->
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <div style="padding-top:5px;">
            <q-icon
              name="fas fa-book-open"
              size="sm"
              class="topPageIcon"
            ></q-icon>
            <span class="cookImageWrapperTopPage-title-span"
              >メニューで選ぶ</span
            >
          </div>
          <q-select
            class="topPageFirstSelect"
            dense
            rounded
            outlined
            v-model="menuModel"
            :options="optionsMenu"
            bg-color="white"
            color="grey-5"
          />
        </div>
        <div class="TopPageTagWrapper">
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedMenuTag('meat'))"
              :key="tag"
              :tagName="menuTag[tag].name"
              :id="tag"
              @setActivatedTag="setMenuTag"
              flag="topPage"
              ref="menuchip"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedMenuTag('rice'))"
              :key="tag"
              :tagName="menuTag[tag].name"
              :id="tag"
              @setActivatedTag="setMenuTag"
              flag="topPage"
              ref="menuchip"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedMenuTag('chinese'))"
              :key="tag"
              :tagName="menuTag[tag].name"
              :id="tag"
              @setActivatedTag="setMenuTag"
              flag="topPage"
              ref="menuchip"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedMenuTag('noodle'))"
              :key="tag"
              :tagName="menuTag[tag].name"
              :id="tag"
              @setActivatedTag="setMenuTag"
              flag="topPage"
              ref="menuchip"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedMenuTag('other'))"
              :key="tag"
              :tagName="menuTag[tag].name"
              :id="tag"
              @setActivatedTag="setMenuTag"
              flag="topPage"
              ref="menuchip"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(timeTag)"
              :key="tag"
              :tagName="timeTag[tag].name"
              :id="tag"
              :TAGArray="tagMenuTimeArray"
              @setActivatedTag="setMenuTag"
              flag="topPage"
            />
          </div>
        </div>
        <div class="cookImageTopPageWrapper row">
          <CookVideoCardTopPage
            v-for="(cookVideoDetail, key) in sortByMenuOfCookVideosTop5(
              { menuArray: tagMenuArray, timeMenuArray: tagMenuTimeArray },
              menuModel
            )"
            :key="key"
            :id="key"
            :cookVideoDetail="cookVideoDetail"
            from="topPage"
          />
        </div>
      </div>
      <div class="MoreButton_wrapper">
        <q-btn
          flat
          to="/menuCookvideos"
          class="moreButton"
          label="もっとみる"
        ></q-btn>
      </div>
      <!-- -------------------------->
      <!-- Materialのタグを選ぶ -->
      <!-- -------------------------->
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <div style="padding-top:5px;">
            <q-icon name="fas fa-carrot" size="sm" class="topPageIcon"></q-icon>
            <span class="cookImageWrapperTopPage-title-span">材料で選ぶ</span>
          </div>
          <q-select
            class="topPageFirstSelect"
            dense
            rounded
            outlined
            v-model="materialModel"
            :options="optionsMaterial"
            bg-color="white"
            color="grey-5"
          />
        </div>
        <div class="TopPageTagWrapper">
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedMaterialTag('vegetable'))"
              :key="tag"
              :tagName="materialTag[tag].name"
              :id="tag"
              @setActivatedTag="setMaterialTag"
              flag="topPage"
              ref="menuchip"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedMaterialTag('meat'))"
              :key="tag"
              :tagName="materialTag[tag].name"
              :id="tag"
              @setActivatedTag="setMaterialTag"
              flag="topPage"
              ref="menuchip"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedMaterialTag('rice'))"
              :key="tag"
              :tagName="materialTag[tag].name"
              :id="tag"
              @setActivatedTag="setMaterialTag"
              flag="topPage"
              ref="menuchip"
            />
            <ChipComponent
              v-for="tag in Object.keys(sortedMaterialTag('noodle'))"
              :key="tag"
              :tagName="materialTag[tag].name"
              :id="tag"
              @setActivatedTag="setMaterialTag"
              flag="topPage"
              ref="menuchip"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedMaterialTag('fish'))"
              :key="tag"
              :tagName="materialTag[tag].name"
              :id="tag"
              @setActivatedTag="setMaterialTag"
              flag="topPage"
              ref="menuchip"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedMaterialTag('alcohol'))"
              :key="tag"
              :tagName="materialTag[tag].name"
              :id="tag"
              @setActivatedTag="setMaterialTag"
              flag="topPage"
              ref="menuchip"
            />
            <ChipComponent
              v-for="tag in Object.keys(sortedMaterialTag('wheat'))"
              :key="tag"
              :tagName="materialTag[tag].name"
              :id="tag"
              @setActivatedTag="setMaterialTag"
              flag="topPage"
              ref="menuchip"
            />
          </div>
          <div class="row">
            <ChipComponent
              v-for="tag in Object.keys(sortedMaterialTag('seasoning'))"
              :key="tag"
              :tagName="materialTag[tag].name"
              :id="tag"
              @setActivatedTag="setMaterialTag"
              flag="topPage"
              ref="menuchip"
            />
          </div>
        </div>
        <div class="cookImageTopPageWrapper row">
          <CookVideoCardTopPage
            v-for="(cookVideoDetail, key) in getTop5MaterialVideo(
              {
                materialArray: tagMaterialArray,
                timeArray: tagMaterialTimeArray
              },
              materialModel
            )"
            :key="key"
            :id="key"
            :cookVideoDetail="cookVideoDetail"
            from="topPage"
          />
        </div>
      </div>
      <div class="MoreButton_wrapper">
        <q-btn
          flat
          to="/materialCookvideos"
          class="moreButton"
          label="もっとみる"
        ></q-btn>
      </div>
      <!-- --------------------------- -->
      <!-- Youtuberのところ -->
      <!-- --------------------------- -->
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <div style="padding-top:5px;">
            <q-icon name="live_tv" size="sm" class="topPageIcon"></q-icon>
            <span class="cookImageWrapperTopPage-title-span"
              >高評価の多い料理チャンネル</span
            >
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
      <div class="MoreButton_wrapper">
        <q-btn
          flat
          to="/youtubers"
          class="moreButton"
          label="もっとみる"
        ></q-btn>
      </div>
      <!-- --------------------------- -->
      <!-- Reviewrのところ -->
      <!-- --------------------------- -->
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <div style="padding-top:5px;">
            <q-icon name="fas fa-users" size="sm" class="topPageIcon"></q-icon>
            <span class="cookImageWrapperTopPage-title-span"
              >高評価の多いReviewer</span
            >
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
      <div class="MoreButton_wrapper">
        <q-btn
          flat
          to="/reviewtotal"
          class="moreButton moreButton-bottom"
          label="もっとみる"
        ></q-btn>
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
import { mapState, mapActions, mapGetters } from "vuex";
import axios from "axios";
import mixinSortTags from "src/mixins/mixin-sortTags";
export default {
  mixins: [mixinSortTags],
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
      VideoId: "",
      TAGArray: [],
      tagTimeArray: ["time1", "time2", "time3"],
      tagMenuTimeArray: ["time1", "time2", "time3"],
      tagMaterialTimeArray: [],
      tagMenuArray: [],
      tagMaterialArray: [],
      tagGenreArray: [],
      model: "星の数順",
      options: ["星の数順", "再生回数順", "レビュー数多い順", "投稿日が最近順"],
      menuModel: "星の数順",
      optionsMenu: [
        "星の数順",
        "再生回数順",
        "レビュー数多い順",
        "投稿日が最近順"
      ],
      materialModel: "星の数順",
      optionsMaterial: [
        "星の数順",
        "再生回数順",
        "レビュー数多い順",
        "投稿日が最近順"
      ]
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn", "userId"]),
    ...mapState("usersPublic", ["usersPublicInfo"]),
    ...mapState("menuTag", ["menuTag"]),
    ...mapState("materialTag", ["materialTag"]),
    ...mapState("timeTag", ["timeTag"]),
    ...mapState("genreTag", ["genreTag"]),
    ...mapGetters("youtubers", ["getTop5Youtuber"]),
    ...mapGetters("usersPublic", ["getTop5Reviewer"]),
    ...mapGetters("genreTag", ["sortedGenreTag", "sortByTagOfCookVideosTop5"]),
    ...mapGetters("menuTag", ["sortByMenuOfCookVideosTop5", "sortedMenuTag"]),
    ...mapGetters("materialTag", ["sortedMaterialTag", "getTop5MaterialVideo"]),
    getYoutubeURL() {
      console.log(
        document.getElementsByClassName("youtuberURL").item(0).textContent
      );
      return document.getElementsByClassName("youtuberURL").item(0).textContent;
    }
  },
  methods: {
    ...mapActions("usersPublic", ["addFavoriteVTR"]),
    ...mapActions("videos", ["addNewVideoData"]),
    ...mapActions("youtubers", ["addNewYoutuberInfo"]),
    async showReviewMakeModal() {
      const RegisterURL = document.urlSubmitForm.registerURL.value;
      if (
        !RegisterURL.includes("https://www.youtube.com/watch?v=") ||
        RegisterURL == ""
      ) {
        alert("有効なURLを入れてください");
        this.registerURL = "";
      } else if (!this.loggedIn) {
        // ログインしていなかったらユーザー登録する様にDialogをだす
        this.alertToSignUp = true;
        this.registerURL = "";
      } else if (this.loggedIn) {
        // VideoId をURLから取り出す
        let splicedURL1 = RegisterURL.split("&")[0];
        let videoId = splicedURL1.split("v=")[1];
        this.VideoId = videoId;
        // videoIdのsnippetを取ってきて、Categoryが明らかに違うものは弾くようにする。
        const res = await axios.get(
          "https://www.googleapis.com/youtube/v3/videos",
          {
            params: {
              key: "AIzaSyAU2_xBQsYmmlTMvW8nmMbbvfDmfOp5gig",
              id: videoId,
              part: "snippet"
            }
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
          !(
            snippet.categoryId == 24 ||
            snippet.categoryId == 26 ||
            snippet.categoryId == 22
          )
        ) {
          this.genreAlert = true;
        } else {
          // すでに作った動画か、これから作りたい動画かを選ぶ
          this.cookedOrWillCook = true;
        }
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
          cooked: false
        });
        this.addNewVideoData({
          uid: this.userId,
          favoriteVTRvideoID: this.VideoId,
          snippet: this.Snippet
        });
        this.addNewYoutuberInfo({
          uid: this.userId,
          channelId: this.Snippet.channelId,
          favoriteVTRvideoID: this.VideoId,
          snippet: this.Snippet
        });
        this.noticeRegistered = true;
      }
    }
  },
  components: {
    ToLoginAlert: require("components/AlertModal/ToLoginAlert.vue").default,
    registerReviewModal: require("components/RegisterReviewModalTopPage/registerReviewModal.vue")
      .default,
    CookedOrWillCook: require("components/CookCheckModal/CookedOrWillCook.vue")
      .default,
    CookVideoCardTopPage: require("components/Card/CookVideoCard.vue").default,
    CardYoutuber: require("components/Card/CardYoutuber.vue").default,
    ReviewerTotalPageCard: require("components/Card/ReviewerTotalPageCard.vue")
      .default,
    ChipComponent: require("components/Chip/ChipComponent.vue").default,
    NoticeRegistered: require("components/Notice/NoticeRegistered.vue").default,
    doubleRegistered: require("components/doubleRegisterd/doubleRegistered.vue")
      .default
  }
};
</script>

<style scoped lang="scss">
#youtubeURLInput {
  width: 350px;
  background: white;
  height: 50px;
  margin-right: auto;
  margin-left: auto;
  border-radius: 25px;
}
.topPageImageWrapper {
  width: 100%;
  height: 350px;
  /* background: red; */
  background-image: url("../statics/topPage/topPage_dishImg.jpg");
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
}
.topPageImage {
  width: 95%;
  max-width: 681.18px;
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
}
.registerButton {
  margin-top: 10px;
  width: 150px;
  font-weight: bold;
  margin-right: auto;
  margin-left: auto;
}
.TopPageTagWrapper {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 30px;
}
.topPageIcon {
  margin-left: 10px;
  margin-top: -5px;
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
  background: #f7f3e8;
  border-radius: 20px;
  height: 60px;
  padding: 10px;
}
.cookImageWrapperTopPage-title-span {
  font-size: 20px;
  font-weight: bold;
  margin-left: 25px;
}
/* --------------- */
/* もっとみるボタン */
/* --------------- */
.MoreButton_wrapper {
  text-align: center;
}
.moreButton {
  height: 37px;
  font-size: 14px;
  font-weight: normal;
  color: #161422;
  background-color: rgba(68, 63, 95, 0.1);
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
@media screen and (min-width: 769px) and (max-width: 856px) {
  .topPageYoutuberWrapper {
    width: 420px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 680px) and (max-width: 768px) {
  .topPageYoutuberWrapper {
    width: 630px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 500px) and (max-width: 679px) {
  .topPageYoutuberWrapper {
    width: 420px;
    margin-left: auto;
    margin-right: auto;
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

@media screen and (min-width: 300px) and (max-width: 499px) {
  .topPageImageWrapper {
    height: 260px;
  }
  .registerWrapper {
    margin-top: 74px;
  }
  .cookImageWrapperTopPage {
    margin-top: 4px;
  }
  .cookImageWrapperTopPage-title-span {
    font-size: 15px;
    font-weight: bold;
    margin-left: 15px;
  }
  .topPageFirstSelect {
    width: 150px;
    margin-left: 15px;
  }
  .topPageIcon {
    margin-left: 10px;
  }
}
@media screen and (min-width: 300px) and (max-width: 413px) {
  .registerURLInput {
    width: 90%;
    margin-right: auto;
    margin-left: auto;
    font-size: 10px;
  }
}
</style>
