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
        tagMap: tagMap,
        videoId: payload.favoriteVTRvideoID
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
  // ====================================
  // Videoを登録する時にレビューなしで登録する時のActions
  // ====================================
  async addNewVideoData({ commit }, payload) {
    // すでにvideoが登録されていない時のみ登録する
    if (!Object.keys(state.cookVideos).includes(payload.favoriteVTRvideoID)) {
      const snippet = payload.snippet;
      await firestoreDb
        .collection("video_info")
        .doc(payload.favoriteVTRvideoID)
        .set({
          channelId: snippet.channelId,
          channelTitle: snippet.channelTitle,
          videoTitle: snippet.title,
          videoDescription: snippet.description,
          thumbnail: snippet.thumbnails.medium.url,
          //VideoReviewを登録したユーザーのカウント
          registerCount: 0,
          // 星の点数を加算していく
          starPoint: 0,
          tagMap: {},
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
        tagMap: {},
        videoId: payload.favoriteVTRvideoID
      };
      commit("addVideoInfoMutate", PAYLOAD);
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
      if (videos[key].registerCount > 0) {
        let averageStar =
          Number(videos[key].starPoint) / Number(videos[key].registerCount);
        videos[key]["AverageStar"] = averageStar;
      } else {
        console.log(key);
        delete videos[key];
      }
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
      if (Videos[key].registerCount > 0) {
        let averageStar =
          Number(Videos[key].starPoint) / Number(Videos[key].registerCount);
        Videos[key]["AverageStar"] = averageStar;
      } else {
        console.log(key);
        delete Videos[key];
      }
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
  },
  sortByTagOfCookVideosTop5: (state, getters) => payload => {
    let videoObj = getters.sortByTagOfCookVideos(payload);
    let keyArray = [];
    for (let i = 0; i < 5; i++) {
      keyArray.push(Object.keys(videoObj)[i]);
    }
    let returnObj = {};
    for (let j in keyArray) {
      let KEY = keyArray[j];
      console.log(keyArray[j]);
      returnObj[KEY] = videoObj[KEY];
      console.log(j);
      if (returnObj[KEY]) {
        returnObj[KEY]["rankInfo"] = Number(j) + 1;
      }
    }
    return returnObj;
  },
  // ==============================
  // YoutuberDetailの人気VideoをGETする関数
  // ===============================
  cookVideoYoutuberSort: (state, getters) => youtuberId => {
    let videoObj = getters.CookVideoStarOrder;
    let returnObj = {};
    Object.keys(videoObj).forEach(key => {
      if (videoObj[key].channelId == youtuberId) {
        returnObj[key] = videoObj[key];
      }
    });
    return returnObj;
  },
  // ==============================
  // TopPggeでビデオを表示する関数
  // ===============================
  getTop5VideoAtTopPage: (state, getters) => {
    let videoObj = getters.CookVideoStarOrder;
    let keyArray = [];
    for (let i = 0; i < 5; i++) {
      keyArray.push(Object.keys(videoObj)[i]);
    }
    let returnObj = {};
    for (let j in keyArray) {
      let KEY = keyArray[j];
      returnObj[KEY] = videoObj[KEY];
      if (returnObj[KEY]) {
        returnObj[KEY]["rankInfo"] = Number(j) + 1;
      }
    }
    return returnObj;
  },
  // ==============================
  // 検索でビデオを表示する関数
  // ===============================
  //別ファイルのstateは第三引数で取得可能
  //https://vuex.vuejs.org/ja/guide/modules.html
  searchAllVideo: (state, getters, rootState) => {
    let VideoInfo = state.cookVideos;
    let returnObject = {};
    // console.log(rootState.youtubers.search);
    // console.log(VideoInfo);
    if (rootState.youtubers.search.length > 2) {
      Object.keys(VideoInfo).forEach(key => {
        if (
          VideoInfo[key].videoTitle
            .toLowerCase()
            .includes(rootState.youtubers.search.toLowerCase()) ||
          VideoInfo[key].videoDescription
            .toLowerCase()
            .includes(rootState.youtubers.search.toLowerCase()) ||
          VideoInfo[key].channelTitle
            .toLowerCase()
            .includes(rootState.youtubers.search.toLowerCase())
        ) {
          returnObject[key] = VideoInfo[key];
        }
      });
    }
    // console.log(returnObject);
    return returnObject;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
