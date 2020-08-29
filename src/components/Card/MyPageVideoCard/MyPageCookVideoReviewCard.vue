<template>
  <div>
    <q-card class="videoReviewCard q-pa-sm">
      <router-link
        :to="{
          name: 'video',
          query: { key: reviewInfo.videoId, pageUid: pageUserId, from: from }
        }"
        class="myCardWrapper"
      >
        <div class="row" style="width:100%;height:138px;" v-if="cookVideos[reviewInfo.videoId]">
          <div class="MyPageThumbnailWrapper">
            <q-img
              class="MyPageThumbnail"
              :src="cookVideos[reviewInfo.videoId].thumbnail"
              :ratio="16 / 9"
            ></q-img>
          </div>
          <div class="videoTitleWrapperWrapperMypageCooked column">
            <div style="margin-top:auto;margin-bottom:auto;">
              <div class="videoTitleWrapper">
                <span class="videoTitle-mypage">
                  {{
                  cookVideos[reviewInfo.videoId].videoTitle
                  }}
                </span>
              </div>
              <div class="row videoChannelNameWrapper">
                <q-space />
                <span class="videoChannelName-Mypage">
                  {{
                  cookVideos[reviewInfo.videoId].channelTitle
                  }}
                </span>
              </div>
              <div class="StarWrapperMypage mypage-starRating-large">
                <star-rating
                  :read-only="true"
                  :rating="reviewInfo.star_number"
                  :star-size="21"
                  :increment="0.1"
                  :padding="8"
                  active-color="#ffd400"
                  text-class="custom-Text"
                ></star-rating>
              </div>
              <div class="StarWrapperMypage mypage-starRating-small">
                <star-rating
                  :read-only="true"
                  :rating="reviewInfo.star_number"
                  :star-size="18"
                  :increment="0.1"
                  :padding="4"
                  active-color="#ffd400"
                  text-class="custom-Text"
                ></star-rating>
              </div>
              <div class="row bottomsWrapper">
                <q-space></q-space>
                <div class="likeCountWrapper row">
                  <q-icon
                    name="fas fa-utensils"
                    size="1.3em"
                    :class="cooked == true ? 'cookActive' : 'cookNonActive'"
                    @click.prevent="ShowReviewMakeModal()"
                  />
                  <span class="favoriteLikeNumber">
                    {{
                    cookVideos[reviewInfo.videoId].registerCount
                    }}
                  </span>
                </div>
                <div class="likeCountWrapper row">
                  <q-icon
                    name="fas fa-thumbs-up"
                    size="1.3em"
                    :class="userLike == true ? 'likeActive' : 'likeNonActive'"
                    @click.prevent="addDecreaseLike()"
                  />
                  <span class="favoriteLikeNumber">
                    {{
                    reviewInfo.LikeArray.length
                    }}
                  </span>
                </div>
                <div class="editButtontWrapper" v-show="userOrNot">
                  <q-icon
                    name="edit"
                    size="1.3em"
                    class="editIcon"
                    @click.prevent="editReviewModal = true"
                  ></q-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="reviewWrapperMyPage">
          <div class="reviewMyPageCooked">{{ reviewInfo.review }}</div>
          <div class="row">
            <q-space></q-space>
            <span class="timeDiplayCookedCard">{{ timeBehind }}</span>
          </div>
        </div>
      </router-link>
    </q-card>

    <!-- レビューの編集モーダル -->
    <q-dialog v-model="editReviewModal">
      <editReviewInfoModal
        :review="reviewInfo.review"
        :channelId="reviewInfo.channelId"
        :starPoint="Number(reviewInfo.star_number)"
        :videoId="reviewInfo.videoId"
        @closeModal="editReviewModal = false"
        :docId="docId"
        flag="cooked"
      />
    </q-dialog>
    <!-- 料理を作ったのか、これからつくるかのModal -->
    <q-dialog v-model="cookedOrWillCook" persistent>
      <CookedOrWillCook @setMadeOrNot="SetMadeOrNot" />
    </q-dialog>
    <!-- レビューをかく促すDialog -->
    <q-dialog v-model="reviewSubmit">
      <registerReviewFromCard
        :videoId="reviewInfo.videoId"
        :channelId="reviewInfo.channelId"
        @closeRegiModal="
          reviewSubmit = false;
          cooked = true;
        "
      />
    </q-dialog>
    <!-- ユーザー登録をする様に促すDialog -->
    <q-dialog v-model="alertToSignUp">
      <ToLoginAlert />
    </q-dialog>
    <!-- 登録すみのビデオであることの通知 -->
    <q-dialog v-model="doubleRegistered">
      <doubleRegistered />
    </q-dialog>
    <!-- 料理を後でつくるに登録しましたのModal -->
    <q-dialog v-model="noticeRegistered" persistent>
      <NoticeRegistered :userId="userId" />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { getdiffTimeNonCook } from "src/functions/getdiffTimeNonCook";
