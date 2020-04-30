import * as firebase from "firebase/app";
import { firestoreDb, firestorebase } from "src/boot/firebase";
import Vue from "vue";
const state = {
  allTags: {}
};
const mutations = {
  getAllTagsMutate(state, payload) {
    Vue.set(state.allTags, "allTags", payload);
  }
};

const actions = {
  async getTags({ commit }) {
    const snap = await firestoreDb
      .collection("allTags")
      .doc("tag")
      .get();
    let payload = snap.data();
    commit("getAllTagsMutate", payload);
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
