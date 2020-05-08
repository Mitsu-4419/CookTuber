import * as firebase from "firebase/app";
import { firestoreDb } from "src/boot/firebase";
import Vue from "vue";
import { arrayIncludedOrNot } from "src/functions/arrayIncludedOrNot";
const state = {
  cookVideos: {}
};
const mutations = {
  setAllCookingVideosMutation(state, payload) {
    Vue.set(state.cookVideos, payload.id, payload.obj);
  },
  addVideoInfoMutate(state, payload) {
    Vue.set(state.cookVideos, payload.id, payload);
  },
  uploadVideoMutate(state, payload) {
    state.cookVideos[payload.id].registerCount =
      Number(state.cookVideos[payload.id].registerCount) + 1;
    state.cookVideos[payload.id].starPoint =
      Number(state.cookVideos[payload.id].starPoint) +
      Number(payload.starPoint);
    Vue.set(state.cookVideos[payload.id], "tagArray", payload.tagArray);
  },
  // ==========================
  // MypageからVideo情報変更
  // ==========================
  reduceTagsMutate(state, payload) {
    Vue.set(
      state.cookVideos[payload.id].tagMap,
      payload.key,
      state.cookVideos[payload.id].tagMap[payload.key]--
    );
  },
  addTagsMutate(state, payload) {
    Vue.set(
      state.cookVideos[payload.id].tagMap,
      payload.key,
      state.cookVideos[payload.id].tagMap[payload.key]++
    );
  },
  addNewTagsMutate(state, payload) {
    Vue.set(state.cookVideos[payload.id].tagMap, payload.key, 1);
  },
  updateVideoDataMutate(state, payload) {
    Vue.set(state.cookVideos[payload.id], "starPoint", payload.starPoint);
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
  },
  async addVideoData({ commit }, payload) {
    let tagMap = {};
    for (let k = 0; k < payload.selectedTags.length; k++) {
      tagMap[payload.selectedTags[k]] = 1;
    }
    if (!Object.keys(state.cookVideos).includes(payload.favoriteVTRvideoID)) {
      const snippet = payload.snippet;
      firestoreDb
        .collection("video_info")
        .doc(payload.favoriteVTRvideoID)
        .set({
          channelId: snippet.channelId,
          channelTitle: snippet.channelTitle,
          videoTitle: snippet.title,
          videoDescription: snippet.description,
          thumbnail: snippet.thumbnails.medium.url,
          //Videoを登録したユーザーのカウント
          registerCount: 1,
          // 星の点数を加算していく
          starPoint: Number(payload.star_number),
          tagMap: tagMap,
          videoId: payload.favoriteVTRvideoID
        });
      let PAYLOAD = {
        id: payload.favoriteVTRvideoID,
        channelId: snippet.channelId,
        channelTitle: snippet.channelTitle,
        videoTitle: snippet.title,
        videoDescription: snippet.description,
        thumbnail: snippet.thumbnails.medium.url,
        registerCount: 1,
        starPoint: Number(payload.star_number),
        tagMap: tagMap
      };
      commit("addVideoInfoMutate", PAYLOAD);
    } else {
      // ビデオがすでに登録してあった場合
      // Stateからすでに登録しているTagを取ってきて、それ以外をUpDateするようにする
      let videoTagMap = state.cookVideos[payload.favoriteVTRvideoID].tagMap;
      // ビデオが登録してあったけどTagは付いていなかった時
      if (!videoTagMap) {
        firestoreDb
          .collection("video_info")
          .doc(payload.favoriteVTRvideoID)
          .update({
            registerCount: firestorebase.FieldValue.increment(1),
            // 星の点数を加算していく
            starPoint: firestorebase.FieldValue.increment(
              Number(payload.star_number)
            ),
            tagMap: tagMap
          });
        let payloaded = {
          id: payload.favoriteVTRvideoID,
          starPoint: Number(payload.star_number),
          tagMap: tagMap
        };
        commit("uploadVideoMutate", payloaded);
      } else {
        // 今回選ばれたタグの配列
        let selectedArray = payload.selectedTags;
        for (let t = 0; t < selectedArray.length; t++) {
          if (Object.keys(tagMap).includes(selectedArray[t])) {
            tagMap[selectedArray[t]]++;
          } else {
            tagMap[selectedArray[t]] = 1;
          }
        }
        firestoreDb
          .collection("video_info")
          .doc(payload.favoriteVTRvideoID)
          .update({
            registerCount: firestorebase.FieldValue.increment(1),
            // 星の点数を加算していく
            starPoint: firestorebase.FieldValue.increment(
              Number(payload.star_number)
            ),
            tagMap: tagMap
          });
        let payloaded = {
          id: payload.favoriteVTRvideoID,
          starPoint: Number(payload.star_number),
          tagMap: tagMap
        };
        commit("uploadVideoMutate", payloaded);
      }
    }
  },
  // ======================================
  //  MyPageからVideoDataの変更をする
  // ======================================
  async updateVideoData({ commit }, payload) {
    // まず最初に付いていてタグを減算してから、新しくつけたタグを加える
    let TAGMAP = state.cookVideos[payload.favoriteVTRvideoID].tagMap;
    let arrayBefore = payload.beforeTags;
    for (let l = 0; l < arrayBefore.length; l++) {
      let puyload = {
        id: payload.favoriteVTRvideoID,
        key: arrayBefore[l]
      };
      commit("reduceTagsMutate", puyload);
    }
    // 次に新しくつけたタグを加算していく
    let arrayAfter = payload.selectedTags;
    for (let o = 0; o < arrayBefore.length; o++) {
      let poyload = {
        id: payload.favoriteVTRvideoID,
        key: arrayAfter[o]
      };
      if (Object.keys(TAGMAP).includes(arrayAfter[o])) {
        commit("addTagsMutate", poyload);
      } else {
        commit("addNewTagsMutate", poyload);
      }
    }
    // 次に星の計算をする
    let changeAmount =
      Number(payload.star_number) - Number(payload.beforeStarNumber);
    let changedStarPoint =
      state.cookVideos[payload.favoriteVTRvideoID].starPoint + changeAmount;
    let payyload = {
      starPoint: changedStarPoint,
      id: payload.favoriteVTRvideoID
    };
    commit("updateVideoDataMutate", payyload);
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
  // ==============
  // Getttersを使ってやると、うまくいかなかったためあえて上記の関数を繰り返し記述している
  // =============
  sortByTagOfCookVideos: state => payload => {
    const Videos = state.cookVideos;
    // channelIdと星を１対１に対応したObjの配列をつく
    Object.keys(Videos).forEach(key => {
      let averageStar =
        Number(Videos[key].starPoint) / Number(Videos[key].registerCount);
      Videos[key]["AverageStar"] = averageStar;
    });
    let array = Object.values(Videos);
    array.sort(function(a, b) {
      if (Number(a.AverageStar) < Number(b.AverageStar)) return 1;
      if (Number(a.AverageStar) > Number(b.AverageStar)) return -1;
      return 0;
    });
    let returnObject = {};
    for (let i in array) {
      returnObject[array[i].videoId] = Videos[array[i].videoId];
    }
    let videos = returnObject;
    if (payload.length == 0) {
      return videos;
    } else {
      Object.keys(videos).forEach(key => {
        if (arrayIncludedOrNot(payload, Object.keys(videos[key].tagMap))) {
          // いくつか選ばれたタグのスコアを加算していくためにScoreという項目をつくる
          videos[key]["score"] = 0;
          for (let j in payload) {
            // tagがVideoに紐づけられていたらScoreをつける、逆にTagが付いていなかったらvideoから外す
            if (Object.keys(videos[key].tagMap).includes(payload[j])) {
              videos[key]["score"] += Number(videos[key]["tagMap"][payload[j]]);
            }
          }
        } else {
          Vue.delete(videos, key);
        }
      });
      console.log(videos);
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
