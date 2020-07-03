<template>
  <div>
    <q-card class="reviewSubmitTitleCardFromCard">
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
      <div class="starWrapperLarge">
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
      <div class="starWrapperSmall">
        <star-rating
          v-model="RatingModel"
          :star-size="25"
          :increment="0.1"
          :padding="10"
          :glow="1"
          active-color="yellow"
          text-class="custom-textSmall"
        ></star-rating>
      </div>
      <q-form @submit="submitEdittedReview">
        <div class="q-pa-sm reviewTextfield">
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
  props: ["review", "starPoint", "videoId", "docId", "flag", "channelId"],
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
    ...mapActions("youtubers", [
      "reduceYoutuberData",
      "addYoutuberInfoFromCard"
    ]),
    deleteReview() {
      if (this.flag == "cooked") {
        this.deleteVideoData({
          favoriteVTRvideoID: this.videoId,
          star_number: this.starPoint
        });
        this.reduceYoutuberData({
          star_number: this.starPoint,
          channelId: this.channelId
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
      this.addYoutuberInfoFromCard({
        star_number: this.RatingModel,
        channelId: this.channelId
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

<style lang="scss">
.reviewSubmitTitleCardFromCard {
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
.starWrapperLarge {
  display: flex;
  justify-content: center;
  background: rgb(109, 109, 109);
}
.starWrapperSmall {
  display: flex;
  justify-content: center;
  background: rgb(109, 109, 109);
}
.custom-text {
  color: yellow;
  font-size: 21px;
}
.custom-textSmall {
  color: yellow;
  font-size: 18px;
  margin-bottom: 3px;
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
@media screen and (min-width: 500px) and (max-width: 580px) {
  .reviewSubmitTitleCardFromCard {
    width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (max-width: 499px) {
  .starWrapperLarge {
    display: none;
  }
  .clearButtonReviewCard {
    position: absolute;
    top: 15px;
    right: 0px;
  }
}
@media screen and (min-width: 500px) {
  .starWrapperSmall {
    display: none;
  }
}
@media screen and (min-width: 414px) and (max-width: 499px) {
  .reviewSubmitTitleCardFromCard {
    width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 375px) and (max-width: 414px) {
  .reviewSubmitTitleCardFromCard {
    width: 330px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 300px) and (max-width: 374px) {
  .reviewSubmitTitleCardFromCard {
    width: 272px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
