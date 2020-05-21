<template>
  <div>
    <q-page>
      <div class="topPageImageWrapper">
        <!-- <q-img class="topPageImage" src="statics/topPage/topPage_dishImg.jpg"></q-img> -->
        <div class="column registerWrapper">
          <q-input
            ref="VTRurl"
            bg-color="white"
            class="registerURLInput"
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
          />
          <q-btn
            class="registerButton"
            label="登録"
            style="font-weight:bold; background-color:#ff9933;color:white;"
            @click="showReviewMakeModal"
          ></q-btn>
        </div>
      </div>
      <!-- --------------------------- -->
      <!-- １段目の料理動画のところ -->
      <!-- --------------------------- -->
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <q-icon name="far fa-play-circle" size="sm" style="margin-top:5px;"></q-icon>
          <span class="cookImageWrapperTopPage-title-span">高評価の多い料理動画</span>
          <div class="tagSelectButton">
            <q-btn
              label="詳細検索"
              style="font-weight:bold; background-color:#ff9933;color:white;"
              @click="chooseTag=true"
            ></q-btn>
            <q-space></q-space>
          </div>
        </div>
        <div class="TopPageTagWrapper">
          <div class="TopPagechooseTagModal-TagWrapper row">
            <ChipComponent
              v-for="tag in Object.keys(sortedTag('countryLarge'))"
              :key="tag"
              :tagName="allTags[tag].tagName"
              :id="tag"
              @setActivatedTag="setTagArray"
              flag="topPage"
            />
          </div>
          <div class="TopPagechooseTagModal-TagWrapper row">
            <ChipComponent
              v-for="tag in Object.keys(sortedTag('materialLarge'))"
              :key="tag"
              :tagName="allTags[tag].tagName"
              :id="tag"
              @setActivatedTag="setTagArray"
              flag="topPage"
            />
          </div>
          <div class="TopPagechooseTagModal-TagWrapper row">
            <ChipComponent
              v-for="tag in Object.keys(sortedTag('specialGenre'))"
              :key="tag"
              :tagName="allTags[tag].tagName"
              :id="tag"
              @setActivatedTag="setTagArray"
              flag="topPage"
            />
          </div>
          <div class="TopPagechooseTagModal-TagWrapper row">
            <ChipComponent
              v-for="tag in Object.keys(sortedTag('time'))"
              :key="tag"
              :tagName="allTags[tag].tagName"
              :id="tag"
              @setActivatedTag="setTagArray"
              flag="topPage"
            />
          </div>
        </div>
        <!-- ----------- -->
        <!-- tagが何も選ばれていない時 -->
        <!-- ----------- -->
        <div class="cookImageTopPageWrapper row" v-if="Object.keys(cookVideoTagSort).length==0">
          <CookVideoCardTopPage
            v-for="(cookVideoDetail, key) in getTop5VideoAtTopPage"
            :key="key"
            :videoId="key"
            :cookVideoDetail="cookVideoDetail"
            @setCookVideo="SetCookVideo"
          />
        </div>
        <div class="cookImageTopPageWrapper row" v-else>
          <CookVideoCardTopPage
            v-for="(cookVideoDetail, key) in cookVideoTagSort"
            :key="key"
            :videoId="key"
            :cookVideoDetail="cookVideoDetail"
            @setCookVideo="SetCookVideo"
          />
        </div>
      </div>
      <div class="MoreButton_wrapper">
        <q-btn flat to="/video" class="moreButton" label="もっとみる"></q-btn>
      </div>
      <!-- --------------------------- -->
      <!-- ２段目のYoutuberのところ -->
      <!-- --------------------------- -->
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <q-icon name="fas fa-desktop" size="sm" style="margin-top:5px;"></q-icon>
          <span class="cookImageWrapperTopPage-title-span">高評価の多い料理チャンネル</span>
          <!-- <q-space></q-space>
          <q-select outlined v-model="sortGenre" :options="options" class="topPageSelectBox" />-->
        </div>
        <div class="cookImageTopPageWrapper">
          <div class="topPageYoutuberWrapper row">
            <CardYoutuber
              v-for="(channelInfo, key) in getTop5Youtuber"
              :key="key"
              :channelId="key"
              :channelInfo="channelInfo"
            />
          </div>
        </div>
      </div>
      <div class="MoreButton_wrapper">
        <q-btn flat to="/youtubers" class="moreButton" label="もっとみる"></q-btn>
      </div>
      <!-- --------------------------- -->
      <!-- 3段目のReviewrのところ -->
      <!-- --------------------------- -->
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <q-icon name="fas fa-user" size="sm" style="margin-top:5px;"></q-icon>
          <span class="cookImageWrapperTopPage-title-span">高評価の多いReviewer</span>
          <!-- <q-space></q-space>
          <q-select outlined v-model="sortGenre" :options="options" class="topPageSelectBox" />-->
        </div>
        <div class="cookImageTopPageWrapper row">
          <div class="topPageYoutuberWrapper row">
            <ReviewerTotalPageCard
              :usersInfo="usersInfo"
              :uid="key"
              v-for="(usersInfo, key) in getTop5Reviewer"
              :key="key"
            />
          </div>
        </div>
      </div>
      <div class="MoreButton_wrapper">
        <q-btn flat to="/youtubers" class="moreButton moreButton-bottom" label="もっとみる"></q-btn>
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
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red" text-color="white" size="sm" />
          <span class="q-ml-sm">同じ動画は２回登録できません</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="black" v-close-popup />
        </q-card-actions>
      </q-card>
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
    <!-- 料理のTagを選ぶModal -->
    <q-dialog v-model="chooseTag" persistent>
      <ChooseTagModal
        @setCookVideo="SetCookVideo"
        @closeModal="chooseTag = false"
        :TAGArray="TAGArray"
        @setTagArray="SETTagArray"
        tag="topPage"
      />
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
export default {
  data() {
    return {
      chooseTag: false,
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
      cookVideoTagSort: {},
      tagArray: [],
      TAGArray: []
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn", "userId"]),
    ...mapState("usersPublic", ["usersPublicInfo"]),
    ...mapState("auth", ["userId"]),
    ...mapGetters("videos", [
      "getTop5VideoAtTopPage",
      "sortByTagOfCookVideosTop5"
    ]),
    ...mapGetters("youtubers", ["getTop5Youtuber"]),
    ...mapGetters("usersPublic", ["getTop5Reviewer"]),
    ...mapGetters("tags", ["sortedTag"]),
    ...mapState("tags", ["allTags"])
  },
  methods: {
    ...mapActions("usersPublic", ["addFavoriteVTR"]),
    ...mapActions("videos", ["addNewVideoData"]),
    ...mapActions("youtubers", ["addNewYoutuberInfo"]),
    async showReviewMakeModal() {
      if (!this.loggedIn) {
        // ログインしていなかったらユーザー登録する様にDialogをだす
        this.alertToSignUp = true;
      } else if (this.loggedIn && this.$refs.VTRurl.validate()) {
        // VideoId をURLから取り出す
        let splicedURL1 = this.registerURL.split("&")[0];
        let videoId = splicedURL1.split("v=")[1];
        this.VideoId = videoId;
        // videoIdのsnippetを取ってきて、Categoryが明らかに違うものは弾くようにする。
        const res = await axios.get(
          "https://www.googleapis.com/youtube/v3/videos",
          {
            params: {
              key: "AIzaSyA7kq_sOzjdxusYJ_K3hm1d7HMAVYEGK_s",
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
          // 動画のCategoryIdをチェックしている
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
          selectedTags: [],
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
    },
    SetCookVideo(value) {
      this.cookVideoTagSort = value;
    },
    SETTagArray(payload) {
      if (payload.length > 0) {
        for (let j in payload) {
          this.TAGArray.push(payload[j]);
        }
      }
    },
    setTagArray(value) {
      // すでに配列内にある場合はその要素を外す
      if (this.tagArray.includes(value)) {
        let idx = this.tagArray.indexOf(value);
        this.tagArray.splice(idx, 1);
        let payload = this.tagArray;
        this.cookVideoTagSort = this.sortByTagOfCookVideosTop5(payload);
      } else {
        this.tagArray.push(value);
        let payload = this.tagArray;
        this.cookVideoTagSort = this.sortByTagOfCookVideosTop5(payload);
      }
    }
  },
  mounted() {},
  components: {
    ToLoginAlert: require("components/AlertModal/ToLoginAlert.vue").default,
    registerReviewModal: require("components/RegisterReviewModalTopPage/registerReviewModal.vue")
      .default,
    CookedOrWillCook: require("components/CookCheckModal/CookedOrWillCook.vue")
      .default,
    CookVideoCardTopPage: require("components/Card/CookVideoCardTopPage.vue")
      .default,
    CardYoutuber: require("components/Card/CardYoutuber.vue").default,
    ReviewerTotalPageCard: require("components/Card/ReviewerTotalPageCard.vue")
      .default,
    ChooseTagModal: require("components/ChooseTagModal/ChooseTagModal.vue")
      .default,
    ChipComponent: require("components/Chip/ChipComponent.vue").default,
    NoticeRegistered: require("components/Notice/NoticeRegistered.vue").default
  }
};
</script>

<style scoped>
.topPageImageWrapper {
  width: 100%;
  height: 430px;
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
  margin-top: 170px;
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
.tagSelectButton {
  margin-left: 20px;
}
.TopPagechooseTagModal-TagWrapper {
}
/* ------------------- */
/* 料理動画を載せるところ */
/* ------------------- */
/* ------------------- */
.cookImageWrapperTopPage {
  width: 100%;
  min-height: 430px;
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
  border-block-start: 1px solid rgba(0, 0, 0, 0.12);
}
/* height: 300px; */

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
  margin-left: 15px;
  margin-top: 3px;
}
/* .cookImageTopPageWrapper {
  margin-top: 15px;
} */
.topPageSelectBox {
  width: 200px;
}
.selectWrapper {
  height: 40px;
}
.q-field--auto-height .q-field__control {
  height: 40px;
  min-height: 40px;
}
.q-field--auto-height .q-field__control,
.q-field--auto-height .q-field__native {
  min-height: 40px;
}
.topPageSelectBox {
  height: 40px;
}
/* --------------- */
/* もっとみるボタン */
/* --------------- */
.MoreButton_wrapper {
  text-align: center;
  margin-top: 20px;
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

@media screen and (min-width: 1785px) {
  .cookImageTopPageWrapper {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 62px;
  }
  .cookImageTopPageWrapper {
    width: 1435px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 1474px) and (max-width: 1784px) {
  .cookImageTopPageWrapper {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
  }
  .cookImageTopPageWrapper {
    width: 1168px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 1114px) and (max-width: 1473px) {
  .cookImageTopPageWrapper {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
  }
  .cookImageTopPageWrapper {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 880px) and (max-width: 1113px) {
  .cookImageTopPageWrapper {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
  }
  .cookImageTopPageWrapper {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  .cookVideoCardTopPage {
    width: 32%;
    margin-right: 7px;
    margin-bottom: 7px;
    position: relative;
  }
}
@media screen and (min-width: 769px) and (max-width: 879px) {
  .cookImageTopPageWrapper {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
  }
  .cookImageTopPageWrapper {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  .cookVideoCardTopPage {
    width: 48%;
    margin-right: 7px;
    margin-bottom: 7px;
    position: relative;
  }
}
@media screen and (min-width: 500px) and (max-width: 768px) {
  .cookImageTopPageWrapper {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    max-width: 1000px;
  }
  .cookImageTopPageWrapper {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  .cookVideoCardTopPage {
    width: 48%;
    margin-right: 7px;
    margin-bottom: 7px;
    position: relative;
  }
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
@media screen and (min-width: 845px) and (max-width: 1113px) {
  .topPageYoutuberWrapper {
    width: 630px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
