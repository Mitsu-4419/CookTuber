<template>
  <div>
    <q-card class="reviewSubmitTitleCard">
      <div class="reviewSubmitTitle">
        <q-card-section class="row reviewSubmitTitleCardSection">
          <div>お気に入り料理登録</div>
        </q-card-section>
      </div>
      <div class="SubmitStarWrapperLarge column">
        <q-slider class="starSlider" v-model="ratingModel" :min="0.1" :max="5" :step="0.1" />
        <star-rating
          v-model="ratingModel"
          :star-size="33"
          :increment="0.1"
          :padding="17"
          :glow="1"
          active-color="yellow"
          text-class="custom-text"
          class="starRating"
        ></star-rating>
      </div>
      <div class="SubmitStarWrapperSmall column">
        <q-slider class="starSlider" v-model="ratingModel" :min="0.1" :max="5" :step="0.1" />
        <star-rating
          v-model="ratingModel"
          :star-size="25"
          :increment="0.1"
          :padding="10"
          :glow="1"
          active-color="yellow"
          text-class="custom-textSmall"
          class="starRating"
        ></star-rating>
      </div>
      <q-form @submit="submitReview">
        <div class="q-pa-sm">
          <q-input
            v-model="text"
            outlined
            type="textarea"
            :rules="[val => !!val || '* 料理のReviewを入力してください']"
          />
        </div>
        <q-card-section class>投稿したレビューはマイページで確認できます</q-card-section>
        <q-card-actions align="right" class="q-mt-md">
          <q-btn color="green-13" type="submit">
            <span style="font-weight:bold;">投稿</span>
          </q-btn>
          <q-btn flat label="キャンセル" color="black" v-close-popup />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { SessionStorage } from "quasar";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: ["registerURL", "snippet"],
  data() {
    return {
      text: "",
      ratingModel: 1
    };
  },
  computed: {
    ...mapState("auth", ["userId"])
  },
  methods: {
    ...mapActions("usersPublic", ["addFavoriteVTR"]),
    ...mapActions("videos", ["addVideoData"]),
    ...mapActions("youtubers", ["addYoutuberInfo"]),
    submitReview() {
      // VideoId をURLから取り出す
      let splicedURL1 = this.registerURL.split("&")[0];
      let videoId = splicedURL1.split("v=")[1];
      this.addFavoriteVTR({
        uid: this.userId,
        review: this.text,
        favoriteVTRvideoID: videoId,
        star_number: this.ratingModel,
        snippet: this.snippet,
        cooked: true
      });
      // Video情報を更新する
      this.addVideoData({
        uid: this.userId,
        favoriteVTRvideoID: videoId,
        star_number: this.ratingModel,
        snippet: this.snippet
      });
      // Youtuber情報を更新する
      this.addYoutuberInfo({
        uid: this.userId,
        channelId: this.snippet.channelId,
        favoriteVTRvideoID: videoId,
        star_number: this.ratingModel,
        snippet: this.snippet
      });
      this.$router.push({ name: "mypage", query: { id: this.userId } });
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
  min-width: 250px;
  max-width: 300px;
  height: 60px;
  background: rgb(231, 230, 230);
}
.optionSelected {
  color: blue;
}
.tagSelectPopUp {
  height: 273px;
}
.SubmitStarWrapperSmall {
  display: flex;
  justify-content: center;
  background: rgb(109, 109, 109);
}
.custom-textSmall {
  color: yellow;
  font-size: 18px;
  margin-bottom: 3px;
}
.starSlider {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.starRating {
  margin-left: auto;
  margin-right: auto;
}
.SubmitStarWrapperLarge {
  background: rgb(109, 109, 109);
}
.SubmitStarWrapperSmall {
  background: rgb(109, 109, 109);
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
    width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 375px) and (max-width: 414px) {
  .reviewSubmitTitleCard {
    width: 330px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 300px) and (max-width: 374px) {
  .reviewSubmitTitleCard {
    width: 272px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
