<template>
  <div>
    <q-card class="videoNonCookedReviewCard q-pa-sm">
      <router-link :to="{ name: 'video', query: { key: reviewInfo.videoId} }" class="myCardWrapper">
        <div class="row" v-if="cookVideos[reviewInfo.videoId]">
          <div class="column NonCookedCard">
            <q-img class="MyPageThumbnail" :src="cookVideos[reviewInfo.videoId].thumbnail"></q-img>
            <div class="videoTitleWrapperWrapper">
              <div class="videoTitleWrapper">
                <span class="videoTitle">{{cookVideos[reviewInfo.videoId].videoTitle}}</span>
              </div>
              <div class="row videoChannelNameWrapper">
                <q-space />
                <span class="videoChannelName">{{cookVideos[reviewInfo.videoId].channelTitle}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-show="userOrNot">
          <q-space></q-space>
          <q-icon name="edit" size="1.9em" class="editIcon" @click.prevent="EditReviewModal = true"></q-icon>
        </div>
      </router-link>
    </q-card>

    <!-- レビューの編集モーダル -->
    <q-dialog v-model="EditReviewModal">
      <editReviewInfoModal
        :review="reviewInfo.review"
        :tagArray="reviewInfo.tagArray"
        :starPoint="Number(reviewInfo.star_number)"
        :videoId="reviewInfo.videoId"
        @closeModal="EditReviewModal = false"
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
      EditReviewModal: false
    };
  },
  computed: {
    ...mapState("videos", ["cookVideos"]),
    ...mapState("tags", ["allTags"])
  },
  actions: {
    ...mapActions("usersPublic", ["changeReviewInfo"])
  },
  created() {
    this.starPoint = Number(this.reviewInfo.star_number);
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
  width: 46%;
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
</style>