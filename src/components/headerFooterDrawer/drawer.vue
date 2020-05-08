<template>
  <q-drawer v-model="drawer" show-if-above :width="190" :breakpoint="768">
    <q-scroll-area class="fit">
      <q-list padding class="menu-list">
        <q-item clickable v-ripple flat to="/" exact class="drawerIcon">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>HOME</q-item-section>
        </q-item>
        <!-- 通常のドロア -->
        <div>
          <q-item clickable v-ripple flat to="/cookvideos" exact class="drawerIcon">
            <q-item-section avatar style="color:#9f7346;">
              <q-icon name="restaurant" />
            </q-item-section>
            <q-item-section>料理動画一覧</q-item-section>
          </q-item>
          <q-item clickable v-ripple flat to="/youtubers" exact class="drawerIcon">
            <q-item-section avatar>
              <q-icon name="live_tv" />
            </q-item-section>
            <q-item-section>料理チャンネル</q-item-section>
          </q-item>
          <q-item clickable v-ripple flat to="/reviewers" exact class="drawerIcon">
            <q-item-section avatar>
              <q-icon name="fas fa-users" />
            </q-item-section>
            <q-item-section>Reviewer一覧</q-item-section>
          </q-item>
          <q-item clickable v-ripple flat to="/news" exact class="drawerIcon">
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>
            <q-item-section>News</q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      drawer: false
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn"]),
    ...mapState("youtubers", ["search"]),
    searchField: {
      get() {
        return this.search;
      },
      set(value) {
        this.setSearch(value);
      }
    }
  },
  methods: {
    ...mapActions("auth", ["logoutUser"]),
    ...mapActions("youtubers", ["setSearch"])
  },
  components: {}
};
</script>

<style>
.q-drawer {
  background-color: #f9f7f2;
}
.drawerIcon {
  color: #9f7346;
}
.q-item.q-router-link--active {
  color: #f7b25d;
}
</style>

 <!-- アカウント情報のドロア -->
        <!-- <div
          v-if="
              $route.path == '/account' ||
                $route.path == '/contact' ||
                $route.path == '/withdrawal'
            "
        >
          <router-link
            :to="{
                name: 'account',
                query: { id: Object.values(userInfo)[0].id }
              }"
            class="routerDec"
          >
            <q-item clickable v-ripple flat exact class="drawerIcon">
              <q-item-section avatar>
                <q-icon name="assignment" />
              </q-item-section>
              <q-item-section>アカウント情報</q-item-section>
            </q-item>
          </router-link>
          <q-item clickable v-ripple flat to="/contact" exact class="drawerIcon">
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>
            <q-item-section>お問い合わせ</q-item-section>
          </q-item>
        </div> -->