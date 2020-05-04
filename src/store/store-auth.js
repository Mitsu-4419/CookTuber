import { LocalStorage, Loading } from "quasar";
import { firebaseAuth } from "src/boot/firebase";
const state = {
  loggedIn: false,
  userId: ""
};
const mutations = {
  setLoggedIn(state, value) {
    state.loggedIn = value;
  },
  setUserInfo(state, value) {
    state.userId = value;
  }
};
const actions = {
  logoutUser() {
    firebaseAuth.signOut();
  },
  handleAuthStateChange({ commit, dispatch }) {
    firebaseAuth.onAuthStateChanged(async user => {
      Loading.hide();
      let isNewUser = localStorage.getItem("isNewUser");
      if (user) {
        commit("setLoggedIn", true);
        commit("setUserInfo", user.uid);
        // 初めてのユーザーの場合最初にDisplayNameを決めてもらう。
        if (isNewUser == "true") {
          this.$router.push("/registerDisplayName").catch(err => {});
          dispatch("usersPublic/setNewUserProfile", user.uid, { root: true });
        } else if (isNewUser == "false") {
          this.$router.push("/").catch(err => {});
        }
        LocalStorage.set("loggedIn", true);
      } else {
        commit("setLoggedIn", false);
        LocalStorage.set("loggedIn", false);
        commit("deleteUserInfo", {});
        this.$router.replace("/").catch(err => {});
      }
    });
  }
};
const getters = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
