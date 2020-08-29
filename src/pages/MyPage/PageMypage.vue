<template>
  <q-page padding>
    <div class="row">
      <router-link
        v-if="from == 'reviewersPage'"
        to="/reviewtotal"
        style="text-decoration:none;color:black"
      >
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">Reviewer一覧へ</span>
      </router-link>
      <router-link v-else-if="from == 'topPage'" to="/" style="text-decoration:none;color:black">
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">Reviewer一覧へ</span>
      </router-link>
      <router-link
        v-else-if="from == 'videoDetail'"
        :to="{ name: 'video', query: { key:videoId, from: 'topPage' } }"
        style="text-decoration:none;color:black"
      >
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">動画詳細ページへ</span>
      </router-link>
    </div>
    <div class="ctlLayout" v-if="usersPublicInfo[pageUserId]">
      <!-- ユーザープロフィール情報 -->
      <div class="row profileWrapper">
        <q-avatar class="myPageAvator">
          <img :src="usersPublicInfo[pageUserId].photoURL" />
        </q-avatar>
        <div class="column userProfile">
          <div class="userName">{{ usersPublicInfo[pageUserId].nickName }}</div>
          <div class="introduction">{{ usersPublicInfo[pageUserId].introduction }}</div>
        </div>
      </div>
      <!-- つくったかこれからつくるのかのTAB -->
      <q-tabs v-model="tab" inline-label style="margin-top:30px;">
        <q-tab name="cooked" class="cookedTab" icon="fas fa-utensils" label="料理済み"></q-tab>
        <q-tab name="NotCooked" class="cookedTab" icon="fas fa-carrot" label="後で作る" />
      </q-tabs>
      <div class="row cookVideoReview" v-if="tab == 'cooked'">
        <transition-group appear enter-active-class="animated fadeInLeft" class="row">
          <MyPageCookVideoReviewCard
            v-for="(reviewInfo, key) in getfavoriteCookedObject(
              pageUserId,
              tab
            )"
            :key="key"
            :docId="key"
            :reviewInfo="reviewInfo"
            :userOrNot="userOrNot"
            :pageUserId="pageUserId"
            from="mypage"
          />
        </transition-group>
      </div>
      <div class="NonCookVideoReview" v-else-if="tab == 'NotCooked'">
        <transition-group appear enter-active-class="animated fadeInLeft" class="row">
          <MyPageNonCookVideoCard
            v-for="(reviewInfo, key) in getfavoriteCookedObject(
              pageUserId,
              tab
            )"
            :key="key"
            :docId="key"
            :reviewInfo="reviewInfo"
            :userOrNot="userOrNot"
            :pageUserId="pageUserId"
            from="mypage"
          />
        </transition-group>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { firestoreDb } from "src/boot/firebase";
import { getParam } from "src/functions/getParam.js";
export default {
  data() {
    return {
      alert: false,
      pageUserId: "",
      nickName: "",
      current: 1,
      userOrNot: false,
      tab: "cooked",
      from: "",
      videoId: "",
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn", "userId"]),
    ...mapState("usersPublic", ["usersPublicInfo"]),
    ...mapGetters("usersPublic", ["getfavoriteCookedObject"]),
  },
  methods: {},
  components: {
    MyPageCookVideoReviewCard: require("components/Card/MyPageVideoCard/MyPageCookVideoReviewCard.vue")
      .default,
    MyPageNonCookVideoCard: require("components/Card/MyPageVideoCard/MyPageNonCookVideoCard.vue")
      .default,
  },
  mounted() {
    this.pageUserId = getParam("id");
    this.from = getParam("from");
    this.videoId = getParam("videoId");
    if (this.userId == this.pageUserId) {
      this.userOrNot = true;
    }
  },
  watch: {
    $route(to, from) {
      this.pageUserId = getParam("id");
      if (this.userId == this.pageUserId) {
        this.userOrNot = true;
      }
    },
  },
};
</script>

<style>
.ctlLayout {
  margin-top: 32px;
  margin-left: 5px;
  margin-right: 5px;
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
.cookVideoReview {
  width: 100%;
  margin-top: 30px;
}
/* TABのCSS */
.cookedTab {
  width: 200px;
  color: rgb(82, 87, 135);
}
/* /* /* /* /* /* /* /* /* /* /* /* /* /* /* /* /* 
/* 備忘録：こちらでwrapperの大きさを指定。
Cardコンポーネントでカードの大きさを指定 */
/* /* /* /* /* /* /* /* /* /* /* /* /* /* /* /* /* 
/* 画面のサイズが1808以上の時は横にCard5枚並べる */
@media screen and (min-width: 1691px) {
  .cookVideoReview {
    width: 1317px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
/* 画面のサイズが1281以上1807以下の時は横にCard4枚並べる */
@media screen and (min-width: 1185px) and (max-width: 1690px) {
  .cookVideoReview {
    width: 962px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
/* 画面のサイズが1129以上1280以下の時は横にCard3枚並べる */
@media screen and (min-width: 1125px) and (max-width: 1184px) {
  .cookVideoReview {
    width: 878px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 1000px) and (max-width: 1124px) {
  .cookVideoReview {
    width: 770px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 500px) and (max-width: 999px) {
  .cookVideoReview {
    width: 500px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 1764px) {
  .NonCookVideoReview {
    width: 1525px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 1452px) and (max-width: 1763px) {
  .NonCookVideoReview {
    width: 1220px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 1145px) and (max-width: 1452px) {
  .NonCookVideoReview {
    width: 915px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 840px) and (max-width: 1144px) {
  .NonCookVideoReview {
    width: 610px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 500px) and (max-width: 839px) {
  .NonCookVideoReview {
    width: 470px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 25px;
  }
}
@media screen and (min-width: 414px) and (max-width: 499px) {
  .myPageAvator {
    width: 70px;
    height: 70px;
  }
  .userProfile {
    width: 250px;
  }
  .userName {
    padding-top: 0px;
  }
}
@media screen and (min-width: 300px) and (max-width: 413px) {
  .myPageAvator {
    width: 50px;
    height: 50px;
  }
  .userProfile {
    width: 250px;
  }
  .userName {
    padding-top: 0px;
  }
}
</style>
