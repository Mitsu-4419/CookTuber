<template>
  <div class="footerArrange">
    <q-footer elevated class="bg-grey-8 text-white footerLarge">
      <div class="row justify-center footer-upperside">
        <a
          href="https://www.blockaid.tokyo"
          style="text-decoration:none; color:white"
        >
          <span class>運営会社</span> </a
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link
          to="/termsOfService"
          style="text-decoration:none; color:white"
        >
          <span class>利用規約</span> </router-link
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link
          to="/privacypolicy"
          style="text-decoration:none; color:white"
        >
          <span class>プライバシーポリシー</span> </router-link
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScF-4PLF90SYREW5-QbpbRxb_d7uSgKJ8FwCqPyLLH6ZdNWjg/viewform"
          target="_blank"
          style="text-decoration:none; color:white"
        >
          <span class>お問い合わせ</span> </a
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <div class="row justify-center footer-downside">
        <span>Cook Tubers</span>&nbsp;
        <span>©️2020 Block Aid Inc.</span>
      </div>
    </q-footer>
    <!----------------->
    <!-- ミドルサイズ -->
    <!--------------->
    <q-footer elevated class="footerSmallSmall fixed-bottom">
      <q-btn
        class="footerMenuButton"
        icon="home"
        size="13px"
        color="#3d3760"
        flat
        stack
        label="home"
        to="/"
      ></q-btn>
      <q-btn
        class="footerMenuButton"
        size="13px"
        color="#3d3760"
        flat
        stack
        label="ジャンルで選ぶ"
        to="/genreCookvideos"
        icon="restaurant"
      >
      </q-btn>
      <q-btn
        class="footerMenuButton"
        size="13px"
        color="#3d3760"
        flat
        stack
        icon="fas fa-book-open"
        label="メニューで選ぶ"
        to="/menuCookvideos"
      >
      </q-btn>
      <q-btn
        class="footerMenuButton"
        size="13px"
        color="#3d3760"
        flat
        stack
        icon="fas fa-carrot"
        label="材料で選ぶ"
        to="/materialCookvideos"
      >
      </q-btn>
      <q-btn
        class="footerMenuButton"
        size="13px"
        color="#3d3760"
        stack
        flat
        icon="live_tv"
        label="料理チャンネル"
        to="/youtubers"
      >
      </q-btn>
      <q-btn
        class="footerMenuButton"
        size="13px"
        color="#3d3760"
        to="/reviewtotal"
        icon="fas fa-users"
        flat
        stack
        label="Reviewer一覧"
      >
      </q-btn>
    </q-footer>
    <!----------------->
    <!---- 最小 -------->
    <!----------------->
    <q-footer elevated class="footerExtraSmallSmall fixed-bottom">
      <q-btn
        class="footerMenuButton"
        icon="home"
        size="11px"
        color="#3d3760"
        flat
        stack
        to="/"
      ></q-btn>
      <q-btn
        class="footerMenuButton"
        size="14px"
        color="#3d3760"
        flat
        stack
        to="/genreCookvideos"
      >
        <q-icon style="width:26px;" name="restaurant" />
      </q-btn>
      <q-btn
        class="footerMenuButton"
        size="11px"
        color="#3d3760"
        flat
        stack
        to="/menuCookvideos"
      >
        <q-icon name="fas fa-book-open" style="width:26px;" />
      </q-btn>
      <q-btn
        class="footerMenuButton"
        size="11px"
        color="#3d3760"
        flat
        stack
        to="/materialCookvideos"
      >
        <q-icon name="fas fa-carrot" style="width:30px;" />
      </q-btn>
      <q-btn
        class="footerMenuButton"
        size="11px"
        color="#3d3760"
        stack
        flat
        to="/youtubers"
      >
        <q-icon name="live_tv" style="width:26px;" />
      </q-btn>
      <q-btn
        class="footerMenuButton"
        size="11px"
        color="#3d3760"
        to="/reviewtotal"
        flat
        stack
      >
        <q-icon name="fas fa-users" style="width:26px;" />
      </q-btn>
    </q-footer>
    <q-dialog v-model="alertToSignUp">
      <ToLoginAlert />
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      alertToSignUp: false
    };
  },
  computed: {
    ...mapState("openRec", ["openRecLiveDetail"]),
    ...mapState("twitch", ["twitchLiveDetail"]),
    ...mapState("auth", ["loggedIn", "userId"])
  },
  components: {
    ToLoginAlert: require("components/AlertModal/ToLoginAlert.vue").default
  }
};
</script>

