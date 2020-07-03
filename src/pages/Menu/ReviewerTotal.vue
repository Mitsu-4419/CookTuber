<template>
  <q-page padding>
    <div class="column">
      <!-- ソートのSelect登録者が多い順or登録者が少ない順 -->
      <div class="row ReviewTotal-topContainer">
        <div class="videoTitleCookPage row">
          <q-icon name="fas fa-users" color="grey-14" size="md" class="q-mr-md q-ml-sm"></q-icon>
          <div class="cookVideoTitleReviewer">Reviewer一覧</div>
        </div>
        <q-select
          outlined
          dense
          v-model="model"
          :options="options"
          color="black"
          class="reviewerSelectBox"
        />
      </div>
      <div class="row ReviewrCardWrapper widthAdjust">
        <transition-group appear enter-active-class="animated fadeInLeft" class="row">
          <ReviewerTotalPageCard
            :usersInfo="usersInfo"
            :id="key"
            v-for="(usersInfo, key) in getSortedReviewer(model)"
            :key="key"
            from="reviewersPage"
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
  },
  components: {
    ReviewerTotalPageCard: require("components/Card/ReviewerTotalPageCard.vue")
      .default
  }
};
</script>

<style>
.ReviewTotal-topContainer {
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
.ReviewrCardWrapper {
  margin-right: auto;
  margin-left: auto;
  margin-top: 40px;
}
.cookVideoTitleReviewer {
  font-size: 20px;
  font-weight: bold;
}
.reviewerSelectBox {
  margin-left: 10px;
}
@media screen and (min-width: 1780px) {
  .ReviewrCardWrapper {
    width: 1490px;
  }
}
@media screen and (min-width: 1485px) and (max-width: 1779px) {
  .ReviewrCardWrapper {
    width: 1270px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard4枚並べる */
@media screen and (min-width: 1266px) and (max-width: 1484px) {
  .ReviewrCardWrapper {
    width: 1050px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 1053px) and (max-width: 1265px) {
  .ReviewrCardWrapper {
    width: 840px;
  }
}
/* 画面のサイズが1200以上1499以下の時は横にCard3枚並べる */
@media screen and (min-width: 847px) and (max-width: 1052px) {
  .ReviewrCardWrapper {
    width: 630px;
  }
}
@media screen and (min-width: 769px) and (max-width: 846px) {
  .ReviewrCardWrapper {
    width: 420px;
  }
}
@media screen and (min-width: 680px) and (max-width: 768px) {
  .ReviewrCardWrapper {
    width: 630px;
  }
}
@media screen and (min-width: 500px) and (max-width: 679px) {
  .ReviewrCardWrapper {
    width: 440px;
  }
}
@media screen and (min-width: 300px) and (max-width: 499px) {
  .ReviewrCardWrapper {
    width: 352px;
  }
  .ReviewrCardWrapper {
    margin-top: 0px;
  }
  .reviewerSelectBox {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
