import * as firebase from "firebase/app";
import { firestoreDb } from "src/boot/firebase";
import Vue from "vue";
const state = {
  cookVideos: {}
};
const mutations = {
  setAllCookingVideosMutation(state, payload) {
    Vue.set(state.cookVideos, payload.id, payload.obj);
  }
};

const actions = {
  async getAllCookingVideos({ commit }) {
    const sp = await firestoreDb.collection("video_info").get();
    sp.forEach(doc => {
      let payload = {
        id: doc.id,
        obj: doc.data()
      };
      commit("setAllCookingVideosMutation", payload);
    });
  }
};

const getters = {
  CookVideoStarOrder: state => {
    const videos = state.cookVideos;
    // channelIdと星を１対１に対応したObjの配列をつく
    Object.keys(videos).forEach(key => {
      let averageStar =
        Number(videos[key].starPoint) / Number(videos[key].registerCount);
      videos[key]["AverageStar"] = averageStar;
    });
    let array = Object.values(videos);
    array.sort(function(a, b) {
      if (Number(a.AverageStar) < Number(b.AverageStar)) return 1;
      if (Number(a.AverageStar) > Number(b.AverageStar)) return -1;
      return 0;
    });
    let returnObject = {};
    for (let i in array) {
      returnObject[array[i].videoId] = videos[array[i].videoId];
    }
    return returnObject;
  },
  // tagの配列が送られた時にTagに基づいてソートしてObjを返す
  sortByTagOfCookVideos: state => payload => {
    const videos = state.cookVideos;
    console.log(payload);
    if (!payload.length) {
      return videos;
    } else {
      Object.keys(videos).forEach(key => {
        // いくつか選ばれたタグのスコアを加算していくためにScoreという項目をつくる
        videos[key]["score"] = 0;
        for (let j in payload) {
          if (Object.keys(videos[key].tagMap).includes(payload[j])) {
            videos[key]["score"] += Number(videos[key]["tagMap"][payload[j]]);
          }
        }
      });
      let array = Object.values(videos);
      array.sort(function(a, b) {
        if (Number(a.score) < Number(b.score)) return 1;
        if (Number(a.score) > Number(b.score)) return -1;
        return 0;
      });
      let returnObject = {};
      for (let i in array) {
        returnObject[array[i].videoId] = videos[array[i].videoId];
      }
      return returnObject;
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
