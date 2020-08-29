<template>
  <q-page class="q-pa-md">
    <div class="CookVideoTitleWrapper">
      <!-- ソートと検索のところSelect -->
      <div class="row q-mr-md">
        <div class="videoTitleCookPage row" v-if="flag =='genre'">
          <q-icon name="restaurant" color="grey-5" size="lg" class="q-mr-md q-ml-sm"></q-icon>
          <div class="cookVideoTitle">ジャンルで選択</div>
        </div>
        <div class="videoTitleCookPage row" v-else-if="flag =='material'">
          <q-icon name="fas fa-carrot" color="grey-14" size="md" class="q-mr-md q-ml-sm"></q-icon>
          <div class="cookVideoTitle">材料で選ぶ</div>
        </div>
        <div class="videoTitleCookPage row" v-else-if="flag =='menu'">
          <q-icon name="fas fa-book-open" color="grey-14" size="md" class="q-mr-md q-ml-sm"></q-icon>
          <div class="cookVideoTitle">メニューで選ぶ</div>
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
    <div class="cookVideoTagWrapper column">
      <template v-if="flag =='genre'">
        <div v-for="meta in genreMetaArray" :key="meta">
          <div class="row">
            <ChipComponent
              v-for="tag in sortedTag(meta, flag)"
              :key="tag.key"
              :tagName="tag.name"
              :id="tag.key"
              ref="allvideopage"
              @setActivatedTag="setTagArray"
            />
          </div>
        </div>
      </template>
      <template v-else-if="flag =='menu'">
        <div v-for="meta in menuMetaArray" :key="meta">
          <div class="row">
            <ChipComponent
              v-for="tag in sortedTag(meta, flag)"
              :key="tag.key"
              :tagName="tag.name"
              :id="tag.key"
              ref="allvideopage"
              @setActivatedTag="setTagArray"
            />
          </div>
        </div>
      </template>
      <template v-else-if="flag =='material'">
        <div v-for="meta in materialMetaArray" :key="meta">
          <div class="row">
            <ChipComponent
              v-for="tag in sortedTag(meta, flag)"
              :key="tag.key"
              :tagName="tag.name"
              :id="tag.key"
              ref="allvideopage"
              @setActivatedTag="setTagArray"
            />
          </div>
        </div>
      </template>
    </div>
    <div class="CookVideoTotalWrapper row">
      <CookVideoCard
        v-for="(cookVideoDetail, key) in sortByTagOfCookVideos(selectedTag,tagTimeArray,model, flag)"
        :key="key"
        :id="key"
        :cookVideoDetail="cookVideoDetail"
        :from="flag"
      />
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import SetTagArray from "src/functions/sortTags";
import { getParam } from "src/functions/getParam";
export default {
  data() {
    return {
      flag: "",
      genreMetaArray: ["country", "material", "special"],
      menuMetaArray: ["meat", "rice", "chinese", "noodle", "other"],
      materialMetaArray: [
        "vegetable",
        "meat",
        "rice",
        "noodle",
        "fish",
        "alcohol",
        "wheat",
        "seasoning",
      ],
      chooseTag: false,
      selectedTag: "",
      tagTimeArray: ["time1", "time2", "time3"],
      model: "星の数順",
      options: ["星の数順", "再生回数順", "レビュー数順", "投稿日順"],
    };
  },
  computed: {
    ...mapState("allTag", ["timeTag", "genreTag"]),
    ...mapGetters("allTag", ["sortedTag", "sortByTagOfCookVideos"]),
  },
  methods: {
    setTagArray(value) {
      const ref = "allvideopage";
      if (this.selectedTag != "" && this.selectedTag != value) {
        console.log(value);
        let index;
        for (let i in this.$refs.allvideopage) {
          if (this.$refs.allvideopage[i].id == this.selectedTag) {
            index = i;
          }
        }
        this.$refs.allvideopage[index].resetChip();
        this.selectedTag = value;
      } else if (this.selectedTag == value) {
        this.selectedTag = "";
      } else {
        this.selectedTag = value;
      }
    },
  },
  components: {
    CookVideoCard: require("components/Card/CookVideoCard.vue").default,
    ChipComponent: require("components/Chip/ChipComponent.vue").default,
  },
  created() {
    this.flag = getParam("flag");
  },
  watch: {
    $route(to, from) {
      this.flag = getParam("flag");
      this.selectedTag = "";
      this.model = "星の数順";
    },
  },
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
