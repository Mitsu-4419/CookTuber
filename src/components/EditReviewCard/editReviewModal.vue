<template>
  <div>
    <q-card class="reviewSubmitTitleCard">
      <div class="reviewSubmitTitle">
        <q-card-section class="row reviewSubmitTitleCardSection">
          <div>お気に入り料理登録</div>
        </q-card-section>
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
        <div class="tagInputWrapper">
          <div class="tagSelectBox" clickable @click="tagSelectModal=true">
            <span>タグを選んでください（複数可）</span>
            <div class="row">
              <ChipTopPageModal v-for="tag in TAGArray" :key="tag.tagName" :tag="tag" :id="tag" />
            </div>
            <q-popup-proxy :offset="[10, 10]">
              <q-card class="tagSelectPopUp">
                <div class="row">
                  <ChipTopPageModal
                    v-for="(tag, key) in sortedTag('countryLarge')"
                    :key="key"
                    :tag="tag"
                    :id="key"
                    @setActivatedTag="setTagArray"
                  />
                </div>
                <div class="row">
                  <ChipTopPageModal
                    v-for="(tag, key) in sortedTag('materialLarge')"
                    :key="key"
                    :tag="tag"
                    :id="key"
                    @setActivatedTag="setTagArray"
                  />
                </div>
                <div class="row">
                  <ChipTopPageModal
                    v-for="(tag, key) in sortedTag('specialGenre')"
                    :key="key"
                    :tag="tag"
                    :id="key"
                    @setActivatedTag="setTagArray"
                  />
                </div>
                <div class="row">
                  <ChipTopPageModal
                    v-for="(tag, key) in sortedTag('time')"
                    :key="key"
                    :tag="tag"
                    :id="key"
                    @setActivatedTag="setTagArray"
                  />
                </div>
                <div class="row">
                  <ChipTopPageModal
                    v-for="(tag, key) in sortedTag('meatSmall')"
                    :key="key"
                    :tag="tag"
                    :id="key"
                    @setActivatedTag="setTagArray"
                  />
                </div>
                <div class="row">
                  <ChipTopPageModal
                    v-for="(tag, key) in sortedTag('fishSmall')"
                    :key="key"
                    :tag="tag"
                    :id="key"
                    @setActivatedTag="setTagArray"
                  />
                </div>
                <div class="row">
                  <ChipTopPageModal
                    v-for="(tag, key) in sortedTag('riceSmall')"
                    :key="key"
                    :tag="tag"
                    :id="key"
                    @setActivatedTag="setTagArray"
                  />
                </div>
                <div class="row">
                  <ChipTopPageModal
                    v-for="(tag, key) in sortedTag('vegetableSmall')"
                    :key="key"
                    :tag="tag"
                    :id="key"
                    @setActivatedTag="setTagArray"
                  />
                </div>
                <div class="row">
                  <ChipTopPageModal
                    v-for="(tag, key) in sortedTag('noodleSmall')"
                    :key="key"
                    :tag="tag"
                    :id="key"
                    @setActivatedTag="setTagArray"
                  />
                </div>
              </q-card>
            </q-popup-proxy>
          </div>
        </div>
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
  props: ["review", "tagArray", "starPoint", "videoId", "docId"],
  data() {
    return {
      Review: this.review,
      RatingModel: 1,
      TAGArray: [],
      tagSelectModal: false
    };
  },
  computed: {
    ...mapState("tags", ["allTags"]),
    ...mapState("auth", ["userId"]),
    ...mapGetters("tags", ["sortedTag"])
  },
  methods: {
    ...mapActions("usersPublic", ["updateFavoriteVTR"]),
    ...mapActions("tags", ["updateVideoAtTag"]),
    ...mapActions("videos", ["updateVideoData"]),
    // ...mapActions("youtubers", ["incrementFavorite"]),
    setTagArray(value) {
      // すでに配列内にある場合はその要素を外す
      if (this.TAGArray.includes(value)) {
        let idx = this.TAGArray.indexOf(value);
        this.TAGArray.splice(idx, 1);
      } else {
        this.TAGArray.push(value);
      }
    },
    submitEdittedReview() {
      // tagのValueを再びKeyに変更する
      let selectedTagArray = [];
      for (let j = 0; j < this.TAGArray.length; j++) {
        Object.keys(this.allTags).forEach(key => {
          if (this.TAGArray[j] == this.allTags[key].tagName) {
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
      this.updateVideoData({
        favoriteVTRvideoID: this.videoId,
        selectedTags: selectedTagArray,
        beforeTags: this.tagArray,
        star_number: this.RatingModel,
        beforeStarNumber: this.starPoint
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
    // Object.keys(this.allTags).forEach(key => {
    //   this.options.push(this.allTags[key].tagName);
    // });
    this.RatingModel = this.starPoint;
    for (let j = 0; j < this.tagArray.length; j++) {
      let key = this.tagArray[j];
      this.TAGArray.push(this.allTags[key].tagName);
    }
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
