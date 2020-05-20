<template>
  <div>
    <q-card class="videoReviewCard q-pa-sm">
      <router-link :to="{ name: 'video', query: { key: reviewInfo.videoId} }" class="myCardWrapper">
        <div class="row" style="width:100%;height:180px;" v-if="cookVideos[reviewInfo.videoId]">
          <div class="MyPageThumbnailWrapper">
            <q-img
              class="MyPageThumbnail"
              :src="cookVideos[reviewInfo.videoId].thumbnail"
              :ratio="16/9"
            ></q-img>
          </div>
          <div class="videoTitleWrapperWrapperMypageCooked column">
            <div class="videoTitleWrapper">
              <span class="videoTitle-mypage">{{cookVideos[reviewInfo.videoId].videoTitle}}</span>
            </div>
            <div class="row videoChannelNameWrapper">
              <q-space />
              <span class="videoChannelName-Mypage">{{cookVideos[reviewInfo.videoId].channelTitle}}</span>
            </div>
            <div class="StarWrapperMypage">
              <star-rating
                :read-only="true"
                v-model="starPoint"
                :star-size="21"
                :increment="0.1"
                :padding="8"
                active-color="#ffd400"
                text-class="custom-Text"
              ></star-rating>
            </div>
            <div class="tagsWrapperMyPageCooked" v-if="reviewInfo">
              <q-chip
                size="xs"
                v-for="tag in reviewInfo.tagArray"
                :key="tag"
              >{{allTags[tag].tagName}}</q-chip>
            </div>
            <div class="row bottomsWrapper">
              <q-space></q-space>
              <div class="likeCountWrapper">
                <q-icon
                  name="fas fa-utensils"
                  size="1.3em"
                  :class="cooked == true ? 'cookActive' : 'cookNonActive'"
                  @click.prevent="ShowReviewMakeModal()"
                />
                <span class="favoriteLikeNumber">{{cookVideos[reviewInfo.videoId].registerCount}}</span>
                <!-- <span class="favoriteNumber" style="color:black">0</span> -->
              </div>
              <div class="likeCountWrapper row">
                <q-icon
                  name="fas fa-thumbs-up"
                  size="1.3em"
                  :class="userLike == true ? 'likeActive' : 'likeNonActive'"
                  @click.prevent="addDecreaseLike()"
                />
                <span class="favoriteLikeNumber">{{reviewInfo.LikeArray.length}}</span>
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

        <div class="reviewWrapperMyPage">
          <div class="reviewMyPageCooked">{{reviewInfo.review}}</div>
          <div class="row">
            <q-space></q-space>
            <span class="timeDiplayCookedCard">{{timeBehind}}</span>
          </div>
        </div>
      </router-link>
    </q-card>

    <!-- レビューの編集モーダル -->
    <q-dialog v-model="editReviewModal">
      <editReviewInfoModal
        :review="reviewInfo.review"
        :tagArray="reviewInfo.tagArray"
        :starPoint="Number(reviewInfo.star_number)"
        :videoId="reviewInfo.videoId"
        @closeModal="editReviewModal = false"
        :docId="docId"
      />
    </q-dialog>
    <!-- 料理を作ったのか、これからつくるかのModal -->
    <q-dialog v-model="cookedOrWillCook" persistent>
      <CookedOrWillCook @setMadeOrNot="SetMadeOrNot" />
    </q-dialog>
    <!-- レビューをかく促すDialog -->
    <q-dialog v-model="reviewSubmit">
      <registerReviewFromCard :videoId="reviewInfo.videoId" :channelId="reviewInfo.channelId" />
    </q-dialog>
    <!-- ユーザー登録をする様に促すDialog -->
    <q-dialog v-model="alertToSignUp">
      <ToLoginAlert />
    </q-dialog>
  </div>
</template>


<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { getdiffTimeNonCook } from "src/functions/getdiffTimeNonCook";
export default {
  props: ["docId", "reviewInfo", "userOrNot"],
  data() {
    return {
      starPoint: 0,
      userLike: false,
      cooked: false,
      editReviewModal: false,
      cookedOrWillCook: false,
      SETMadeOrNot: false,
      reviewSubmit: false,
      alertToSignUp: false,
      timeBehind: ""
    };
  },
  computed: {
    ...mapState("videos", ["cookVideos"]),
    ...mapState("tags", ["allTags"]),
    ...mapState("auth", ["userId", "loggedIn"])
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
      if (this.userLike == true) {
        let payload = {
          docId: this.docId,
          reviewerUID: this.reviewInfo.uid,
          loginUID: this.userId
        };
        this.userLike = false;
        this.LikeNumbers--;
        this.decreaseLike(payload);
      } else if (this.userLike == false) {
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
      if (this.reviewInfo.uid == this.userId) {
        this.cooked = true;
      } else {
        this.cooked = false;
      }
    },
    ShowReviewMakeModal() {
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
          favoriteVTRvideoID: this.reviewInfo.videoId,
          selectedTags: [],
          star_number: 0,
          channelId: this.reviewInfo.channelId,
          cooked: false,
          docId: this.docId
        });
        // this.addNewVideoData({
        //   uid: this.userId,
        //   favoriteVTRvideoID: this.reviewInfo.videoId,
        //   snippet: this.Snippet
        // });
        // this.addNewYoutuberInfo({
        //   uid: this.userId,
        //   channelId: this.Snippet.channelId,
        //   favoriteVTRvideoID: this.VideoId,
        //   snippet: this.Snippet
        // });
      }
    }
  },
  created() {
    this.starPoint = Number(this.reviewInfo.star_number);
    this.checkIfUserLikeOrNot();
    this.checkIfUserWroteReviewOrNot();
    this.timeBehind = getdiffTimeNonCook(this.reviewInfo.createdAt);
  },
  components: {
    ToLoginAlert: require("components/AlertModal/ToLoginAlert.vue").default,
    editReviewInfoModal: require("components/EditReviewCard/editReviewModal.vue")
      .default,
    CookedOrWillCook: require("components/CookCheckModal/CookedOrWillCook.vue")
      .default,
    registerReviewFromCard: require("components/RegisterReviewModal/registerReviewFromCard.vue")
      .default
  }
};
</script>

<style>
.myCardWrapper {
  text-decoration: none;
  color: black;
}
.videoReviewCard {
  width: 476px;
  height: 285px;
  /* max-width: 600px; */
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
  width: 22%;
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
  width: 95%;
  height: 85px;
  font-size: 14px;
  margin-right: auto;
  margin-left: auto;
  background: rgb(242, 241, 241);
}
.reviewMyPageCooked {
  height: 55px;
  width: 100%;
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
  font-size: 11px;
}
.cookActive {
  color: #e54cfcc8;
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
.timeDiplayCookedCard {
  font-size: 12px;
  color: #5d5e61;
}
@media screen and (min-width: 768px) and (max-width: 1184px) {
  .reviewCardRight {
    width: 188px;
    height: 275px；;
  }
  .videoReviewCard {
    width: 434px;
  }
}
@media screen and (min-width: 400px) and (max-width: 767px) {
  .reviewCardRight {
    width: 240px;
    height: 275px；;
  }
  .videoReviewCard {
    width: 500px;
  }
}
</style>