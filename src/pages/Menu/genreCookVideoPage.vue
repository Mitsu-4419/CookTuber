<template>
  <q-page class="q-pa-md">
    <div class="CookVideoTitleWrapper">
      <!-- ソートと検索のところSelect -->
      <div class="row q-mr-md">
        <div class="videoTitleCookPage row">
          <q-icon name="restaurant" color="grey-5" size="lg" class="q-mr-md q-ml-sm"></q-icon>
          <div class="cookVideoTitle">ジャンルで選択</div>
        </div>
        <q-select
          style="width:180px;margin-left:30px;"
          dense
          rounded
          outlined
          v-model="model"
          :options="options"
          bg-color="white"
          color="grey-5"
        />
      </div>
    </div>
    <div class="row">
      <div class="cookVideoTagWrapper column">
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedGenreTag('country'))"
            :key="tag"
            :tagName="genreTag[tag].name"
            :id="tag"
            @setActivatedTag="setTagArray"
            flag="topPage"
            pin="genre"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedGenreTag('material'))"
            :key="tag"
            :tagName="genreTag[tag].name"
            :id="tag"
            @setActivatedTag="setTagArray"
            flag="topPage"
            pin="genre"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedGenreTag('special'))"
            :key="tag"
            :tagName="genreTag[tag].name"
            :id="tag"
            @setActivatedTag="setTagArray"
            flag="topPage"
            pin="genre"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(timeTag)"
            :key="tag"
            :tagName="timeTag[tag].name"
            :id="tag"
            :TAGArray="tagTimeArray"
            @setActivatedTag="setTagArray"
            flag="topPage"
            pin="genre"
          />
        </div>
      </div>
    </div>
    <div class="CookVideoTotalWrapper row">
      <CookVideoCard
        v-for="(cookVideoDetail, key) in sortByTagOfCookVideos({genreArray:tagGenreArray, timeArray:tagTimeArray}, model)"
        :key="key"
        :id="key"
        :cookVideoDetail="cookVideoDetail"
      />
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinSortTags from "src/mixins/mixin-sortTags";
export default {
  mixins: [mixinSortTags],
  data() {
    return {
      tagArray: [],
      chooseTag: false,
      tagGenreArray: [],
      tagTimeArray: ["time1", "time2", "time3"],
      model: "星の数順",
      options: ["星の数順", "再生回数順", "レビュー数多い順"]
    };
  },
  computed: {
    ...mapState("genreTag", ["genreTag"]),
    ...mapState("timeTag", ["timeTag"]),
    ...mapGetters("genreTag", ["sortedGenreTag", "sortByTagOfCookVideos"])
  },
  components: {
    CookVideoCard: require("components/Card/CookVideoCard.vue").default,
    ChipComponent: require("components/Chip/ChipComponent.vue").default,
    ChooseTagModal: require("components/ChooseTagModal/ChooseTagModal.vue")
      .default
  }
};
</script>

<style>
.CookVideoTotalWrapper {
  margin-top: 33px;
  margin-left: 5px;
}
.CookVideoTitleWrapper {
  height: 50px;
  margin-top: 20px;
}
.videoTitleCookPage {
  padding: 5px;
}
.cookVideoTitle {
  font-size: 21px;
  font-weight: bold;
  margin-top: 5px;
}
.cookVideoTagWrapper {
  padding: 10px;
}
.cookVideoButtonWrapper {
  width: 10%;
  display: flex;
  align-items: center;
}
.selectedTag {
  color: yellow;
}
</style>