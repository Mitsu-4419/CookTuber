<template>
  <div>
    <template v-if="flag=='meat'">
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <div class="menuIconWrapper">
            <q-icon name="fas fa-drumstick-bite" size="sm" class="topPageIcon"></q-icon>
          </div>
          <div class="menuTitleWrapper">
            <span class="cookImageWrapperTopPage-title-span">おすすめ肉料理</span>
          </div>
          <q-select
            class="topPageFirstSelect"
            dense
            rounded
            outlined
            v-model="model"
            :options="options"
            bg-color="white"
            color="grey-5"
          />
          <q-space />
          <!-- <div class="MoreButton_wrapper">
            <q-btn
              flat
              :to="{
                    name: 'allVideos',
                    query: { flag: 'genre' }
                  }"
              class="moreButton"
              label="もっとみる"
            ></q-btn>
          </div>-->
        </div>
        <div class="TopPageTagWrapper">
          <div class="row">
            <ChipComponent
              v-for="tag in sortedTag('meat', 'material')"
              :key="tag.key"
              :tagName="tag.name"
              :id="tag.key"
              @setActivatedTag="setTagArray"
              flag="topPage"
              ref="materialchip"
            />
          </div>
        </div>
        <div class="cookImageTopPageWrapper row">
          <CookVideoCardTopPage
            v-for="(cookVideoDetail, key) in sortByMeatTop5(selectedMaterialTag,model)"
            :key="key"
            :id="key"
            :cookVideoDetail="cookVideoDetail"
            from="topPage"
          />
        </div>
      </div>
    </template>
    <template v-else-if="flag=='genre'">
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <div class="menuIconWrapper">
            <q-icon name="restaurant" size="sm" class="topPageIcon"></q-icon>
          </div>
          <div class="menuTitleWrapper">
            <span class="cookImageWrapperTopPage-title-span">ジャンル別簡単料理</span>
          </div>
          <q-select
            class="topPageFirstSelect"
            dense
            rounded
            outlined
            v-model="model"
            :options="options"
            bg-color="white"
            color="grey-5"
          />
          <q-space />
          <div class="MoreButton_wrapper">
            <q-btn
              flat
              :to="{
                    name: 'allVideos',
                    query: { flag: 'genre' }
                  }"
              class="moreButton"
              label="もっとみる"
            ></q-btn>
          </div>
        </div>
        <div class="TopPageTagWrapper">
          <div v-for="meta in genreMetaArray" :key="meta">
            <div class="row">
              <ChipComponent
                v-for="tag in sortedTag(meta, 'genre')"
                :key="tag.key"
                :tagName="tag.name"
                :id="tag.key"
                @setActivatedTag="setTagArray"
                flag="topPage"
                ref="genrechip"
              />
            </div>
          </div>
        </div>
        <div class="cookImageTopPageWrapper row">
          <CookVideoCardTopPage
            v-for="(cookVideoDetail, key) in sortByTagOfCookVideosTop5(selectedGenreTag,tagTimeArray,model, 'genre')"
            :key="key"
            :id="key"
            :cookVideoDetail="cookVideoDetail"
            from="topPage"
          />
        </div>
      </div>
    </template>
    <template v-else-if="flag=='menu'">
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <div class="menuIconWrapper">
            <q-icon name="restaurant" size="sm" class="topPageIcon"></q-icon>
          </div>
          <div class="menuTitleWrapper">
            <span class="cookImageWrapperTopPage-title-span">メニュー別簡単料理</span>
          </div>
          <q-select
            class="topPageFirstSelect"
            dense
            rounded
            outlined
            v-model="menuModel"
            :options="options"
            bg-color="white"
            color="grey-5"
          />
          <q-space />
          <div class="MoreButton_wrapper">
            <q-btn
              flat
              :to="{
                    name: 'allVideos',
                    query: { flag: 'menu' }
                  }"
              class="moreButton"
              label="もっとみる"
            ></q-btn>
          </div>
        </div>
        <div class="TopPageTagWrapper">
          <div v-for="meta in menuMetaArray" :key="meta">
            <div class="row">
              <ChipComponent
                v-for="tag in sortedTag(meta, 'menu')"
                :key="tag.key"
                :tagName="tag.name"
                :id="tag.key"
                @setActivatedTag="setTagArray"
                flag="topPage"
                ref="menuchip"
              />
            </div>
          </div>
        </div>
        <div class="cookImageTopPageWrapper row">
          <CookVideoCardTopPage
            v-for="(cookVideoDetail, key) in sortByTagOfCookVideosTop5(selectedMenuTag,tagTimeArray,menuModel, 'menu')"
            :key="key"
            :id="key"
            :cookVideoDetail="cookVideoDetail"
            from="topPage"
          />
        </div>
      </div>
    </template>
    <template v-else-if="flag=='material'">
      <div class="cookImageWrapperTopPage">
        <div class="cookImageWrapperTopPage-title row">
          <div class="menuIconWrapper">
            <q-icon name="restaurant" size="sm" class="topPageIcon"></q-icon>
          </div>
          <div class="menuTitleWrapper">
            <span class="cookImageWrapperTopPage-title-span">材料別簡単料理</span>
          </div>
          <q-select
            class="topPageFirstSelect"
            dense
            rounded
            outlined
            v-model="materialModel"
            :options="options"
            bg-color="white"
            color="grey-5"
          />
          <q-space />
          <div class="MoreButton_wrapper">
            <q-btn
              flat
              :to="{
                    name: 'allVideos',
                    query: { flag: 'material' }
                  }"
              class="moreButton"
              label="もっとみる"
            ></q-btn>
          </div>
        </div>
        <div class="TopPageTagWrapper">
          <div v-for="meta in materialMetaArray" :key="meta">
            <div class="row">
              <ChipComponent
                v-for="tag in sortedTag(meta, 'material')"
                :key="tag.key"
                :tagName="tag.name"
                :id="tag.key"
                @setActivatedTag="setTagArray"
                flag="topPage"
                ref="materialchip"
              />
            </div>
          </div>
        </div>
        <div class="cookImageTopPageWrapper row">
          <CookVideoCardTopPage
            v-for="(cookVideoDetail, key) in sortByTagOfCookVideosTop5(selectedMaterialTag,tagTimeArray,materialModel, 'material')"
            :key="key"
            :id="key"
            :cookVideoDetail="cookVideoDetail"
            from="topPage"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  props: ["flag"],
  data() {
    return {
      genreMetaArray: ["country", "material", "special"],
      menuMetaArray: ["meat", "rice", "chinese", "noodle", "other"],
      materialMetaArray: [
        "vegetable",
        "meat",
        "rice",
        "noodle",
        // "fish",
        // "alcohol",
        // "wheat",
        // "seasoning",
      ],
      tagTimeArray: ["time1", "time2", "time3"],
      selectedGenreTag: "",
      selectedMaterialTag: "",
      selectedMenuTag: "",
      model: "星の数順",
      options: ["星の数順", "再生回数順", "レビュー数順", "投稿数順"],
      menuModel: "星の数順",
      optionsMenu: ["星の数順", "再生回数順", "レビュー数順", "投稿日順"],
      materialModel: "星の数順",
      optionsMaterial: ["星の数順", "再生回数順", "レビュー数順", "投稿日順"],
    };
  },
  computed: {
    ...mapGetters("allTag", [
      "sortedTag",
      "sortByTagOfCookVideosTop5",
      "sortByMeatTop5",
    ]),
  },
  methods: {
    setTagArray(value) {
      let ref;
      if (value.includes("g")) {
        ref = "genrechip";
        if (this.selectedGenreTag != "" && this.selectedGenreTag != value) {
          let index;
          for (let i in this.$refs[ref]) {
            if (this.$refs[ref][i].id == this.selectedGenreTag) {
              index = i;
            }
          }
          this.$refs[ref][index].resetChip();
          this.selectedGenreTag = value;
        } else if (this.selectedGenreTag == value) {
          this.selectedGenreTag = "";
        } else {
          this.selectedGenreTag = value;
        }
      } else if (value.includes("menu")) {
        ref = "menuchip";
        if (this.selectedMenuTag != "" && this.selectedMenuTag != value) {
          let index;
          for (let i in this.$refs[ref]) {
            if (this.$refs[ref][i].id == this.selectedMenuTag) {
              index = i;
            }
          }
          this.$refs[ref][index].resetChip();
          this.selectedMenuTag = value;
        } else if (this.selectedMenuTag == value) {
          this.selectedMenuTag = "";
        } else {
          this.selectedMenuTag = value;
        }
      } else if (value.includes("mat")) {
        ref = "materialchip";
        if (
          this.selectedMaterialTag != "" &&
          this.selectedMaterialTag != value
        ) {
          let index;
          for (let i in this.$refs[ref]) {
            if (this.$refs[ref][i].id == this.selectedMaterialTag) {
              index = i;
            }
          }
          this.$refs[ref][index].resetChip();
          this.selectedMaterialTag = value;
        } else if (this.selectedMaterialTag == value) {
          this.selectedMaterialTag = "";
        } else {
          this.selectedMaterialTag = value;
        }
      } else if (value.includes("time")) {
        if (this.tagTimeArray.includes(value)) {
          const idx = this.tagTimeArray.indexOf(value);
          this.tagTimeArray.slice(idx, 1);
        } else {
          this.tagTimeArray.push(value);
        }
      }
    },
  },
  components: {
    CookVideoCardTopPage: require("components/Card/CookVideoCard.vue").default,
    ChipComponent: require("components/Chip/ChipComponent.vue").default,
  },
};
</script>

<style>
</style>