export default {
  props: ["docId", "reviewInfo", "userOrNot", "pageUserId", "from"],
  data() {
    return {
      userLike: false,
      cooked: false,
      editReviewModal: false,
      cookedOrWillCook: false,
      SETMadeOrNot: false,
      reviewSubmit: false,
      alertToSignUp: false,
      timeBehind: "",
      doubleRegistered: false,
      noticeRegistered: false
    };
  },
  computed: {
    ...mapState("videos", ["cookVideos"]),
    ...mapState("tags", ["allTags"]),
    ...mapState("auth", ["userId", "loggedIn"]),
    ...mapState("usersPublic", ["usersPublicInfo"])
  },
  methods: {
    ...mapActions("usersPublic", [
      "changeReviewInfo",
      "increaseLike",
      "decreaseLike",
      "addFavoriteVTRFromCard"
    ]),
    ...mapActions("videos", ["addNewVideoData"]),
    ...mapActions("youtubers", ["addNewYoutuberInfo"]),
    // ユーザーがすでにいいねしているかどうかのチェック
    checkIfUserLikeOrNot() {
      let loginUid = this.userId;
      if (
        this.reviewInfo.LikeArray &&
        this.reviewInfo.LikeArray.includes(loginUid)
      ) {
        this.userLike = true;
      } else {
        this.userLike = false;
      }
    },
    // // いいねの数の増減をする
    addDecreaseLike() {
      // ここのUidはレビューを書いた人のId
      if (this.loggedIn == false) {
        this.alertToSignUp = true;
      } else if (this.loggedIn == true && this.userLike == true) {
        let payload = {
          docId: this.docId,
          reviewerUID: this.reviewInfo.uid,
          loginUID: this.userId
        };
        this.userLike = false;
        this.LikeNumbers--;
        this.decreaseLike(payload);
      } else if (this.loggedIn == true && this.userLike == false) {
        let payload = {
          docId: this.docId,
          reviewerUID: this.reviewInfo.uid,
          loginUID: this.userId
        };
        this.userLike = true;
        this.LikeNumbers++;
        this.increaseLike(payload);
      }
    },
    // ユーザーがすでにレビューを書いているかどうかのチェック
    checkIfUserWroteReviewOrNot() {
      const usersRegisteredVideoArray = Object.values(
        this.usersPublicInfo[this.userId].favoriteVTRObj
      );
      let cookedFlag = false;
      for (let j in usersRegisteredVideoArray) {
        if (usersRegisteredVideoArray[j].videoId == this.reviewInfo.videoId) {
          cookedFlag = true;
        }
      }
      if (this.reviewInfo.uid == this.userId) {
        this.cooked = true;
      } else if (cookedFlag) {
        this.cooked = true;
      } else {
        this.cooked = false;
      }
    },
    ShowReviewMakeModal() {
      if (!this.loggedIn) {
        // ログインしていなかったらユーザー登録する様にDialogをだす
        this.alertToSignUp = true;
      } else if (this.loggedIn && !this.cooked) {
        this.cookedOrWillCook = true;
      }
    },
    // レビューを書くのか、ただブックマークするのかのチェック
    SetMadeOrNot(value) {
      this.SETMadeOrNot = value;
      this.cookedOrWillCook = false;
      let usersRegisteredVideoArray = Object.values(
        this.usersPublicInfo[this.userId].favoriteVTRObj
      );
      let registeredOrNot = false;
      for (let i in usersRegisteredVideoArray) {
        if (usersRegisteredVideoArray[i].videoId == this.reviewInfo.videoId) {
          registeredOrNot = true;
        }
      }
      if (registeredOrNot == true) {
        this.doubleRegistered = true;
      } else {
        if (value == true) {
          this.reviewSubmit = true;
        } else {
          this.addFavoriteVTRFromCard({
            uid: this.userId,
            review: "",
            favoriteVTRvideoID: this.reviewInfo.videoId,
            selectedTags: [],
            star_number: 0,
            channelId: this.reviewInfo.channelId,
            cooked: false,
            docId: this.docId
          });
          this.noticeRegistered = true;
        }
      }
    }
  },
  created() {
    // this.starPoint = Number(this.reviewInfo.star_number);
    this.checkIfUserLikeOrNot();
    this.checkIfUserWroteReviewOrNot();
    this.timeBehind = getdiffTimeNonCook(this.reviewInfo.createdAt);
  },
  components: {
    ToLoginAlert: require("components/Modals/ToLoginAlert.vue").default,
    editReviewInfoModal: require("components/Modals/editReviewModal.vue")
      .default,
    CookedOrWillCook: require("components/Modals/CookedOrWillCook.vue")
      .default,
    registerReviewFromCard: require("components/Modals/registerReviewFromCard.vue")
      .default,
    doubleRegistered: require("components/Notice/doubleRegistered.vue")
      .default,
    NoticeRegistered: require("components/Notice/NoticeRegistered.vue").default
  }
};
</script>

