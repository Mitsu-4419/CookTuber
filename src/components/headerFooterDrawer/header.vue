<template>
  <q-header elevated>
    <q-toolbar>
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
      </q-avatar>
      <q-toolbar-title>
        <span class="headerTitle">Cook Tuber</span>
      </q-toolbar-title>
      <!-- 未ログインSTART -->
      <div class="loginWrapper">
        <div v-if="!loggedIn">
          <q-btn class="newRegisterButton" push color="black" label="新規登録" flat to="/auth/sign_up"></q-btn>
          <q-btn
            class="loginButtonLarge"
            push
            color="black"
            label="ログイン"
            flat
            icon-right="account_circle"
            to="/auth/sign_in"
          ></q-btn>
          <!-- <q-btn
            class="loginButtonSmall"
            push
            color="indigo-10"
            flat
            icon-right="account_circle"
            to="/auth/sign_in"
          ></q-btn>-->
        </div>
        <!-- 未ログインEND -->
        <!-- ログイン時の表示 -->
        <div v-else-if="loggedIn && LoginUserPublicData">
          <div class="q-pa-md">
            <q-avatar size="md">
              <img :src="LoginUserPublicData['photoURL']" />
            </q-avatar>
            <q-btn-dropdown color="black" flat :label="LoginUserPublicData['nickName']">
              <q-list>
                <router-link
                  class="routerDec"
                  :to="{
                      name: 'mypage',
                      query: { id: userId }
                    }"
                >
                  <q-item clickable v-close-popup class="text-black">
                    <q-item-section>
                      <q-item-label>マイページ</q-item-label>
                    </q-item-section>
                  </q-item>
                </router-link>
                <router-link
                  :to="{
                    name: 'account'
                  }"
                  class="routerDec"
                >
                  <q-item clickable v-close-popup class="text-black">
                    <q-item-section>
                      <q-item-label>アカウント情報</q-item-label>
                    </q-item-section>
                  </q-item>
                </router-link>
                <router-link to="/contact" class="routerDec">
                  <q-item clickable v-close-popup class="text-black">
                    <q-item-section>
                      <q-item-label>お問い合わせ</q-item-label>
                    </q-item-section>
                  </q-item>
                </router-link>
                <q-item clickable v-close-popup @click="logoutUser">
                  <q-item-section>
                    <q-item-label>ログアウト</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("auth", ["loggedIn", "userId"]),
    ...mapState("usersPublic", ["usersPublicInfo"]),
    LoginUserPublicData() {
      return this.usersPublicInfo[this.userId];
    }
  },
  methods: {
    ...mapActions("auth", ["logoutUser"])
  }
};
</script>

<style>
.headerTitle {
  color: #3c3c3c;
  font-weight: bold;
  font-size: 25px;
}
.routerDec {
  text-decoration: none;
}
</style>
