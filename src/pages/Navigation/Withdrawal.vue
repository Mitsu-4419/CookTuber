<template>
  <q-page padding class="bg-grey-1">
    <q-card class="withdrawl-tabs absolute-center">
      <q-card-section>
        <h6 class="text-bold q-mt-sm withdrawlTitle">退会手続き</h6>
        <q-img src="statics/headerLogo/logo2.png"></q-img>
      </q-card-section>
      <q-card-section>
        <p class="withdrawlDetail">
          「退会する」ボタンをクリックすると、退会手続きが完了致します。
          <br />登録情報の復旧は弊社サービスのシステムの都合上、お受け致しかねます。予めご了承下さい。
          <br />「CookTuber」をご利用頂き、誠にありがとうございました！
        </p>
      </q-card-section>
      <q-card-actions class="withdrawl-wrapper">
        <q-btn flat label="退会する" color="primary" @click="ToWithdrawl()" />
        <q-btn flat label="キャンセル" color="primary" @click="ToCancel()" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
import { deleteUserAccount } from "src/boot/firebase.js";
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    ToWithdrawl() {
      try {
        deleteUserAccount();
      } catch (error) {
        alert(
          "ログインの有効時間が過ぎています。一度ログアウトをして頂き、再度ログインした上でお試しください。"
        );
      }
    },
    ToCancel() {
      this.$router.push("/");
    }
  },
  mounted() {},
  components: {}
};
</script>

<style scoped>
.withdrawl-tabs {
  width: 450px;
  height: 450px;
  border-radius: 10px;
  margin: auto;
  padding: 10px 30px;
}
.withdrawlTitle {
  margin-bottom: 24px;
}
.withdrawlDetail {
  font-size: 15px;
  font-weight: bold;
}
.withdrawl-wrapper {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-content: center;
}
.q-mb-lg {
  margin-top: 16px;
  margin-bottom: 16px;
}
a {
  text-decoration: none;
}
@media screen and (min-width: 360px) and (max-width: 499px) {
  .withdrawl-tabs {
    width: 325px;
    height: 400px;
    border-radius: 10px;
    margin: auto;
    padding: 10px 30px;
  }
  .withdrawlTitle {
    margin-bottom: 10px;
  }
  .withdrawlDetail {
    font-size: 13px;
    font-weight: bold;
  }
}
</style>