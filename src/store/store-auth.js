import { LocalStorage, Loading } from "quasar";
import { firebaseAuth } from "src/boot/firebase";

const state = {
  loggedIn: false,
  userId: ""
};
// console.log(state.userId);
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
      let isMailUser = localStorage.getItem("isMailUser");
      console.log(user);
      if (user) {
        commit("setLoggedIn", true);
        commit("setUserInfo", user.uid);
        LocalStorage.set("loggedIn", true);
        // 初めてのユーザーの場合最初にDisplayNameを決めてもらう。
        if (isNewUser == "true") {
          //新規登録時にヘッダーに名前表示のため、別ファイルのactionを呼び出し
          this.$router.push("/registerDisplayName").catch(err => {});
          dispatch("usersPublic/setNewUserProfile", user.uid, { root: true });
        } else if (isNewUser == "false") {
          this.$router.push("/").catch(err => {});
        } else if (isMailUser == "true" && user.emailVerified == true) {
          this.$router.push("/registerDisplayName").catch(err => {});
          dispatch("usersPublic/setNewUserProfile", user.uid, { root: true });
        }
      } else {
        commit("setLoggedIn", false);
        LocalStorage.set("loggedIn", false);
        //mutationにないが記述があった。ログイン時にエラーが出ている
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
