import * as firebase from "firebase/app";
import { firestoreDb } from "src/boot/firebase";
import Vue from "vue";
const state = {
  materialTag: {}
};

const mutations = {
  getAllMaterialTagsMutate(state, payload) {
    console.log(payload);
    Vue.set(state.materialTag, payload.id, payload.obj);
  }
};
const actions = {
  async getMaterialTag({ commit }) {
    const snap = await firestoreDb.collection("materialTag").get();
    snap.forEach(doc => {
      let payload = {
        id: doc.id,
        obj: doc.data()
      };
      commit("getAllMaterialTagsMutate", payload);
    });
  }
};

const getters = {
  materialSelectedVideo: (state, getters, rootState, rootGetters) => id => {
    console.log(id);
    const MenutagName = state.materialTag[id].name;
    const rankObj = rootGetters["videos/CookVideoStarOrder"];
    console.log(rankObj);
    let newReturnObj = {};
    Object.keys(rankObj).forEach(key => {
      if (rankObj[key].materials) {
        const obj = rankObj[key].materials;
        Object.keys(obj).forEach(KEY => {
          console.log(KEY);
          if (Object.keys(obj[KEY]).includes(MenutagName)) {
            newReturnObj[key] = rankObj[key];
          }
        });
      }
    });
    console.log(newReturnObj);
    return newReturnObj;
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
