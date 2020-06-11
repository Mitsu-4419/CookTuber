import * as firebase from "firebase/app";
import { firestoreDb } from "src/boot/firebase";
import Vue from "vue";
const state = {
  menuTag: {}
};

const mutations = {
  getAllMenuTagsMutate(state, payload) {
    console.log(payload);
    Vue.set(state.menuTag, payload.id, payload.obj);
  }
};
const actions = {
  async getMenuTag({ commit }) {
    const snap = await firestoreDb.collection("menuTag").get();
    snap.forEach(doc => {
      let payload = {
        id: doc.id,
        obj: doc.data()
      };
      commit("getAllMenuTagsMutate", payload);
    });
  }
};

const getters = {
  menuSelectedVideo: (state, getters, rootState, rootGetters) => id => {
    console.log(id);
    const MenutagName = state.menuTag[id].menuName;
    const rankObj = rootGetters["videos/CookVideoStarOrder"];
    console.log(rankObj);
    let newReturnObj = {};
    Object.keys(rankObj).forEach(key => {
      if (rankObj[key].videoTitle.includes(MenutagName)) {
        newReturnObj[key] = rankObj[key];
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
