import { firestoreDb } from "src/boot/firebase";
import Vue from "vue";
import { arrayIncludedOrNot } from "src/functions/arrayIncludedOrNot";
import { arrayElementIncludeOrNot } from "src/functions/arrayElementIncludeOrNot";
const state = {
  genreTag: {}
};

const mutations = {
  getAllGenreTagsMutate(state, payload) {
    Vue.set(state.genreTag, payload.id, payload.obj);
  }
};
const actions = {
  async getGenreTag({ commit }) {
    const snap = await firestoreDb.collection("genreTag").get();
    snap.forEach(doc => {
      let payload = {
        id: doc.id,
        obj: doc.data()
      };
      commit("getAllGenreTagsMutate", payload);
    });
  }
};

const getters = {
  sortedGenreTag: state => genre => {
    const alltags = state.genreTag;
    if (genre == "country") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "country") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (genre == "material") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "material") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (genre == "special") {
      let returnObj = {};
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "special") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    }
  },
  sortByTagOfCookVideos: (state, getters, rootState, rootGetters) => (
    payload,
    model
  ) => {
    let resultObject = {};
    let videos = rootGetters["videos/CookVideoStarOrder"];
    if (payload.genreArray.length == 0 && payload.timeArray.length == 0) {
      let array = Object.values(videos);
      if (model == "星の数順") {
        array.sort(function(a, b) {
          if (Number(a.AverageStar) < Number(b.AverageStar)) return 1;
          if (Number(a.AverageStar) > Number(b.AverageStar)) return -1;
          return 0;
        });
      } else if (model == "再生回数順") {
        array.sort(function(a, b) {
          if (Number(a.viewCount) < Number(b.viewCount)) return 1;
          if (Number(a.viewCount) > Number(b.viewCount)) return -1;
          return 0;
        });
      } else if (model == "レビュー数多い順") {
        array.sort(function(a, b) {
          if (Number(a.registerCount) < Number(b.registerCount)) return 1;
          if (Number(a.registerCount) > Number(b.registerCount)) return -1;
          return 0;
        });
      } else if (model == "投稿日が最近順") {
        array.sort(function(a, b) {
          if (Number(new Date(a.publishedAt)) < Number(new Date(b.publishedAt)))
            return 1;
          if (Number(new Date(a.publishedAt)) > Number(new Date(b.publishedAt)))
            return -1;
          return 0;
        });
      }
      return array;
    } else if (payload.genreArray.length > 0 && payload.timeArray.length == 0) {
      Object.keys(videos).forEach(key => {
        if (arrayIncludedOrNot(payload.genreArray, videos[key].genreTag)) {
          resultObject[key] = videos[key];
        }
      });
      let array = Object.values(resultObject);
      if (model == "星の数順") {
        array.sort(function(a, b) {
          if (Number(a.AverageStar) < Number(b.AverageStar)) return 1;
          if (Number(a.AverageStar) > Number(b.AverageStar)) return -1;
          return 0;
        });
      } else if (model == "再生回数順") {
        array.sort(function(a, b) {
          if (Number(a.viewCount) < Number(b.viewCount)) return 1;
          if (Number(a.viewCount) > Number(b.viewCount)) return -1;
          return 0;
        });
      } else if (model == "レビュー数多い順") {
        array.sort(function(a, b) {
          if (Number(a.registerCount) < Number(b.registerCount)) return 1;
          if (Number(a.registerCount) > Number(b.registerCount)) return -1;
          return 0;
        });
      } else if (model == "投稿日が最近順") {
        array.sort(function(a, b) {
          if (Number(new Date(a.publishedAt)) < Number(new Date(b.publishedAt)))
            return 1;
          if (Number(new Date(a.publishedAt)) > Number(new Date(b.publishedAt)))
            return -1;
          return 0;
        });
      }
      return array;
    } else if (payload.genreArray.length == 0 && payload.timeArray.length > 0) {
      Object.keys(videos).forEach(key => {
        if (arrayElementIncludeOrNot(payload.timeArray, videos[key].timeTag)) {
          resultObject[key] = videos[key];
        }
      });
      if (Object.keys(resultObject)) {
        let array = Object.values(resultObject);
        if (model == "星の数順") {
          array.sort(function(a, b) {
            if (Number(a.AverageStar) < Number(b.AverageStar)) return 1;
            if (Number(a.AverageStar) > Number(b.AverageStar)) return -1;
            return 0;
          });
        } else if (model == "再生回数順") {
          array.sort(function(a, b) {
            if (Number(a.viewCount) < Number(b.viewCount)) return 1;
            if (Number(a.viewCount) > Number(b.viewCount)) return -1;
            return 0;
          });
        } else if (model == "レビュー数多い順") {
          array.sort(function(a, b) {
            if (Number(a.registerCount) < Number(b.registerCount)) return 1;
            if (Number(a.registerCount) > Number(b.registerCount)) return -1;
            return 0;
          });
        } else if (model == "投稿日が最近順") {
          array.sort(function(a, b) {
            if (
              Number(new Date(a.publishedAt)) < Number(new Date(b.publishedAt))
            )
              return 1;
            if (
              Number(new Date(a.publishedAt)) > Number(new Date(b.publishedAt))
            )
              return -1;
            return 0;
          });
        }
        return array;
      } else {
        let MArray = [];
        return MArray;
      }
    } else {
      Object.keys(videos).forEach(key => {
        if (
          arrayIncludedOrNot(payload.genreArray, videos[key].genreTag) &&
          arrayElementIncludeOrNot(payload.timeArray, videos[key].timeTag)
        ) {
          resultObject[key] = videos[key];
        }
      });
      let array = Object.values(resultObject);
      if (model == "星の数順") {
        array.sort(function(a, b) {
          if (Number(a.AverageStar) < Number(b.AverageStar)) return 1;
          if (Number(a.AverageStar) > Number(b.AverageStar)) return -1;
          return 0;
        });
      } else if (model == "再生回数順") {
        array.sort(function(a, b) {
          if (Number(a.viewCount) < Number(b.viewCount)) return 1;
          if (Number(a.viewCount) > Number(b.viewCount)) return -1;
          return 0;
        });
      } else if (model == "レビュー数多い順") {
        array.sort(function(a, b) {
          if (Number(a.registerCount) < Number(b.registerCount)) return 1;
          if (Number(a.registerCount) > Number(b.registerCount)) return -1;
          return 0;
        });
      } else if (model == "投稿日が最近順") {
        array.sort(function(a, b) {
          if (Number(new Date(a.publishedAt)) < Number(new Date(b.publishedAt)))
            return 1;
          if (Number(new Date(a.publishedAt)) > Number(new Date(b.publishedAt)))
            return -1;
          return 0;
        });
      }
      return array;
    }
  },
  sortByTagOfCookVideosTop5: (state, getters) => (payload, model) => {
    let videoObj = getters.sortByTagOfCookVideos(payload, model);
    let keyArray = [];
    if (videoObj.length > 5) {
      for (let i = 0; i < 5; i++) {
        keyArray.push(videoObj[i]);
      }
      return keyArray;
    } else {
      return videoObj;
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