<style lang="scss">
.myCardWrapper {
  text-decoration: none;
  color: black;
}
.videoReviewCard {
  height: 245px;
  width: 434px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.MyPageThumbnailWrapper {
  width: 50%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
}
.MyPageThumbnail {
  background-size: contain;
}
.StarWrapperMypage {
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
  display: flex;
  justify-content: center;
}
.custom-Text {
  color: black;
  font-size: 16px;
  margin-bottom: 9px;
}
.videoTitleWrapperWrapperMypageCooked {
  width: 48%;
  margin-left: auto;
  margin-right: auto;
  .cookActive {
    color: #faa851c8;
  }
  .cookNonActive {
    color: #5d5e61;
  }
  .likeActive {
    color: rgb(55, 114, 216);
  }
  .likeNonActive {
    color: rgb(210, 210, 210);
  }
}
.videoTitleWrapper {
  padding: 3px;
  height: 40px;
  overflow: hidden;
}
.videoTitle-mypage {
  font-size: 12.5px;
  font-weight: bold;
}
.videoChannelNameWrapper {
  padding: 3px;
  height: 20px;
  overflow: hidden;
}
.videoChannelName-Mypage {
  font-size: 11px;
  font-weight: bold;
  margin-top: 4px;
  color: rgb(121, 118, 118);
}
.bottomsWrapper {
  /* display: flex; */
  margin-top: 8px;
  width: 90%;
  margin-right: auto;
  margin-left: auto;
}
.likeCountWrapper {
  width: 24%;
  margin-left: 10px;
}
.editButtontWrapper {
  margin-left: -4px;
}
.likeNumber {
  margin-left: 10px;
  font-weight: bold;
  font-family: "Russo One", sans-serif;
  margin-right: 16px;
}
.editIcon {
  margin-left: 4px;
  color: #5091eb;
}
.badgeCSS {
  font-weight: bold;
  margin-right: 10px;
  margin-top: 3px;
}
.favoriteCountWrapper {
  /* background: red; */
  z-index: 10;
}
.starPointWrapper {
  display: flex;
  justify-content: center;
  height: 50px;
}
.reviewWrapperMyPage {
  padding: 5px;
  width: 100%;
  height: 89px;
  font-size: 14px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 5px;
  background: rgb(245, 243, 243);
}
.reviewMyPageCooked {
  height: 55px;
  width: 100%;
  padding: 5px;
}
.tagsWrapperMyPageCooked {
  padding-left: 3px;
  padding-right: 3px;
  height: 40px;
}
.favoriteLikeNumber {
  font-family: "Russo One", sans-serif;
  font-weight: bold;
  margin-left: 5px;
  margin-top: 2px;
  font-size: 12px;
}

.timeDiplayCookedCard {
  font-size: 12px;
  color: #5d5e61;
}
@media screen and (min-width: 1125px) and (max-width: 1184px) {
  .reviewCardRight {
    width: 188px;
    height: 275px；;
  }
  .videoReviewCard {
    width: 434px;
  }
}
@media screen and (min-width: 1125px) {
  .mypage-starRating-small {
    display: none;
  }
}
@media screen and (min-width: 1000px) and (max-width: 1124px) {
  .reviewCardRight {
    width: 240px;
    height: 275px；;
  }
  .videoReviewCard {
    width: 380px;
  }
  .mypage-starRating-large {
    display: none;
  }
}
@media screen and (min-width: 769px) and (max-width: 999px) {
  .reviewCardRight {
    width: 240px;
    height: 275px；;
  }
  .videoReviewCard {
    width: 500px;
  }
  .mypage-starRating-small {
    display: none;
  }
}
@media screen and (min-width: 500px) and (max-width: 768px) {
  .reviewCardRight {
    width: 240px;
    height: 275px；;
  }
  .videoReviewCard {
    width: 480px;
  }
  .mypage-starRating-small {
    display: none;
  }
}
@media screen and (max-width: 499px) {
  .mypage-starRating-large {
    display: none;
  }
}

@media screen and (min-width: 414px) and (max-width: 499px) {
  .videoReviewCard {
    width: 395px;
  }
}
@media screen and (min-width: 375px) and (max-width: 413px) {
  .videoReviewCard {
    width: 356px;
  }
}
</style>
