<template>
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
.ReviewrCardWrapper {
}
</style>