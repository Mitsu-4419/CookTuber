<template>
  <q-page class="q-pa-md">
    <div class="CookVideoTitleWrapper">
      <!-- ソートと検索のところSelect -->
      <div class="row q-mr-md">
        <div class="videoTitleCookPage row">
          <q-icon name="restaurant" color="grey-5" size="lg" class="q-mr-md q-ml-sm"></q-icon>
          <div class="cookVideoTitle">料理動画一覧</div>
        </div>
        <q-space></q-space>
      </div>
    </div>
    <div class="cookVideoTagWrapper column">
      <div class="row">
        <ChipComponent
          v-for="tag in Object.keys(sortedTag('genre'))"
          :key="tag"
          :tagName="allTags[tag].tagName"
          :id="tag"
          @setActivatedTag="setTagArray"
        />
      </div>
      <div class="row">
        <ChipComponent
          v-for="tag in Object.keys(sortedTag('dish'))"
          :key="tag"
          :tagName="allTags[tag].tagName"
          :id="tag"
          @setActivatedTag="setTagArray"
        />
      </div>
      <div class="row">
        <ChipComponent
          v-for="tag in Object.keys(sortedTag('material'))"
          :key="tag"
          :tagName="allTags[tag].tagName"
          :id="tag"
          @setActivatedTag="setTagArray"
        />
      </div>
    </div>
    <!-- ----------- -->
    <!-- tagが何も選ばれていない時 -->
    <!-- ----------- -->
    <div class="row CookVideoTotalWrapper" v-if="tagArray.length == 0">
      <CookVideoCard
        v-for="(cookVideoDetail, key) in CookVideoStarOrder"
        :key="key"
        :videoId="key"
        :cookVideoDetail="cookVideoDetail"
      />
    </div>
    <!-- ----------- -->
    <!-- tagが何か選ばれている時 -->
    <!-- ----------- -->
    <div class="row CookVideoTotalWrapper" v-else>
      <CookVideoCard
        v-for="(cookVideoDetail, key) in cookVideoTagSort"
        :key="key"
        :videoId="key"
        :cookVideoDetail="cookVideoDetail"
      />
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      tagArray: [],
      cookVideoTagSort: {}
    };
  },
  computed: {
    ...mapState("tags", ["allTags"]),
    ...mapGetters("videos", ["CookVideoStarOrder"]),
    ...mapGetters("videos", ["sortByTagOfCookVideos"]),
    ...mapGetters("tags", ["sortedTag"])
  },
  methods: {
    setTagArray(value) {
      // すでに配列内にある場合はその要素を外す
      if (this.tagArray.includes(value)) {
        let idx = this.tagArray.indexOf(value);
        this.tagArray.splice(idx, 1);
        let payload = this.tagArray;
        this.cookVideoTagSort = this.sortByTagOfCookVideos(payload);
      } else {
        this.tagArray.push(value);
        let payload = this.tagArray;
        this.cookVideoTagSort = this.sortByTagOfCookVideos(payload);
      }
    }
  },
  components: {
    CookVideoCard: require("components/Card/CookVideoCard.vue").default,
    ChipComponent: require("components/Chip/ChipComponent.vue").default
  },
  created() {
    // Object.keys(this.allTags).forEach(key => {
    //   this.tagSelection[key] = false;
    // });
  }
};
</script>

<style>
.CookVideoTotalWrapper {
  margin-top: 20px;
  margin-left: 5px;
}
.CookVideoTitleWrapper {
  /* background: red; */
  height: 50px;
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
.selectedTag {
  color: yellow;
}
</style>