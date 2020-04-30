<template>
  <q-page padding>
    <div class="ctlLayout">
      <!-- ユーザープロフィール情報 -->
      <div class="row profileWrapper">
        <q-avatar class="myPageAvator">
          <img :src="usersPublicInfo[pageUserId].photoURL" />
        </q-avatar>
        <div class="column">
          <div class="userName">{{ usersPublicInfo[pageUserId].nickName }}</div>
          <div class="introduction">{{ usersPublicInfo[pageUserId].introduction }}</div>
        </div>
      </div>
      <!-- 全てのYoutuber -->
      <!-- 検索Wordがない場合 TabがAll　でかつSelectが登録者が多い-->
      <div class="row YOUTUBERCardWrapper widthAdjust" name="youtubers">
        <transition-group appear enter-active-class="animated fadeInLeft" class="row">
          <MyPageCookVideoReviewCard />
        </transition-group>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { firestoreDb } from "src/boot/firebase";
export default {
  data() {
    return {
      alert: false,
      pageUserId: "",
      nickName: "",
      current: 1
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn"]),
    ...mapState("usersPublic", ["usersPublicInfo"]),
    ...mapGetters("usersPublic", ["getfavoriteObject"])
  },
  methods: {},
  components: {
    MyPageCookVideoReviewCard: require("components/VideoCard/MyPageCookVideoReviewCard.vue")
      .default
  },
  created() {
    this.pageUserId = this.$route.params.id;
  },
  mounted() {}
};
</script>

<style>
.ctlLayout {
  margin-top: 32px;
  margin-left: 24px;
  margin-right: 24px;
}
.myPageAvator {
  width: 100px;
  height: 100px;
}
.userName {
  font-size: 27px;
  padding-top: 8px;
  padding-right: 24px;
  padding-left: 24px;
}
.introduction {
  font-size: 18px;
  padding-top: 8px;
  padding-right: 24px;
  padding-left: 24px;
}
.profileWrapper {
  width: 89%;
  margin-right: auto;
  margin-left: auto;
}
.modifyButton {
  width: 160px;
  height: 45px;
  margin-top: 20px;
}
.onAirTabs {
  margin-bottom: 16px;
}
.selectButtonWrapper {
  width: 87%;
  margin-right: auto;
  margin-left: auto;
}
/* /* /* /* /* /* /* /* /* /* /* /* /* /* /* /* /* 
/* 備忘録：こちらでwrapperの大きさを指定。
Cardコンポーネントでカードの大きさを指定 */
/* /* /* /* /* /* /* /* /* /* /* /* /* /* /* /* /* 
/* 画面のサイズが1808以上の時は横にCard5枚並べる */
@media screen and (min-width: 1808px) {
  .YOUTUBERCardWrapper {
    width: 97%;
    margin-right: auto;
    margin-left: auto;
    padding-left: 32px;
    margin-top: 15px;
    margin-bottom: 50px;
  }
}
/* 画面のサイズが1281以上1807以下の時は横にCard4枚並べる */
@media screen and (min-width: 1281px) and (max-width: 1807px) {
  .YOUTUBERCardWrapper {
    width: 930px;
    margin-right: auto;
    margin-left: auto;
    padding-left: 32px;
    margin-top: 15px;
    margin-bottom: 30px;
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
/* 画面のサイズが1129以上1280以下の時は横にCard3枚並べる */
@media screen and (min-width: 1129px) and (max-width: 1280px) {
  .YOUTUBERCardWrapper {
    width: 782px;
    margin-right: auto;
    margin-left: auto;
    padding-left: 32px;
    margin-top: 15px;
    margin-bottom: 50px;
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
/* 画面のサイズが1000以上1128以下の時は横にCard3枚並べる */
@media screen and (min-width: 1000px) and (max-width: 1128px) {
  .YOUTUBERCardWrapper {
    width: 783px;
    margin-right: auto;
    margin-left: auto;
    padding-left: 32px;
    margin-top: 15px;
    margin-bottom: 50px;
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
@media screen and (min-width: 700px) and (max-width: 999px) {
  .YOUTUBERCardWrapper {
    width: 97%;
    margin-right: auto;
    margin-left: auto;
    padding-left: 32px;
    margin-top: 15px;
    margin-bottom: 50px;
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
@media screen and (min-width: 624px) and (max-width: 699px) {
  .YOUTUBERCardWrapper {
    width: 97%;
    margin-right: auto;
    margin-left: auto;
    padding-left: 32px;
    margin-top: 15px;
    margin-bottom: 50px;
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
@media screen and (min-width: 500px) and (max-width: 623px) {
  .YOUTUBERCardWrapper {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
    padding-left: 8px;
    padding-bottom: 8px;
    margin-bottom: 50px;
  }
  /* .widthAdjust {
    margin-left: 20px;
  } */
  .myCardWrapper {
    width: 50%;
  }
  .q-tabs__content {
    width: 170px;
  }

  .clearText {
    display: none;
  }
  .q-field {
    padding-top: 8px;
    padding-bottom: 0px;
    margin-bottom: 0px;
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
  .modifyButton {
    display: none;
  }
}
@media screen and (min-width: 360px) and (max-width: 499px) {
  .column {
    overflow: hidden;
  }
  .ctlLayout {
    margin-top: 20px;
    margin-left: 3px;
    margin-right: 3px;
  }
  .myPageAvator {
    width: 50px;
    height: 50px;
  }
  .userName {
    font-size: 20px;
    padding-top: 0px;
  }
  .introduction {
    font-size: 15px;
    padding-top: 0px;
  }
  .profileWrapper {
    width: 89%;
    margin-right: auto;
    margin-left: auto;
    margin-bottom: 13px;
  }
  .YOUTUBERCardWrapper {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 15px;
    margin-bottom: 30px;
  }
  .myCardWrapper {
    width: 50%;
  }
  .q-tabs__content {
    width: 90px;
    padding: 0px;
  }
  .q-tab {
    width: 70px;
    padding: 0px;
    font-size: 12px;
  }
  .q-field {
    padding-top: 4px;
    padding-bottom: 0px;
    margin-bottom: 0px;
  }
  .q-pa-lg {
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 24px;
    padding-left: 24px;
  }
  .q-mt-md {
    margin-top: 0px;
  }
  .q-pagination {
    width: 200px;
  }
  .channelName {
    margin: 0px;
  }
}
</style>
