<template>
  <q-page class="q-pa-md">
    <div class="CookVideoTitleWrapper">
      <!-- ソートと検索のところSelect -->
      <div class="row q-mr-md">
        <div class="videoTitleCookPage row">
          <q-icon name="fas fa-book-open" color="grey-14" size="md" class="q-mr-md q-ml-sm"></q-icon>
          <div class="cookVideoTitle">メニューで選ぶ</div>
        </div>
        <q-select
          style="width:180px;margin-left:30px;"
          dense
          rounded
          outlined
          v-model="menuModel"
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
            v-for="tag in Object.keys(sortedMenuTag('meat'))"
            :key="tag"
            :tagName="menuTag[tag].name"
            :id="tag"
            @setActivatedTag="setMenuTag"
            flag="topPage"
            :TAGArray="allmenuTags"
            ref="menuchip"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedMenuTag('rice'))"
            :key="tag"
            :tagName="menuTag[tag].name"
            :id="tag"
            @setActivatedTag="setMenuTag"
            flag="topPage"
            :TAGArray="allmenuTags"
            ref="menuchip"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedMenuTag('chinese'))"
            :key="tag"
            :tagName="menuTag[tag].name"
            :id="tag"
            @setActivatedTag="setMenuTag"
            flag="topPage"
            :TAGArray="allmenuTags"
            ref="menuchip"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedMenuTag('noodle'))"
            :key="tag"
            :tagName="menuTag[tag].name"
            :id="tag"
            @setActivatedTag="setMenuTag"
            flag="topPage"
            :TAGArray="allmenuTags"
            ref="menuchip"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(sortedMenuTag('other'))"
            :key="tag"
            :tagName="menuTag[tag].name"
            :id="tag"
            @setActivatedTag="setMenuTag"
            flag="topPage"
            :TAGArray="allmenuTags"
            ref="menuchip"
          />
        </div>
        <div class="row">
          <ChipComponent
            v-for="tag in Object.keys(timeTag)"
            :key="tag"
            :tagName="timeTag[tag].name"
            :id="tag"
            @setActivatedTag="setMenuTag(menuModel)"
            :TAGArray="tagMenuTimeArray"
            flag="topPage"
          />
        </div>
      </div>
    </div>
    <div class="row CookVideoTotalWrapper">
      <CookVideoCard
        v-for="(cookVideoDetail, key) in menuSelectedVideo({menuArray:tagMenuArray, timeMenuArray:tagMenuTimeArray}, this.menuModel)"
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
      chooseTag: false,
      tagMenuTimeArray: ["time1", "time2", "time3"],
      tagMenuArray: [],
      menuModel: "星の数順",
      options: ["星の数順", "再生回数順", "レビュー数多い順"]
    };
  },
  computed: {
    ...mapState("menuTag", ["menuTag", "allmenuTags"]),
    ...mapState("tags", ["allTags"]),
    ...mapGetters("videos", ["CookVideoStarOrder", "sortByTagOfCookVideos"]),
    ...mapGetters("tags", ["sortedTag"]),
    ...mapState("timeTag", ["timeTag"]),
    ...mapGetters("menuTag", ["menuSelectedVideo", "sortedMenuTag"])
  },
  methods: {},
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