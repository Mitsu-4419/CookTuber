<template>
  <q-page class="q-pa-md">
    <div class="CookVideoTitleWrapper">
      <!-- ソートと検索のところSelect -->
      <div class="row q-mr-md">
        <div class="videoTitleCookPage row">
          <q-icon name="fas fa-carrot" color="grey-14" size="md" class="q-mr-md q-ml-sm"></q-icon>
          <div class="cookVideoTitle">材料で選ぶ</div>
        </div>
        <q-select
          class="genrePageFirstSelect"
          dense
          rounded
          outlined
          v-model="materialModel"
          :options="optionsMaterial"
          bg-color="white"
          color="grey-5"
        />
      </div>
    </div>
    <div class="row">
      <div class="cookVideoTagWrapper column">
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedMaterialTag('vegetable'))"
            :key="tag"
            :tagName="materialTag[tag].name"
            :id="tag"
            @setActivatedTag="setMaterialTag"
            flag="topPage"
            ref="menuchip"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedMaterialTag('meat'))"
            :key="tag"
            :tagName="materialTag[tag].name"
            :id="tag"
            @setActivatedTag="setMaterialTag"
            flag="topPage"
            ref="menuchip"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedMaterialTag('rice'))"
            :key="tag"
            :tagName="materialTag[tag].name"
            :id="tag"
            @setActivatedTag="setMaterialTag"
            flag="topPage"
            ref="menuchip"
          />
          <ChipComponent
            v-for="tag in Object.keys(sortedMaterialTag('noodle'))"
            :key="tag"
            :tagName="materialTag[tag].name"
            :id="tag"
            @setActivatedTag="setMaterialTag"
            flag="topPage"
            ref="menuchip"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedMaterialTag('fish'))"
            :key="tag"
            :tagName="materialTag[tag].name"
            :id="tag"
            @setActivatedTag="setMaterialTag"
            flag="topPage"
            ref="menuchip"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedMaterialTag('alcohol'))"
            :key="tag"
            :tagName="materialTag[tag].name"
            :id="tag"
            @setActivatedTag="setMaterialTag"
            flag="topPage"
            ref="menuchip"
          />
          <ChipComponent
            v-for="tag in Object.keys(sortedMaterialTag('wheat'))"
            :key="tag"
            :tagName="materialTag[tag].name"
            :id="tag"
            @setActivatedTag="setMaterialTag"
            flag="topPage"
            ref="menuchip"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedMaterialTag('seasoning'))"
            :key="tag"
            :tagName="materialTag[tag].name"
            :id="tag"
            @setActivatedTag="setMaterialTag"
            flag="topPage"
            ref="menuchip"
          />
        </div>
      </div>
    </div>
    <div class="row CookVideoTotalWrapper">
      <CookVideoCard
        v-for="(cookVideoDetail, key) in materialSelectedVideo(
          { materialArray: tagMaterialArray, timeArray: tagMaterialTimeArray },
          materialModel
        )"
        :key="key"
        :id="key"
        :videoId="key"
        :cookVideoDetail="cookVideoDetail"
        from="materialPage"
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
      tagMaterialArray: [],
      tagMaterialTimeArray: [],
      chooseTag: false,
      materialModel: "星の数順",
      optionsMaterial: [
        "星の数順",
        "再生回数順",
        "レビュー数多い順",
        "投稿日が最近順"
      ]
    };
  },
  computed: {
    ...mapState("materialTag", ["materialTag"]),
    ...mapGetters("materialTag", ["materialSelectedVideo", "sortedMaterialTag"])
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
  /* background: red; */
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
  /* background: blue; */
  /* height: 116px; */
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
