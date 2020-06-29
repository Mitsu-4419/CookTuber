<template>
  <div>
    <q-card class="videoNonCookedReviewCard q-pa-sm">
      <router-link
        :to="{
          name: 'video',
          query: { key: videoKey, pageUid: pageUserId, from: from }
        }"
        class="myCardWrapper"
      >
        <div class="row">
          <div class="column NonCookedCard">
            <q-img
              class="MyPageThumbnail"
              :src="cookVideos[videoKey].thumbnail"
            ></q-img>
            <div class="videoTitleWrapperWrapper">
              <div class="videoTitleWrapper">
                <span class="videoTitle">
                  {{ cookVideos[videoKey].videoTitle }}
                </span>
              </div>
              <div class="row videoChannelNameWrapper">
                <q-space />
                <span class="videoChannelName">
                  {{ cookVideos[videoKey].channelTitle }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top:10px;">
          <span class="timeDisplayNonCook">{{ timeBehind }}</span>
          <q-space></q-space>
          <q-icon
            v-show="userOrNot"
            name="edit"
            size="1.9em"
            class="editIconLarge"
            @click.prevent="EditReviewModal = true"
          ></q-icon>
          <q-icon
            v-show="userOrNot"
            name="edit"
            size="1.5em"
            class="editIconSmall"
            @click.prevent="EditReviewModal = true"
          ></q-icon>
        </div>
      </router-link>
    </q-card>
    <!-- レビューの編集モーダル -->
    <q-dialog v-model="EditReviewModal">
      <editReviewInfoModal
        :review="reviewInfo.review"
        :starPoint="Number(reviewInfo.star_number)"
        :channelId="reviewInfo.channelId"
        :videoId="reviewInfo.videoId"
        @closeModal="EditReviewModal = false"
        :docId="docId"
        flag="nonCooked"
      />
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
      starPoint: 0,
      userLike: false,
      cooked: false,
      EditReviewModal: false,
      videoKey: "",
      timeBehind: ""
    };
  },
  computed: {
    ...mapState("videos", ["cookVideos"])
  },
  actions: {
    ...mapActions("usersPublic", ["changeReviewInfo"])
  },
  created() {
    this.starPoint = Number(this.reviewInfo.star_number);
    this.videoKey = this.reviewInfo.videoId;
    this.timeBehind = getdiffTimeNonCook(this.reviewInfo.createdAt);
  },
  components: {
    editReviewInfoModal: require("components/EditReviewCard/editReviewModal.vue")
      .default
  }
};
</script>

<style>
.myCardWrapper {
  text-decoration: none;
  color: black;
}
.videoNonCookedReviewCard {
  width: 300px;
  max-width: 600px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.NonCookedCard {
  width: 100%;
  /* background: red; */
  padding: 0;
}
.videoTitleWrapperWrapper {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.videoTitleWrapper {
  padding: 3px;
  height: 40px;
  overflow: hidden;
}
.videoTitle {
  font-size: 12.5px;
  font-weight: bold;
}
.videoChannelNameWrapper {
  padding: 3px;
  height: 20px;
  overflow: hidden;
}
.videoChannelName {
  font-size: 11px;
  font-weight: bold;
}
.editIconLarge {
  margin-left: 4px;
  color: #5091eb;
}
.editIconSmall {
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
.tagsWrapper {
  padding: 3px;
}
.favoriteLikeNumber {
  font-family: "Russo One", sans-serif;
  font-weight: bold;
  margin-left: 5px;
  margin-top: 2px;
}
.cookActive {
  color: #fe3e4b9e;
}
.cookNonActive {
  color: #8f909395;
}
.timeDisplayNonCook {
  color: rgb(109, 108, 108);
  margin-left: 10px;
}
@media screen and (min-width: 500px) {
  .editIconSmall {
    display: none;
  }
}
@media screen and (max-width: 499px) {
  .editIconLarge {
    display: none;
  }
}

@media screen and (min-width: 500px) and (max-width: 839px) {
  .videoNonCookedReviewCard {
    width: 230px;
  }
}

@media screen and (min-width: 414px) and (max-width: 499px) {
  .videoNonCookedReviewCard {
    width: 188px;
  }
  .videoTitle {
    font-size: 11px;
  }
  .videoChannelName {
    font-size: 10px;
    margin-top: 3px;
  }
}
@media screen and (min-width: 375px) and (max-width: 413px) {
  .videoNonCookedReviewCard {
    width: 169px;
  }
  .videoTitle {
    font-size: 11px;
  }
  .videoChannelName {
    font-size: 10px;
    margin-top: 3px;
  }
  .timeDisplayNonCook {
    margin-left: 5px;
    font-size: 12px;
  }
}
</style>
