<template>
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
        v-model="ratingModel"
        :star-size="33"
        :increment="0.1"
        :padding="16"
        :glow="1"
        active-color="yellow"
        text-class="custom-text"
      ></star-rating>
    </div>
    <div class="q-pa-sm">
      <q-input
        v-model="text"
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
        />
      </div>
    </div>
    <q-card-section class>投稿したレビューはマイページで確認できます</q-card-section>
    <q-card-actions align="right" class="q-mt-md">
      <q-btn color="green-13" @click.prevent="submitReview">
        <span style="font-weight:bold;">投稿</span>
      </q-btn>
      <q-btn flat label="キャンセル" color="black" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script>
import { SessionStorage } from "quasar";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: ["registerURL"],
  data() {
    return {
      writeReview: false,
      text: "",
      ratingModel: 1,
      modelMultiple: [],
      options: []
    };
  },
  computed: {
    ...mapState("tags", ["allTags"]),
    ...mapState("auth", ["userId"])
  },
  methods: {
    ...mapActions("usersPublic", ["addFavoriteVTR"]),
    // ...mapActions("youtubers", ["incrementFavorite"]),
    submitReview() {
      // tagのValueを再びKeyに変更する
      let tagArray = [];
      for (let j = 0; j < this.modelMultiple.length; j++) {
        Object.keys(this.allTags["allTags"]).forEach(key => {
          if (this.modelMultiple[j] == this.allTags["allTags"][key]) {
            tagArray.push(key);
          }
        });
      }
      console.log(tagArray);
      // URLからvideoIDだけを取り出す
      let splicedURL1 = this.registerURL.split("&")[0];
      let videoId = splicedURL1.split("v=")[1];
      console.log(videoId);
      this.addFavoriteVTR({
        uid: this.userId,
        review: this.text,
        favoriteVTRvideoID: videoId,
        selectedTags: tagArray,
        star_number: this.ratingModel
      });
      this.writeReview = false;
      this.$router.push({ name: "mypage", params: { id: this.userId } });
    }
  },
  mounted() {
    Object.keys(this.allTags["allTags"]).forEach(key => {
      this.options.push(this.allTags["allTags"][key]);
    });
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
</style>
