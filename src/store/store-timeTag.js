import { firestoreDb } from "src/boot/firebase";
import Vue from "vue";
const state = {
  timeTag: {}
};

const mutations = {
  getAllTimeTagsMutate(state, payload) {
    Vue.set(state.timeTag, payload.id, payload.obj);
  }
};
const actions = {
  async getTimeTag({ commit }) {
    const snap = await firestoreDb.collection("timeTag").get();
    snap.forEach(doc => {
      let payload = {
        id: doc.id,
        obj: doc.data()
      };
      commit("getAllTimeTagsMutate", payload);
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
