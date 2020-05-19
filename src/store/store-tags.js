import * as firebase from "firebase/app";
import { firestoreDb } from "src/boot/firebase";
import Vue from "vue";
const state = {
  allTags: {}
};
console.log(state.allTags);
const mutations = {
  getAllTagsMutate(state, payload) {
    Vue.set(state.allTags, payload.id, payload.obj);
  },
  setVideoTagMutate(state, payload) {
    if (
      !state.allTags[payload.id]["related_VTR"] ||
      !state.allTags[payload.id]["related_VTR"][payload.videoId]
    ) {
      const VTRID = payload.videoId;
      state.allTags[payload.id]["related_VTR"] = { [VTRID]: 1 };
      firestoreDb
        .collection("allTag")
        .doc(payload.id)
        .update({
          ["related_VTR." + payload.videoId]: 1
        });
    } else {
      let beforeNum = state.allTags[payload.id].related_VTR[payload.videoId];
      Vue.set(
        state.allTags[payload.id]["related_VTR"],
        payload.videoId,
        beforeNum++
      );
      firestoreDb
        .collection("allTag")
        .doc(payload.id)
        .update({
          ["related_VTR." + payload.videoId]: beforeNum++
        });
    }
  },
  async reduceResultTagMutate(state, payload) {
    let beforeNum = Number(
      state.allTags[payload.key]["related_VTR"][payload.videoId]
    );
    console.log(beforeNum);
    Vue.set(
      state.allTags[payload.key]["related_VTR"],
      payload.videoId,
      beforeNum--
    );
    console.log(beforeNum);
    await firestoreDb
      .collection("allTag")
      .doc(payload.key)
      .update({
        ["related_VTR." + payload.videoId]: beforeNum
      });
  },
  async addNewTagMutate(state, payload) {
    if (
      !state.allTags[payload.key]["related_VTR"] ||
      !state.allTags[payload.key]["related_VTR"][payload.videoId]
    ) {
      const VTRID = payload.videoId;
      state.allTags[payload.key]["related_VTR"] = { [VTRID]: 1 };
      await firestoreDb
        .collection("allTag")
        .doc(payload.key)
        .update({
          ["related_VTR." + payload.videoId]: 1
        });
    } else {
      let changedNum = Number(
        state.allTags[payload.key]["related_VTR"][payload.videoId]
      );
      Vue.set(
        state.allTags[payload.key]["related_VTR"],
        payload.videoId,
        changedNum++
      );
      await firestoreDb
        .collection("allTag")
        .doc(payload.key)
        .update({
          ["related_VTR." + payload.videoId]: changedNum
        });
    }
  }
};
const actions = {
  async getTags({ commit }) {
    const snap = await firestoreDb.collection("allTag").get();
    snap.forEach(doc => {
      let payload = {
        id: doc.id,
        obj: doc.data()
      };
      commit("getAllTagsMutate", payload);
    });
  },
  // お気に入りが登録された時にタグにそのVideoIdを配列として保存する
  setVideoAtTag({ commit }, payload) {
    let array = payload.selectedTags;
    for (let i = 0; i < array.length; i++) {
      let Payload = {
        videoId: payload.videoId,
        id: array[i]
      };
      commit("setVideoTagMutate", Payload);
    }
  },
  async updateVideoAtTag({ commit }, payload) {
    if (payload.deletedTagArray) {
      for (let i in payload.deletedTagArray) {
        let PAYload = {
          key: payload.deletedTagArray[i],
          videoId: payload.videoId
        };
        commit("reduceResultTagMutate", PAYload);
      }
    }
    if (payload.addedTagArray) {
      for (let k in payload.addedTagArray) {
        let payLOAD = {
          key: payload.addedTagArray[k],
          videoId: payload.videoId
        };
        commit("addNewTagMutate", payLOAD);
      }
    }
  }
};

const getters = {
  sortedTag: state => genre => {
    const alltags = state.allTags;
    if (genre == "countryLarge") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].genre == "countryLarge") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (genre == "materialLarge") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].genre == "materialLarge") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (genre == "specialGenre") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].genre == "specialGenre") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (genre == "time") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].genre == "time") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (genre == "meatSmall") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].genre == "meatSmall") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (genre == "fishSmall") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].genre == "fishSmall") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (genre == "riceSmall") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].genre == "riceSmall") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (genre == "vegetableSmall") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].genre == "vegetableSmall") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (genre == "noodleSmall") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].genre == "noodleSmall") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
