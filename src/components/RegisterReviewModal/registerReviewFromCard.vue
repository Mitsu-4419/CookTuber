<template>
  <div>
    <q-card class="reviewSubmitTitleCard">
      <div class="reviewSubmitTitle">
        <q-card-section class="row reviewSubmitTitleCardSection">
          <div>お気に入り料理登録</div>
        </q-card-section>
      </div>
      <div class="SubmitStarWrapperLarge">
        <star-rating
          v-model="ratingModel"
          :star-size="33"
          :increment="0.1"
          :padding="16"
          :glow="1"
          active-color="yellow"
          text-class="custom-text"
        ></star-rating>
      </div>
      <div class="SubmitStarWrapperSmall">
        <star-rating
          v-model="ratingModel"
          :star-size="23"
          :increment="0.1"
          :padding="10"
          :glow="1"
          active-color="yellow"
          text-class="custom-textSmall"
        ></star-rating>
      </div>
      <q-form @submit="submitReviewFromCard">
        <div class="q-pa-sm">
          <q-input
            v-model="text"
            outlined
            type="textarea"
            :rules="[val => !!val || '* 料理のReviewを入力してください']"
          />
        </div>
        <q-card-section class
          >投稿したレビューはマイページで確認できます</q-card-section
        >
        <q-card-actions align="right" class="q-mt-md">
          <q-btn flat label="キャンセル" color="black" v-close-popup />
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
  props: ["videoId", "channelId"],
  data() {
    return {
      writeReview: false,
      text: "",
      ratingModel: 1
    };
  },
  computed: {
    ...mapState("tags", ["allTags"]),
    ...mapState("auth", ["userId"]),
    ...mapGetters("tags", ["sortedTag"])
  },
  methods: {
    ...mapActions("usersPublic", ["addFavoriteVTRFromCard"]),
    ...mapActions("videos", ["addVideoData"]),
    ...mapActions("youtubers", ["addYoutuberInfoFromCard"]),
    submitReviewFromCard() {
      this.addFavoriteVTRFromCard({
        uid: this.userId,
        review: this.text,
        favoriteVTRvideoID: this.videoId,
        star_number: this.ratingModel,
        channelId: this.channelId,
        cooked: true
      });
      // Video情報を更新する
      this.addVideoData({
        uid: this.userId,
        favoriteVTRvideoID: this.videoId,
        star_number: this.ratingModel
      });
      // Youtuber情報を更新する
      this.addYoutuberInfoFromCard({
        uid: this.userId,
        channelId: this.channelId,
        favoriteVTRvideoID: this.videoId,
        star_number: this.ratingModel,
        channelId: this.channelId
      });
      this.writeReview = false;
      // this.$router.push({ name: "mypage", query: { id: this.userId } });
    }
  },
  mounted() {},
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
}
.reviewSubmitTitleCardSection {
  display: flex;
  justify-content: center;
  font-size: 21px;
  font-weight: bold;
}
.SubmitStarWrapperLarge {
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
@media screen and (min-width: 500px) {
  .SubmitStarWrapperSmall {
    display: none;
  }
}
@media screen and (max-width: 499px) {
  .SubmitStarWrapperLarge {
    display: none;
  }
}
@media screen and (min-width: 414px) and (max-width: 499px) {
  .reviewSubmitTitleCard {
    width: 300px;
  }
  .custom-textSmall {
    color: yellow;
    font-size: 18px;
  }
}
</style>