<style lang="scss">
/* divタグによるメインコンテンツとのレイアウトの重複を修正 */
// .footerArrange {
//   margin-top: 55px;
//   position: relative;
// }
.footerLarge {
  height: 56px;
  position: absolute; /*　変更*/
  bottom: 0;
}
.footer-upperside {
  font-weight: bold;
  font-size: 15px;
}
.footer-downside {
  font-weight: bold;
  font-size: 12px;
  margin-top: 10px;
}

.footerMenuButton {
  width: 20%;
}
.footerMenuButtonNotActive {
  width: 20%;
  background-blend-mode: overlay;
  background: rgb(158, 164, 165);
}

.starActiveFooter {
  color: #ffd400;
}
.starNonActiveFooter {
  color: rgb(247, 236, 175);
}
.q-router-link--active {
  color: #f7ac51;
}

@media screen and (min-width: 811px) {
  .footerSmallSmall {
    display: none;
  }
  .footerExtraSmallSmall {
    display: none;
  }
}
@media screen and (min-width: 500px) and (max-width: 810px) {
  .footerLarge {
    display: none;
  }
  .footerSmallSmall {
    height: 60px;
    position: fixed;
    bottom: 0;
    background: #f9f6f1;
    color: #9f7346;
    display: flex;
    justify-content: center;
  }
  .footerExtraSmallSmall {
    display: none;
  }
}
// iPhone11ProMax
// iPhone11
@media screen and (min-width: 414px) and (max-width: 499px) {
  .footerLarge {
    display: none;
  }
  .footerSmallSmall {
    display: none;
  }
  .footerExtraSmallSmall {
    height: 68px;
    position: fixed;
    bottom: 0;
    background: #f9f6f1;
    color: #9f7346;
    display: flex;
    justify-content: center;
    padding-bottom: 15px;

    .q-btn__wrapper {
      padding: 4px 3px;
    }
  }
}
@media screen and (min-width: 375px) and (max-width: 413px) {
  .footerLarge {
    display: none;
  }
  .footerSmallSmall {
    display: none;
  }
  .footerExtraSmallSmall {
    height: 65px;
    position: fixed;
    bottom: 0;
    background: #f9f6f1;
    color: #9f7346;
    display: flex;
    justify-content: center;
    padding-bottom: 14px;
    .q-btn__wrapper {
      padding: 4px 3px;
    }
  }
  .footerMenuButton {
    width: 14%;
  }
  .footerMenuButtonNotActive {
    width: 14%;
    background-blend-mode: overlay;
    background: rgb(158, 164, 165);
  }
  .platform-ios {
    .q-footer {
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
      height: 70px;
    }
  }
}
@media screen and (min-width: 320px) and (max-width: 374px) {
  .footerLarge {
    display: none;
  }
  .footerSmallSmall {
    display: none;
  }
  .footerExtraSmallSmall {
    height: 55px;
    position: fixed;
    bottom: 0;
    background: #f9f6f1;
    color: #9f7346;
    display: flex;
    justify-content: center;

    .q-btn__wrapper {
      padding: 4px 3px;
    }
  }
  .footerMenuButton {
    width: 14%;
  }
  .footerMenuButtonNotActive {
    width: 14%;
    background-blend-mode: overlay;
    background: rgb(158, 164, 165);
  }
  .platform-ios {
    .q-footer {
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
      height: 70px;
    }
  }
}
</style>
