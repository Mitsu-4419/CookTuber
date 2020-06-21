<template>
  <div>
    <q-card class="reviewSubmitTitleCard">
      <div class="reviewSubmitTitle">
        <q-card-section class="row reviewSubmitTitleCardSection">
          <div>お気に入り料理登録</div>
        </q-card-section>
        <q-btn
          flat
          color="black"
          size="12px"
          v-close-popup
          icon="clear"
          class="clearButtonReviewCard"
        />
      </div>
      <div class="starWrapper">
        <star-rating
          v-model="RatingModel"
          :star-size="33"
          :increment="0.1"
          :padding="16"
          :glow="1"
          active-color="yellow"
          text-class="custom-text"
        ></star-rating>
      </div>
      <q-form @submit="submitEdittedReview">
        <div class="q-pa-sm">
          <q-input
            v-model="Review"
            outlined
            type="textarea"
            :rules="[val => !!val || '* 料理のReviewを入力してください']"
          />
        </div>
        <q-card-actions align="right" class="q-mt-md">
          <q-btn
            label="削除"
            color="red"
            @click="deleteReview"
            style="width:100px;font-weight:bold;"
          />
          <q-btn
            style="width:100px;font-weight:bold; background-color:#ff9933;color:white;"
            type="submit"
          >
            <span style="font-weight:bold;">投稿</span>
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { SessionStorage } from "quasar";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: ["review", "starPoint", "videoId", "docId", "flag"],
  data() {
    return {
      Review: this.review,
      RatingModel: 1
    };
  },
  computed: {
    ...mapState("tags", ["allTags"]),
    ...mapState("auth", ["userId"]),
    ...mapGetters("tags", ["sortedTag"])
  },
  methods: {
    ...mapActions("usersPublic", ["updateFavoriteVTR", "deleteFavoriteVTR"]),
    ...mapActions("videos", ["updateVideoData", "deleteVideoData"]),
    deleteReview() {
      console.log(this.videoId);
      if (this.flag == "cooked") {
        this.deleteVideoData({
          favoriteVTRvideoID: this.videoId,
          star_number: this.RatingModel
        });
      }
      this.deleteFavoriteVTR({
        uid: this.userId,
        docId: this.docId
      });
    },
    submitEdittedReview() {
      this.updateFavoriteVTR({
        uid: this.userId,
        review: this.Review,
        favoriteVTRvideoID: this.videoId,
        star_number: this.RatingModel,
        beforeStarNumber: this.starPoint,
        docId: this.docId
      });
      this.updateVideoData({
        favoriteVTRvideoID: this.videoId,
        star_number: this.RatingModel,
        beforeStarNumber: this.starPoint
      });
      this.$emit("closeModal");
    }
  },
  created() {
    this.RatingModel = this.starPoint;
  },
  components: {
    ChipTopPageModal: require("components/Chip/ChipTopPageModal.vue").default
  }
};
</script>

<style>
.reviewSubmitTitleCard {
  width: 500px;
}
.reviewSubmitTitle {
  background: #f7f3e8;
  position: relative;
}
.clearButtonReviewCard {
  position: absolute;
  top: 15px;
  right: 10px;
}
.reviewSubmitTitleCardSection {
  display: flex;
  justify-content: center;
  font-size: 21px;
  font-weight: bold;
}
.starWrapper {
  display: flex;
  justify-content: center;
  background: rgb(109, 109, 109);
}
.custom-text {
  color: yellow;
  font-size: 21px;
}
.q-textarea .q-field__native {
  min-height: 220px;
}
.tagInputWrapper {
  width: 97%;
  margin-right: auto;
  margin-left: auto;
  margin-top: -7px;
}
.tagSelectBox {
  min-width: 490px;
}
.optionSelected {
  color: blue;
}
</style>
