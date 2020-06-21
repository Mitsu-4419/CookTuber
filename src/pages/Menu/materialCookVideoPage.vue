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
          style="width:180px;margin-left:30px;"
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
            v-for="tag in Object.keys( sortedMaterialTag('meat'))"
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
            v-for="tag in Object.keys( sortedMaterialTag('rice'))"
            :key="tag"
            :tagName="materialTag[tag].name"
            :id="tag"
            @setActivatedTag="setMaterialTag"
            flag="topPage"
            ref="menuchip"
          />
          <ChipComponent
            v-for="tag in Object.keys( sortedMaterialTag('noodle'))"
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
            v-for="tag in Object.keys( sortedMaterialTag('fish'))"
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
            v-for="tag in Object.keys( sortedMaterialTag('alcohol'))"
            :key="tag"
            :tagName="materialTag[tag].name"
            :id="tag"
            @setActivatedTag="setMaterialTag"
            flag="topPage"
            ref="menuchip"
          />
          <ChipComponent
            v-for="tag in Object.keys( sortedMaterialTag('wheat'))"
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
            v-for="tag in Object.keys( sortedMaterialTag('seasoning'))"
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
        v-for="(cookVideoDetail, key) in materialSelectedVideo({materialArray:tagMaterialArray, timeArray:tagMaterialTimeArray}, materialModel)"
        :key="key"
        :id="key"
        :videoId="key"
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
      tagMaterialArray: [],
      tagMaterialTimeArray: [],
      chooseTag: false,
      materialModel: "星の数順",
      optionsMaterial: ["星の数順", "再生回数順", "レビュー数多い順"]
    };
  },
  computed: {
    ...mapState("materialTag", ["materialTag"]),
    ...mapGetters("materialTag", ["materialSelectedVideo", "sortedMaterialTag"])
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
</style>