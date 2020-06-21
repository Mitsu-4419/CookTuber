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
          v-model="ratingModel"
          :star-size="33"
          :increment="0.1"
          :padding="16"
          :glow="1"
          active-color="yellow"
          text-class="custom-text"
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
        <!-- <div class="tagInputWrapper">
          <div class="tagSelectBox" clickable @click="tagSelectModal=true">
            <span>タグを選んでください（複数可）</span>
            <div class="row">
              <ChipTopPageModal v-for="tag in tagArray" :key="tag.tagName" :tag="tag" :id="tag" />
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
        </div>-->
        <q-card-section class>投稿したレビューはマイページで確認できます</q-card-section>
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
      // tagArray: [],
      // tagSelectModal: false
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
    // ...mapActions("youtubers", ["incrementFavorite"]),
    // setTagArray(value) {
    //   // すでに配列内にある場合はその要素を外す
    //   if (this.tagArray.includes(value)) {
    //     let idx = this.tagArray.indexOf(value);
    //     this.tagArray.splice(idx, 1);
    //   } else {
    //     this.tagArray.push(value);
    //   }
    // },
    submitReviewFromCard() {
      // // tagのValueを再びKeyに変更する
      // let TagArray = [];
      // for (let j = 0; j < this.tagArray.length; j++) {
      //   Object.keys(this.allTags).forEach(key => {
      //     if (this.tagArray[j] == this.allTags[key].tagName) {
      //       TagArray.push(key);
      //     }
      //   });
      // }
      // console.log(TagArray);
      // VideoId をURLから取り出す
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
  mounted() {
    // if (this.allTags) {
    //   Object.keys(this.allTags).forEach(key => {
    //     this.options.push(this.allTags[key].tagName);
    //   });
    // }
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
