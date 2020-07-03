import { firestoreDb, firestorebase } from "src/boot/firebase";
import Vue from "vue";
import { arrayIncludedOrNot } from "src/functions/arrayIncludedOrNot";
import { arrayElementIncludeOrNot } from "src/functions/arrayElementIncludeOrNot";
const state = {
  materialTag: {}
};

const mutations = {
  getAllMaterialTagsMutate(state, payload) {
    // console.log(payload);
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
  sortedMaterialTag: state => meta => {
    const alltags = state.materialTag;
    let returnObj = {};
    if (meta == "vegetable") {
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "vegetable") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (meta == "meat") {
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
    } else if (meta == "fish") {
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "fish") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (meta == "wheat") {
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "wheat") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (meta == "alcohol") {
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "alcohol") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    } else if (meta == "seasoning") {
      Object.keys(alltags).forEach(key => {
        if (alltags[key].meta == "seasoning") {
          returnObj[key] = alltags[key];
        }
      });
      return returnObj;
    }
  },
  materialSelectedVideo: (state, getters, rootState, rootGetters) => (
    payload,
    model
  ) => {
    const rAnkObj = rootGetters["videos/CookVideoStarOrder"];
    let ResultObject = {};
    if (payload.materialArray.length == 0 && payload.timeArray.length == 0) {
      let array = Object.values(rAnkObj);
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
      payload.materialArray.length > 0 &&
      payload.timeArray.length == 0
    ) {
      Object.keys(rAnkObj).forEach(key => {
        if (
          arrayIncludedOrNot(payload.materialArray, rAnkObj[key].materialTag)
        ) {
          ResultObject[key] = rAnkObj[key];
        }
      });
      let array = Object.values(ResultObject);
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
      payload.materialArray.length == 0 &&
      payload.timeArray.length > 0
    ) {
      Object.keys(rAnkObj).forEach(key => {
        if (arrayElementIncludeOrNot(payload.timeArray, rAnkObj[key].timeTag)) {
          resultObject[key] = rAnkObj[key];
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
        }
      } else {
        let MArray = [];
        return MArray;
      }
    } else {
      Object.keys(rAnkObj).forEach(key => {
        if (
          arrayIncludedOrNot(payload.genreArray, rAnkObj[key].genreTag) &&
          arrayElementIncludeOrNot(payload.timeArray, rAnkObj[key].timeTag)
        ) {
          resultObject[key] = rAnkObj[key];
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
  },
  getTop5MaterialVideo: (state, getters) => (payload, model) => {
    let videoObj = getters.materialSelectedVideo(payload, model);
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
