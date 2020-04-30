import * as firebase from "firebase/app";
import { LocalStorage, Loading } from "quasar";
import { firestoreDb, firestorebase, firebaseAuth } from "src/boot/firebase";
import Vue from "vue";
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
  handleAuthStateChange({ commit }) {
    firebaseAuth.onAuthStateChanged(async user => {
      Loading.hide();
      let isNewUser = localStorage.getItem("isNewUser");
      if (user) {
        commit("setLoggedIn", true);
        commit("setUserInfo", user.uid);
        LocalStorage.set("loggedIn", true);
        // 初めてのユーザーの場合最初にDisplayNameを決めてもらう。
        if (isNewUser == "true") {
          this.$router.push("/registerDisplayName").catch(err => {});
        } else if (isNewUser == "false") {
          this.$router.push("/").catch(err => {});
        }
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
