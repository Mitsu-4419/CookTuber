<template>
  <div>
    <q-card class="videoReviewCard q-pa-sm">
      <div class="row" v-if="videos[reviewInfo.videoId]">
        <div class="column reviewCardLeft">
          <q-img class="MyPageThumbnail" :src="videos[reviewInfo.videoId].thumbnail"></q-img>
          <div class="videoTitleWrapperWrapper">
            <div class="videoTitleWrapper">
              <span class="videoTitle">{{videos[reviewInfo.videoId].videoTitle}}</span>
            </div>
            <div class="row videoChannelNameWrapper">
              <q-space />
              <span class="videoChannelName">{{videos[reviewInfo.videoId].channelTitle}}</span>
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
                v-for="tag in reviewInfo.tagArray"
                :key="tag"
              >{{allTags[tag].tagName}}</q-chip>
            </div>
          </div>
        </div>
        <div class="column reviewCardRight">
          <div class="column">
            <div class="reviewWrapper">{{reviewInfo.review}}</div>
            <div class="row bottomsWrapper">
              <div class="likeCountWrapper">
                <div>
                  <q-icon
                    name="fas fa-utensils"
                    size="1.9em"
                    :class="cooked == true ? 'cookActive' : 'cookNonActive'"
                  />
                  <span class="favoriteLikeNumber">{{reviewInfo.LikeArray.length}}</span>
                  <!-- <span class="favoriteNumber" style="color:black">0</span> -->
                </div>
              </div>
              <div class="likeCountWrapper row">
                <q-icon
                  name="fas fa-heart"
                  size="1.9em"
                  :class="userLike == true ? 'likeActive' : 'likeNonActive'"
                />
                <span class="favoriteLikeNumber">{{reviewInfo.LikeArray.length}}</span>
              </div>
              <div class="likeCountWrapper" v-show="userOrNot">
                <q-icon name="edit" size="1.9em" class="editIcon" @click="editReviewModal = true"></q-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- レビューの編集もだる -->
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
  </div>
</template>


<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  props: ["docId", "reviewInfo", "userOrNot"],
  data() {
    return {
      starPoint: 0,
      userLike: false,
      cooked: false,
      editReviewModal: true
    };
  },
  computed: {
    ...mapState("usersPublic", ["videos"]),
    ...mapState("tags", ["allTags"])
  },
  actions: {
    ...mapActions("usersPublic", ["changeReviewInfo"])
  },
  created() {
    // if (this.videos[this.reviewInfo.videoId]) {
    //   const starrate =
    //     this.videos[this.reviewInfo.videoId].starPoint /
    //     this.videos[this.reviewInfo.videoId].registerCount;
    //   this.starPoint = Math.round(starrate * 10) / 10;
    // }
    this.starPoint = Number(this.reviewInfo.star_number);
  },
  components: {
    editReviewInfoModal: require("components/EditCard/editReviewModal.vue")
      .default
  }
};
</script>

<style>
.videoReviewCard {
  width: 100%;
  max-width: 600px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.reviewCardLeft {
  width: 50%;
  /* background: red; */
  padding: 0;
}
.reviewCardRight {
  width: 50%;
  /* background: blue; */
}
.MyPageThumbnail {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.StarWrapper {
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  background: rgb(201, 203, 197);
}
.custom-Text {
  color: black;
  font-size: 16px;
  margin-bottom: 9px;
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
}
.videoChannelName {
  font-size: 11px;
  font-weight: bold;
}

.bottomsWrapper {
  display: flex;
  margin-top: 12px;
  width: 80%;
  margin-right: auto;
  margin-left: auto;
}
.likeCountWrapper {
  width: 30%;
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
.reviewWrapper {
  padding: 8px;
  width: 95%;
  height: 230px;
  font-size: 17px;
  margin-right: auto;
  margin-left: auto;
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
  color: #babdc2;
}
.cookNonActive {
  color: #5d5e61;
}
.likeActive {
  color: #eb5050;
}
.likeNonActive {
  color: #edafaf;
}
</style>