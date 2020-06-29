<template>
  <div>
    <q-page padding class="bg-grey-1">
      <q-card class="auth-tabs absolute-center">
        <q-card-section>
          <h6 class="text-bold q-mt-sm" style="margin-bottom:24px;">新規会員登録</h6>
          <p>「CookTuber」をご利用になるには以下の利用規約とプライバシーポリシーをご覧になり、同意していただく必要があります。</p>
          <p class="q-mt-lg">
            •
            <span class="text-blue-9 cursor-pointer" @click="TermsOfService = true">「CookTuber」利用規約</span>
          </p>
          <p class="q-mt-lg">
            •
            <span
              class="text-blue-9 cursor-pointer"
              @click="PrivacyPolicy = true"
            >「CookTuber」プライバシーポリシー</span>
          </p>
        </q-card-section>
        <div class="signup-wrapper">
          <div id="firebaseui-auth-container"></div>
        </div>
        <div class="SignUp-wrapper">
          <p class="text-blue-9 cursor-pointer SingnUp" @click="ToLoginPage()">ログインはこちら</p>
        </div>
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
    ToLoginPage() {
      this.$router.push("/auth/sign_in");
    }
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
  height: 450px;
  border-radius: 10px;
  margin: auto;
  padding: 10px 30px;
  font-size: 15px;
  font-weight: bold;
}
/* Twitterログインのボタン */
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
  margin-top: 15px;
}
.q-mb-lg {
  margin-top: 16px;
  margin-bottom: 16px;
}
@media screen and (min-width: 360px) and (max-width: 499px) {
  .auth-tabs {
    width: 300px;
    height: 400px;
    border-radius: 10px;
    margin: auto;
    padding: 5px 10px;
    font-size: 12px;
  }
  .signup-wrapper {
    margin-top: -15px;
  }
  .SignUp-wrapper {
    margin-top: -15px;
  }
}
</style>
