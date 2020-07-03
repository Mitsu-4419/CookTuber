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
          class="genrePageFirstSelect"
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
        v-for="(cookVideoDetail, key) in sortByTagOfCookVideos(
          { genreArray: tagGenreArray, timeArray: tagTimeArray },
          model
        )"
        :key="key"
        :id="key"
        :cookVideoDetail="cookVideoDetail"
        from="genrePage"
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
      options: ["星の数順", "再生回数順", "レビュー数多い順", "投稿日が最近順"]
    };
  },
  computed: {
    ...mapState("genreTag", ["genreTag"]),
    ...mapState("timeTag", ["timeTag"]),
    ...mapGetters("genreTag", ["sortedGenreTag", "sortByTagOfCookVideos"])
  },
  components: {
    CookVideoCard: require("components/Card/CookVideoCard.vue").default,
    ChipComponent: require("components/Chip/ChipComponent.vue").default
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
.genrePageFirstSelect {
  width: 180px;
  margin-left: 30px;
}
@media screen and (min-width: 414px) and (max-width: 499px) {
  .genrePageFirstSelect {
    width: 140px;
    margin-left: 10px;
  }
  .CookVideoTitleWrapper {
    height: 50px;
    margin-top: 0px;
  }
}
@media screen and (min-width: 300px) and (max-width: 413px) {
  .genrePageFirstSelect {
    width: 140px;
    margin-left: 8px;
  }
  .CookVideoTitleWrapper {
    height: 50px;
    margin-top: 0px;
  }
  .cookVideoTitle {
    font-size: 16px;
  }
}
</style>
