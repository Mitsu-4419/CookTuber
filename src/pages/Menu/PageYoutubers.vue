<template>
  <div>
    <q-page padding>
      <div class="column">
        <!-- ソートのSelect　登録者が多い順or登録者が少ない順 -->
        <div class="row" style="margin-bottom:20px;margin-right:9%;">
          <q-space></q-space>
          <q-select
            outlined
            v-model="model"
            :options="options"
            color="black"
            class="q-mr-md q-mt-md"
          />
        </div>

        <!-- others スマホの時だけ表示-->
        <q-tabs v-model="tab" class="GenreTabsMobile" inline-label>
          <q-tab name="all" class="GenreTabsMobileTAB">
            <!-- <img src="statics/gamePackage/allMobile.jpeg" alt class="gameImgMobile" /> -->
            <span style="font-weight:bold; margin-left:5px;">ALL</span>
          </q-tab>
          <q-tab class="GenreTabsMobileTAB" name="others" @click="othersmodal = true">
            <q-icon name="apps" class="gameImgMobile" />
            <span style="font-weight:bold; margin-left:5px;">OTHERS</span>
          </q-tab>
        </q-tabs>
        <!-- ----------- -->
        <!--ゲームの選択Modal  -->
        <!-- ----------- -->
        <q-dialog v-model="othersmodal">
          <gameSelectModal @selectedTab="setSelectedTab" />
        </q-dialog>

        <!-- 検索Wordがない場合 TabがAll　でかつSelectが登録者が多い-->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'all'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                'all',
                'all',
                model
              )[current - 1]"
              :key="'A' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- 洋食 -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Western'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                '洋食',
                'ハンバーグ',
                model
              )[current - 1]"
              :key="'B' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- 和食 -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Japanese'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                '和食',
                '蕎麦',
                model
              )[current - 1]"
              :key="'C' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- 中華 -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Chinese'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                '中華',
                '四川',
                model
              )[current - 1]"
              :key="'D' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- ラーメン -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Ramen'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                'ラーメン',
                '中華そば',
                model
              )[current - 1]"
              :key="'E' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- カレー -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Curry'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                'カレー',
                'スパイス',
                model
              )[current - 1]"
              :key="'F' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- パスタ -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Pasta'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                'パスタ',
                'スパゲッティ',
                model
              )[current - 1]"
              :key="'G' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- 丼 -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Ricebowl'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                '丼',
                'ボウル',
                model
              )[current - 1]"
              :key="'H' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- 肉 -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Meat'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                '豚',
                '牛',
                model
              )[current - 1]"
              :key="'I' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- 魚 -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Fish'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                '魚',
                '寿司',
                model
              )[current - 1]"
              :key="'J' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- にんにく -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Garlic'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                'にんにく',
                'ガーリック',
                model
              )[current - 1]"
              :key="'K' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- 簡単 -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Easy'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                'お手軽',
                '時短',
                model
              )[current - 1]"
              :key="'L' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- 酒のつまみ -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Alchole'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                '酒',
                'ビール',
                model
              )[current - 1]"
              :key="'M' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- 朝食 -->
        <div class="row YouTuberCardWrapper widthAdjust" name="youtubers" v-if="tab == 'Breakfast'">
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                '朝食',
                '朝ごはん',
                model
              )[current - 1]"
              :key="'N' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- 唐揚げ -->
        <div
          class="row YouTuberCardWrapper widthAdjust"
          name="youtubers"
          v-if="tab == 'Friedchicken'"
        >
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                '唐揚げ',
                '揚げ物',
                model
              )[current - 1]"
              :key="'O' + key"
              Door="All"
            />
          </transition-group>
        </div>男の料理
        <div
          class="row YouTuberCardWrapper widthAdjust"
          name="youtubers"
          v-if="tab == 'Menscooking'"
        >
          <transition-group appear enter-active-class="animated fadeInLeft" class="row">
            <YoutuberCard
              :channelInfo="channelInfo"
              :id="key"
              v-for="(channelInfo, key) in sortRegiNumMany(
                '男',
                'ガッツリ',
                model
              )[current - 1]"
              :key="'P' + key"
              Door="All"
            />
          </transition-group>
        </div>
        <!-- ----------------->
        <!-- ページネーション -->
        <!-- ---------------->
        <div v-if="tab == 'all'" class="pageTab" style="width:100%">
          <q-pagination
            v-model="current"
            :max="pageTotal"
            :max-pages="6"
            :boundary-numbers="true"
            style="display:flex;justify-content:center;margin:auto;"
          ></q-pagination>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { SessionStorage, Quasar, QDialog, ClosePopup } from "quasar";
