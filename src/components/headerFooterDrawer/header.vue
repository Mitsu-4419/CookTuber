<template>
  <q-header elevated>
    <q-toolbar class="bg-head headerTop">
      <q-toolbar-title>
        <div class="row">
          <q-btn flat to="/" class="headerTitleIcon" id="headerHomeButton">
            <q-img src="../../statics/Logo/CookTuber_LOGO.png" class="cooktuberLogoIcon"></q-img>
            <!-- <q-toolbar-title>
              <span class="headerTitle">Cook Tuber</span>
            </q-toolbar-title>-->
          </q-btn>
          <!-- 検索バー -->
          <router-link
            :to="{ name: 'search', query: { key: 'webPage' } }"
            style="text-decoration: none;"
          >
            <q-input
              rounded
              outlined
              placeholder="料理名・YouTuber・ユーザーを検索"
              class="searchBar"
              v-model="searchField"
              bottom-slots
              bg-color="white"
              :rules="[
                val =>
                  val.length >= 3 ||
                  val.length == 0 ||
                  '３文字以上入力してください'
              ]"
            >
              <template v-slot:append>
                <q-icon name="close" @click="searchField = ''" class="cursor-pointer deleteicon" />
              </template>
            </q-input>
          </router-link>
        </div>
      </q-toolbar-title>
      <router-link to="/search" style="text-decoration: none;">
        <q-icon name="fas fa-search" size="sm" color="black" class="searchIcon"></q-icon>
      </router-link>
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
          <q-btn-dropdown
            class="loginButtonSmall"
            flat
            color="black"
            icon-right="account_circle"
            style="margin-left:7px;"
          >
            <q-list>
              <q-item clickable v-close-popup to="/auth/sign_in">
                <q-item-section>
                  <q-item-label>ログイン</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/others">
                <q-item-section>
                  <q-item-label>その他</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <!-- 未ログインEND -->
        <!-- ログイン時の表示 -->
        <div v-else-if="loggedIn && LoginUserPublicData">
          <div class="q-pa-md">
            <q-avatar size="md">
              <img :src="LoginUserPublicData['photoURL']" />
            </q-avatar>
            <q-btn-dropdown
              class="qBtnDropdownLarge"
              color="black"
              flat
              :label="LoginUserPublicData['nickName']"
            >
              <q-list>
                <router-link
                  class="routerDec"
                  :to="{
                    name: 'mypage',
                    query: { id: userId }
                  }"
                  exact
                  replace
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
                <q-item clickable v-close-popup to="/others">
                  <q-item-section>
                    <q-item-label>その他</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <!-- 携帯サイズの時の表示 -->
            <q-btn-dropdown class="qBtnDropdownSmall" color="black" flat>
              <q-list>
                <router-link
                  class="routerDec"
                  :to="{
                    name: 'mypage',
                    query: { id: userId }
                  }"
                  exact
                  replace
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
                <q-item clickable v-close-popup to="/others">
                  <q-item-section>
                    <q-item-label>その他</q-item-label>
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
    ...mapState("videos", ["search"]),
    LoginUserPublicData() {
      return this.usersPublicInfo[this.userId];
    },
    searchField: {
      get() {
        return this.search;
      },
      set(value) {
        this.setSearch(value);
      },
    },
  },
  methods: {
    ...mapActions("auth", ["logoutUser"]),
    ...mapActions("videos", ["setSearch"]),
  },
};
</script>

<style lang="scss">
/* ヘッダー */
.headerTitle {
  color: #3c3c3c;
  font-weight: bold;
  font-size: 20px;
}
.headerTop {
  position: initial;
  height: 75px;
  padding-top: 25px;
  background: #f7f3e8;
}

.headerTitleIcon {
  width: 220px;
}
.cooktuberLogoIcon {
  width: 200px;
  height: 38px;
}
.menuIcon {
  color: #767194;
  width: 24px;
  height: 24px;
  font-size: 22px;
  margin-right: 16px;
}
.routerDec {
  text-decoration: none;
}
/* SearchBar */
.searchBar {
  padding: 0;
  margin-right: 10px;
  margin-left: 30px;
  width: 300px;
  margin-top: 7px;
  margin-bottom: 12px;
  .q-field__control {
    height: 40px;
  }
}

.deleteicon {
  margin-bottom: 14px;
}
/* 検索バーのエラー文 */
.text-negative {
  padding-bottom: 14px;
}
.q-field--error .q-field__bottom {
  color: #c10015;
  color: var(--q-color-negative);
  margin-bottom: 8px;
}
/* 検索Inputの大きさを変化 */
@media screen and (min-width: 834px) and (max-width: 1024px) {
  .searchBar {
    width: 240px;
    font-size: 12px;
  }
}
@media screen and (min-width: 834px) and (max-width: 833px) {
  .searchBar {
    width: 240px;
    font-size: 12px;
  }
}
@media screen and (min-width: 320px) and (max-width: 834px) {
  .searchBar {
    display: none;
  }
}
@media screen and (min-width: 500px) {
  .loginButtonSmall {
    display: none;
  }
  .qBtnDropdownSmall {
    display: none;
  }
  .headerTop {
    padding-top: 5px;
    height: 65px;
  }
}
@media screen and (min-width: 835px) {
  .searchIcon {
    display: none;
  }
}

@media screen and (max-width: 499px) {
  .headerTitle {
    font-size: 13px;
  }
  .qBtnDropdownLarge {
    display: none;
  }
}

/* スマホのみ適用の設定 */
/* iPhoneXR, XS  */
@media screen and (min-width: 414px) and (max-width: 499px) {
  /* widthの関係でスマホからはログインボタンのみを表示 */
  .newRegisterButton {
    display: none;
  }
  .loginButtonLarge {
    display: none;
  }
  .headerTop {
    height: 66px;
  }
  .headerTitleIcon {
    width: 200px;
    margin-top: 30px;
    margin-left: 0px;
  }
  .loginWrapper {
    margin-top: 30px;
  }
  .searchIcon {
    margin-top: 30px;
  }
  .q-toolbar {
    padding-bottom: 10px;
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
  }
}
/* iPhoneX, 8PLUS, 8 */
@media screen and (min-width: 375px) and (max-width: 413px) {
  /* widthの関係でスマホからはログインボタンのみを表示 */
  .newRegisterButton {
    display: none;
  }
  .loginButtonLarge {
    display: none;
  }
  .headerTop {
    height: 70px;
  }
  .headerTitleIcon {
    width: 200px;
    margin-top: 30px;
    margin-left: 0px;
  }
  .loginWrapper {
    margin-top: 30px;
  }
  .searchIcon {
    margin-top: 30px;
  }
  .loginButtonLarge {
    display: none;
  }
  .q-toolbar {
    padding-bottom: 3px;
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
  }
}
/* iPhone5など*/
@media screen and (min-width: 320px) and (max-width: 374px) {
  /* widthの関係でスマホからはログインボタンのみを表示 */
  .newRegisterButton {
    display: none;
  }
  .headerTop {
    height: 52px;
  }
  .headerTitleIcon {
    width: 200px;
    margin-top: 30px;
    margin-left: 0px;
  }
  .loginWrapper {
    margin-top: 30px;
  }
  .searchIcon {
    margin-top: 30px;
  }
  .loginButtonLarge {
    display: none;
  }
  .q-toolbar {
    padding-bottom: 24px;
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
