<template>
  <div>
    <q-page padding class="bg-grey-1">
      <q-card class="auth-tabs absolute-center">
        <h6 class="text-bold q-mt-lg" style="margin-bottom:16px;">ログイン</h6>
        <p class="text-subtitle2" style="font-weight:bold">既に会員登録がお済みの方はこちらからログインを進めてください</p>
        <div id="firebaseui-auth-container"></div>
        <div class="SignUp-wrapper">
          <p
            class="text-blue-9 text-subtitle2 cursor-pointer SingnUp"
            @click="ToSignUpPage()"
          >新規ユーザー登録はこちらから</p>
        </div>
      </q-card>
    </q-page>

    <q-dialog v-model="TermsOfService">
      <TermsOfService />
    </q-dialog>
  </div>
</template>

<script>
import { uiConfig, ui } from "src/boot/firebase";
import "firebaseui-ja/dist/firebaseui.css";
export default {
  data() {
    return {
      TermsOfService: false
    };
  },
  methods: {
    ToSignUpPage() {
      this.$router.push("/auth/sign_up");
    }
  },
  mounted() {
    ui.start("#firebaseui-auth-container", uiConfig);
  },
  components: {
    TermsOfService: require("components/Auth/TermsOfService.vue").default
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
.googleAuthButton {
  margin-top: 48px;
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
  margin-top: 15px;
}
#firebaseui-auth-container {
  display: flex;
  justify-content: center;
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
}
</style>