import Vue from "vue";
export default {
  data() {
    return {
      tab: "all",
      model: "登録者数が多い順",
      options: ["登録者数が多い順", "登録者数が少ない順"],
      current: 1,
      pageTotal: "",
      othersmodal: false,
      tabOption: [
        { all: "all" },
        { Western: "洋食" },
        { Japanese: "和食" },
        { Chinese: "中華" },
        { Ramen: "ラーメン" },
        { Curry: "カレー" },
        { Pasta: "パスタ" },
        { Ricebowl: "丼" },
        { Meat: "お肉" },
        { Fish: "お魚" },
        { Garlic: "にんにく" },
        { Easy: "簡単" },
        { Alchole: "酒のアテ" },
        { Breakfast: "朝食" },
        { Friedchicken: "唐揚げ" },
        { Menscooking: "男の料理" }
      ]
    };
  },
  computed: {
    ...mapState("youtubers", ["YoutubersChannel_info"]),
    ...mapGetters("youtubers", ["sortRegiNumMany"])
  },

  methods: {
    ...mapActions("youtubers", ["setSearch"]),
    getPageNum() {
      const pageTotal = Math.ceil(
        Object.keys(this.YoutubersChannel_info).length / 50
      );
      return pageTotal;
    },
    setSelectedTab(genre) {
      this.tab = genre;
      this.othersmodal = false;
    }
  },
  created() {
    this.pageTotal = this.getPageNum();
  },
  components: {
    //YouTuber一覧
    YoutuberCard: require("components/Card/CardYoutuber.vue").default
    // gameSelectModal: require("components/gameSelectModal/gameSelectModal.vue")
    //   .default
  }
};
</script>

<style>
/* ゲームパッケージ画像*/
.gameImg {
  width: 48px;
  height: 48px;
}
.q-tabs__arrow {
  font-size: 64px;
}

.othersTab {
  display: none;
}

.q-pa-lg {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 24px;
  padding-left: 24px;
}
/* ページネーション  */
.q-pagination {
  width: 200px;
}
.GenreTabsMobile {
  margin-top: 20px;
  width: 800px;
  height: 50px;
  margin-left: auto;
  margin-right: auto;
}
.GenreTabsMobileTAB {
  width: 45%;
  font-size: 20px;
}
.gameImgMobile {
  width: 29px;
  height: 20px;
}
/* 画面のサイズが1600以上の時は横にCard6枚並べる */
@media screen and (min-width: 1780px) {
  .YouTuberCardWrapper {
    width: 1540px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 1565px) and (max-width: 1779px) {
  .YouTuberCardWrapper {
    width: 1320px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard4枚並べる */
@media screen and (min-width: 1330px) and (max-width: 1564px) {
  .YouTuberCardWrapper {
    width: 1100px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }

  .genreTabs {
    margin-top: 20px;
    width: 1000px;
    margin-left: auto;
    margin-right: auto;
  }
  .pageTab {
    margin-bottom: 8px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 1110px) and (max-width: 1329px) {
  .YouTuberCardWrapper {
    width: 880px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
  .q-pa-lg {
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 24px;
    padding-left: 24px;
  }
  .q-pagination {
    width: 200px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 1025px) and (max-width: 1109px) {
  .YouTuberCardWrapper {
    width: 660px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 900px) and (max-width: 1024px) {
  .YouTuberCardWrapper {
    width: 880px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 900px) and (max-width: 1024px) {
  .YouTuberCardWrapper {
    width: 880px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 680px) and (max-width: 899px) {
  .YouTuberCardWrapper {
    width: 660px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 500px) and (max-width: 679px) {
  .YouTuberCardWrapper {
    width: 440px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
  .youtuberSortTab {
    font-size: 12px;
  }
  .allLiveWaitTabs {
    width: 420px;
    margin-right: auto;
    margin-left: auto;
  }
}
@media screen and (min-width: 500px) and (max-width: 834px) {
  .GenreTabsMobile {
    margin-top: 20px;
    width: 500px;
    height: 50px;
    margin-left: auto;
    margin-right: auto;
  }
}
/* ipnoheX,iphone6-8 */
@media screen and (min-width: 360px) and (max-width: 499px) {
  .genreTabs {
    display: none;
  }

  .my-card.q-card {
    width: 168px;
    margin-left: 8px;
    height: 264px;
  }
  .card_description {
    height: 50px;
  }
  .YouTuberCardWrapper {
    width: 352px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
  .genreTabs {
    margin-top: 20px;
    width: 250px;
    margin-left: auto;
    margin-right: auto;
  }
  .youtuberSortTab {
    font-size: 10px;
    padding: 13px;
  }
  .allLiveWaitTabs {
    width: 280px;
    margin-right: auto;
    margin-left: auto;
  }
  .gameImgMobile {
    width: 20px;
    height: 12px;
  }
}
@media screen and (min-width: 500px) {
  .genreTabsMobile {
    display: none;
  }
}
</style>
