import { firestoreDb } from "src/boot/firebase";
import Vue from "vue";

const state = {
  TopPageImage: {}
};

const mutations = {
  getTopPageImageMutate(state, payload) {
    Vue.set(state.TopPageImage, payload.id, payload.obj);
    console.log(state.TopPageImage);
  }
};

const actions = {
  async getTopPageImage({ commit }) {
    const sp = await firestoreDb.collection("topPageImage").get();
    sp.forEach(doc => {
      let payload = {
        id: doc.id,
        obj: doc.data()
      };
      commit("getTopPageImageMutate", payload);
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
