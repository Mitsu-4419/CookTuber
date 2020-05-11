<template>
  <q-page padding>
    <div class="column">
      <!-- ソートのSelect　登録者が多い順or登録者が少ない順 -->
      <div class="row ReviewTotal-topContainer">
        <q-space></q-space>
        <q-select
          outlined
          v-model="model"
          :options="options"
          color="black"
          class="q-mr-md q-mt-md"
        />
      </div>
      <div class="row ReviewrCardWrapper widthAdjust">
        <transition-group appear enter-active-class="animated fadeInLeft" class="row">
          <ReviewerTotalPageCard
            :usersInfo="usersInfo"
            :uid="key"
            v-for="(usersInfo, key) in getSortedReviewer(model)"
            :key="key"
          />
        </transition-group>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { SessionStorage, Quasar, QDialog, ClosePopup } from "quasar";
import Vue from "vue";
export default {
  data() {
    return {
      model: "参考になった数が多い順",
      options: ["投稿数が多い順", "参考になった数が多い順"]
    };
  },
  computed: {
    ...mapGetters("usersPublic", ["getSortedReviewer"])
  },
  methods: {
    ...mapActions("youtubers", ["setSearch"])
    // getPageNum() {
    //   const pageTotal = Math.ceil(
    //     Object.keys(this.YoutubersChannel_info).length / 50
    //   );
    //   return pageTotal;
    // },
    // setSelectedTab(genre) {
    //   this.tab = genre;
    //   this.othersmodal = false;
    // }
  },
  created() {
    // this.pageTotal = this.getPageNum();
  },
  components: {
    ReviewerTotalPageCard: require("components/Card/ReviewerTotalPageCard.vue")
      .default
  }
};
</script>

<style>
.ReviewTotal-topContainer {
  width: 85%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
/* 画面のサイズが1600以上の時は横にCard6枚並べる */
@media screen and (min-width: 1780px) {
  .ReviewrCardWrapper {
    width: 1540px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 1410px) and (max-width: 1779px) {
  .ReviewrCardWrapper {
    width: 1200px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard4枚並べる */
/* @media screen and (min-width: 1330px) and (max-width: 1564px) {
  .ReviewrCardWrapper {
    width: 1100px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
} */
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 1210px) and (max-width: 1409px) {
  .ReviewrCardWrapper {
    width: 1000px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 1010px) and (max-width: 1209px) {
  .ReviewrCardWrapper {
    width: 800px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 809px) and (max-width: 1009px) {
  .ReviewrCardWrapper {
    width: 600px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
/* @media screen and (min-width: 900px) and (max-width: 1024px) {
  .ReviewrCardWrapper {
    width: 880px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
} */
@media screen and (min-width: 770px) and (max-width: 808px) {
  .ReviewrCardWrapper {
    width: 400px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
@media screen and (min-width: 620px) and (max-width: 769px) {
  .ReviewrCardWrapper {
    width: 600px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}

/* ipnoheX,iphone6-8 */
@media screen and (min-width: 360px) and (max-width: 619px) {
  .ReviewrCardWrapper {
    width: 400px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
  }
}
</style>