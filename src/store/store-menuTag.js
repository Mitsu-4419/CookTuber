import { firestoreDb } from "src/boot/firebase";
import Vue from "vue";
import { arrayIncludedOrNot } from "src/functions/arrayIncludedOrNot";
import { arrayElementIncludeOrNot } from "src/functions/arrayElementIncludeOrNot";
const state = {
  menuTag: {}
};

const mutations = {
  getAllMenuTagsMutate(state, payload) {
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
  sortedMenuTag: state => meta => {
    const alltags = state.menuTag;
    let returnObj = {};
    if (meta == "meat") {
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "meat") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (meta == "rice") {
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "rice") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (meta == "chinese") {
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "special") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (meta == "noodle") {
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "noodle") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (meta == "other") {
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "other") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    }
  },
  menuSelectedVideo: (state, getters, rootState, rootGetters) => (
    payload,
    model
  ) => {
    const rankObj = rootGetters["videos/CookVideoStarOrder"];
    let resultObject = {};
    if (payload.menuArray.length == 0 && payload.timeMenuArray.length == 0) {
      let array = Object.values(rankObj);
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
    } else if (
      payload.menuArray.length > 0 &&
      payload.timeMenuArray.length == 0
    ) {
      Object.keys(rankObj).forEach(key => {
        if (arrayIncludedOrNot(payload.menuArray, rankObj[key].menuTag)) {
          resultObject[key] = rankObj[key];
        }
      });
      let array = Object.values(resultObject);
      if (model == "星の数順") {
        array.sort(function(a, b) {
          if (Number(a.AverageStar) < Number(b.AverageStar)) return 1;
          if (Number(a.AverageStar) > Number(b.AverageStar)) return -1;
          return 0;
        });
        return array;
      } else if (model == "再生回数順") {
        array.sort(function(a, b) {
          if (Number(a.viewCount) < Number(b.viewCount)) return 1;
          if (Number(a.viewCount) > Number(b.viewCount)) return -1;
          return 0;
        });
        return array;
      } else if (model == "レビュー数多い順") {
        array.sort(function(a, b) {
          if (Number(a.registerCount) < Number(b.registerCount)) return 1;
          if (Number(a.registerCount) > Number(b.registerCount)) return -1;
          return 0;
        });
        return array;
      } else if (model == "投稿日が最近順") {
        array.sort(function(a, b) {
          if (Number(new Date(a.publishedAt)) < Number(new Date(b.publishedAt)))
            return 1;
          if (Number(new Date(a.publishedAt)) > Number(new Date(b.publishedAt)))
            return -1;
          return 0;
        });
      }
    } else if (
      payload.menuArray.length == 0 &&
      payload.timeMenuArray.length > 0
    ) {
      Object.keys(rankObj).forEach(key => {
        if (
          arrayElementIncludeOrNot(payload.timeMenuArray, rankObj[key].timeTag)
        ) {
          resultObject[key] = rankObj[key];
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
          return array;
        } else if (model == "再生回数順") {
          array.sort(function(a, b) {
            if (Number(a.viewCount) < Number(b.viewCount)) return 1;
            if (Number(a.viewCount) > Number(b.viewCount)) return -1;
            return 0;
          });
          return array;
        } else if (model == "レビュー数多い順") {
          array.sort(function(a, b) {
            if (Number(a.registerCount) < Number(b.registerCount)) return 1;
            if (Number(a.registerCount) > Number(b.registerCount)) return -1;
            return 0;
          });
          return array;
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
          return array;
        }
      } else {
        let MArray = [];
        return MArray;
      }
    } else {
      Object.keys(rankObj).forEach(key => {
        if (
          arrayIncludedOrNot(payload.menuArray, rankObj[key].menuTag) &&
          arrayElementIncludeOrNot(payload.timeMenuArray, rankObj[key].timeTag)
        ) {
          resultObject[key] = rankObj[key];
        }
      });
      let array = Object.values(resultObject);
      if (model == "星の数順") {
        array.sort(function(a, b) {
          if (Number(a.AverageStar) < Number(b.AverageStar)) return 1;
          if (Number(a.AverageStar) > Number(b.AverageStar)) return -1;
          return 0;
        });
        return array;
      } else if (model == "再生回数順") {
        array.sort(function(a, b) {
          if (Number(a.viewCount) < Number(b.viewCount)) return 1;
          if (Number(a.viewCount) > Number(b.viewCount)) return -1;
          return 0;
        });
        return array;
      } else if (model == "レビュー数多い順") {
        array.sort(function(a, b) {
          if (Number(a.registerCount) < Number(b.registerCount)) return 1;
          if (Number(a.registerCount) > Number(b.registerCount)) return -1;
          return 0;
        });
        return array;
      } else if (model == "投稿日が最近順") {
        array.sort(function(a, b) {
          if (Number(new Date(a.publishedAt)) < Number(new Date(b.publishedAt)))
            return 1;
          if (Number(new Date(a.publishedAt)) > Number(new Date(b.publishedAt)))
            return -1;
          return 0;
        });
      }
    }
    return resultObject;
  },
  sortByMenuOfCookVideosTop5: (state, getters) => (payload, model) => {
    let videoObj = getters.menuSelectedVideo(payload, model);
    let keyArray = [];
    if (videoObj.length > 5) {
      for (let i = 0; i < 5; i++) {
        keyArray.push(videoObj[i]);
      }
      return keyArray;
    } else {
      for (let j = 0; j < videoObj.length; j++) {
        console.log(videoObj[j]);
      }
      return videoObj;
    }
  },
  allmenuTags: state => {
    const keyArray = Object.keys(state.menuTag);
    let returnObj = {};
    for (let i in keyArray) {
      returnObj[keyArray[i]] = false;
    }
    return returnObj;
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
