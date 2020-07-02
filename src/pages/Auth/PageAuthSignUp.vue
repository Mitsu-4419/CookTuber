<template>
  <div>
    <q-page padding class="bg-grey-1">
      <q-card class="auth-tabs absolute-center">
        <h6 class="text-bold q-mt-lg" style="margin-bottom:16px;">新規会員登録</h6>
        <p class="text-subtitle2" style="font-weight:bold">
          「CookTuber」をご利用になるには
          <span
            class="text-blue-9 cursor-pointer"
            @click="TermsOfService = true"
          >利用規約</span>と
          <span class="text-blue-9 cursor-pointer" @click="PrivacyPolicy = true">プライバシーポリシー</span>に同意して頂く必要があります。
        </p>
        <div class="signup-wrapper">
          <div id="firebaseui-auth-container"></div>
        </div>
        <!-- FirebaseUI(CSS外部指定、変更不可)に押しやられる -->
        <!-- <div class="SignUp-wrapper">
          <p class="text-blue-9 cursor-pointer SingnUp" @click="ToLoginPage()">ログインはこちら</p>
        </div>-->
      </q-card>
    </q-page>

    <q-dialog v-model="TermsOfService">
      <TermsOfService />
    </q-dialog>
    <q-dialog v-model="PrivacyPolicy">
      <PrivacyPolicy />
    </q-dialog>
  </div>
</template>

<script>
import { uiConfig, ui } from "src/boot/firebase";
import "firebaseui-ja/dist/firebaseui.css";
export default {
  data() {
    return {
      TermsOfService: false,
      PrivacyPolicy: false
    };
  },
  methods: {
    // ToLoginPage() {
    //   this.$router.push("/auth/sign_in");
    // }
  },
  mounted() {
    ui.start("#firebaseui-auth-container", uiConfig);
  },
  components: {
    TermsOfService: require("components/Auth/TermsOfService.vue").default,
    PrivacyPolicy: require("components/Auth/PrivacyPolicy.vue").default
  }
};
</script>

<style scoped>
.auth-tabs {
  width: 450px;
  height: 505px;
  border-radius: 10px;
  margin: auto;
  padding: 16px 24px;
  font-size: 12px;
  font-weight: bold;
}
/*ログインのボタン */
#firebaseui-auth-container {
  display: flex;
  justify-content: center;
}
.firebaseui-idp-google {
  border-radius: 20px;
  width: 400px;
}
.SignUp-wrapper {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-content: center;
}
.SingnUp {
  margin-right: auto;
  margin-left: auto;
  margin-top: 8px;
}
.q-mb-lg {
  margin-top: 8px;
  margin-bottom: 8px;
}
@media screen and (min-width: 360px) and (max-width: 499px) {
  .auth-tabs {
    width: 300px;
    height: 480px;
    border-radius: 10px;
    margin: auto;
    padding: 15px 30px;
    margin-top: -55px;
  }
  .signup-wrapper {
    margin-top: -15px;
  }
  .SignUp-wrapper {
    margin-top: -15px;
  }
}
</style>