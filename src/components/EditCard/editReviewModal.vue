<template>
  <div>
    <q-card class="reviewSubmitTitleCard">
      <div class="reviewSubmitTitle">
        <q-card-section class="row reviewSubmitTitleCardSection">
          <!-- <q-icon name="edit" size="md"></q-icon> -->
          <div>お気に入り料理登録</div>
        </q-card-section>
      </div>
      <div class="starWrapper">
        <!-- <q-rating v-model="ratingModel" size="2.5em" :max="5" color="color" icon-half="star_half" /> -->
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
        <div class="tagInputWrapper">
          <div class="tagSelectBox" style="min-width: 250px; max-width: 300px">
            <!-- <q-badge color="secondary" class="q-mb-md">
          Model: {{ modelMultiple || '[]' }}
            </q-badge>-->
            <q-select
              filled
              v-model="modelMultiple"
              multiple
              :options="options"
              use-chips
              stack-label
              label="タグを選んでください（複数可）"
              options-selected-class="optionSelected"
            />
          </div>
        </div>
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
  props: ["review", "tagArray", "starPoint", "videoId", "docId"],
  data() {
    return {
      Review: this.review,
      RatingModel: 1,
      modelMultiple: [],
      options: []
    };
  },
  computed: {
    ...mapState("tags", ["allTags"]),
    ...mapState("auth", ["userId"])
  },
  methods: {
    ...mapActions("usersPublic", ["updateFavoriteVTR"]),
    ...mapActions("tags", ["updateVideoAtTag"]),
    // ...mapActions("youtubers", ["incrementFavorite"]),
    submitEdittedReview() {
      // tagのValueを再びKeyに変更する
      let selectedTagArray = [];
      for (let j = 0; j < this.modelMultiple.length; j++) {
        Object.keys(this.allTags).forEach(key => {
          if (this.modelMultiple[j] == this.allTags[key].tagName) {
            selectedTagArray.push(key);
          }
        });
      }
      // VideoId をURLから取り出す
      // またVideoInfoのところで星の数値の増減を反映させないといけないため最初のstarNumberも送る
      this.updateFavoriteVTR({
        uid: this.userId,
        review: this.Review,
        favoriteVTRvideoID: this.videoId,
        selectedTags: selectedTagArray,
        beforeTags: this.tagArray,
        star_number: this.RatingModel,
        beforeStarNumber: this.starPoint,
        docId: this.docId
      });
      // tagのStateの更新をする
      // 最初に付いていたTagをremoveしなければ行けたないため、最初に付いていたTagの配列も送る
      // ここで最初に登録されていたTagから除去されたタグの配列と、加えられた配列をつくる。
      let deletedTagArray = [];
      let addedTagArray = [];
      for (let i in this.tagArray) {
        if (!selectedTagArray.includes(this.tagArray[i])) {
          deletedTagArray.push(this.tagArray[i]);
        }
      }
      for (let j in selectedTagArray) {
        if (!this.tagArray.includes(selectedTagArray[j])) {
          addedTagArray.push(selectedTagArray[j]);
        }
      }
      this.updateVideoAtTag({
        selectedTags: selectedTagArray,
        videoId: this.videoId,
        deletedTagArray: deletedTagArray,
        addedTagArray: addedTagArray
      });
      this.$emit("closeModal");
    }
  },
  created() {
    Object.keys(this.allTags).forEach(key => {
      this.options.push(this.allTags[key].tagName);
    });
    this.RatingModel = this.starPoint;
    for (let j = 0; j < this.tagArray.length; j++) {
      let key = this.tagArray[j];
      this.modelMultiple.push(this.allTags[key].tagName);
    }
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
  min-width: 490px;
}
.optionSelected {
  color: blue;
}
</style>
