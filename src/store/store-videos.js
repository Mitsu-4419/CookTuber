import { firestoreDb, firestorebase } from "src/boot/firebase";
import Vue from "vue";
import axios from "axios";
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
    const updatedRegisterCount =
      Number(state.cookVideos[payload.id].registerCount) + 1;
    const updatedStarPoint =
      Number(state.cookVideos[payload.id].starPoint) +
      Number(payload.starPoint);
    const updatedAverageStar = updatedStarPoint / updatedRegisterCount;
    state.cookVideos[payload.id].registerCount = updatedRegisterCount;
    state.cookVideos[payload.id].starPoint = updatedStarPoint;
    state.cookVideos[payload.id]["AverageStar"] = updatedAverageStar;
  },
  updateVideoDataMutate(state, payload) {
    const prevStarPoint = state.cookVideos[payload.id].starPoint;
    let afterTotalPoint = Number(prevStarPoint) + Number(payload.starPoint);
    Vue.set(state.cookVideos[payload.id], "starPoint", afterTotalPoint);
  },
  deleteVideoDataMutate(state, payload) {
    if (
      Number(state.cookVideos[payload.favoriteVTRvideoID].registerCount) > 0
    ) {
      Number(state.cookVideos[payload.favoriteVTRvideoID].registerCount) - 1;
    }
    if (Number(state.cookVideos[payload.favoriteVTRvideoID].starPoint)) {
      Number(state.cookVideos[payload.favoriteVTRvideoID].starPoint) -
        Number(payload.star_number);
    }
  }
};

const actions = {
  // ーーーーーーーーーーー
  // Video情報を入れる処理
  // ーーーーーーーーーーー
  async getAllCookingVideos({ commit }) {
    const sp = await firestoreDb.collection("video_info").get();
    sp.forEach(async doc => {
      let payload = {
        id: doc.id,
        obj: doc.data()
      };
      commit("setAllCookingVideosMutation", payload);
    });
  },
  // ーーーーーーーーーーー
  // Video情報を追加する
  // ーーーーーーーーーーー
  async addVideoData({ commit }, payload) {
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
          videoId: payload.favoriteVTRvideoID,
          publishedAt: snippet.publishedAt
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
        videoId: payload.favoriteVTRvideoID,
        publishedAt: snippet.publishedAt
      };
      commit("addVideoInfoMutate", PAYLOAD);
    } else {
      firestoreDb
        .collection("video_info")
        .doc(payload.favoriteVTRvideoID)
        .update({
          registerCount: firestorebase.FieldValue.increment(1),
          // 星の点数を加算していく
          starPoint: firestorebase.FieldValue.increment(
            Number(payload.star_number)
          )
        });
      let payloaded = {
        id: payload.favoriteVTRvideoID,
        starPoint: Number(payload.star_number)
      };
      commit("uploadVideoMutate", payloaded);
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
        videoId: payload.favoriteVTRvideoID
      };
      commit("addVideoInfoMutate", PAYLOAD);
    }
  },
  // ======================================
  //  MyPageからVideoDataの変更をする
  // ======================================
  async updateVideoData({ commit, state }, payload) {
    // 次に星の計算して変化量を合計にたす
    let changeAmount =
      Number(payload.afterStar_number) - Number(payload.beforeStarNumber);
    let payyload = {
      starPoint: changeAmount,
      id: payload.favoriteVTRvideoID
    };
    commit("updateVideoDataMutate", payyload);
    firestoreDb
      .collection("video_info")
      .doc(payload.favoriteVTRvideoID)
      .update({
        starPoint: firestorebase.FieldValue.increment(Number(changeAmount))
      });
  },
  async deleteVideoData({ commit }, payload) {
    commit("deleteVideoDataMutate", payload);
    console.log("hohohohohohohoho");
    firestoreDb
      .collection("video_info")
      .doc(payload.favoriteVTRvideoID)
      .update({
        registerCount: firestorebase.FieldValue.increment(-1),
        starPoint: firestorebase.FieldValue.increment(
          -Number(payload.star_number)
        )
      });
  }
};

const getters = {
  CookVideoStarOrder: state => {
    const videos = state.cookVideos;
    // channelIdと星を１対１に対応したObjの配列をつく
    let newVideos = {};
    Object.keys(videos).forEach(key => {
      if (Number(videos[key].registerCount) > 0) {
        let averageStar =
          Number(videos[key].starPoint) / Number(videos[key].registerCount);
        videos[key]["AverageStar"] = averageStar;
        newVideos[key] = videos[key];
      } else {
        videos[key]["AverageStar"] = 0;
        newVideos[key] = videos[key];
      }
    });
    let array = Object.values(newVideos);
    let returnObj = {};
    array.sort(function(a, b) {
      if (Number(a.AverageStar) < Number(b.AverageStar)) return 1;
      if (Number(a.AverageStar) > Number(b.AverageStar)) return -1;
      return 0;
    });
    for (let k in array) {
      returnObj[array[k].videoId] = array[k];
    }
    return returnObj;
  },
  // ==============================
  // YoutuberDetailの人気VideoをGETする関数
  // ===============================
  cookVideoYoutuberSort: (state, getters) => (youtuberId, model) => {
    let videoObj = getters.CookVideoStarOrder;
    let array = [];
    Object.keys(videoObj).forEach(key => {
      if (videoObj[key].channelId == youtuberId) {
        array.push(videoObj[key]);
      }
    });
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
  },
  // ==============================
  // TopPggeでビデオを表示する関数
  // ===============================
  getTop5VideoAtTopPage: (state, getters) => {
    let videoObj = getters.CookVideoStarOrder;
    let returnObj = {};
    for (let j = 0; j < 5; j++) {
      let KEY = Object.keys(videoObj)[j];
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
  },
  // ======================================
  //  videoDetailページで関連動画のIDArrayを返す
  // ======================================
  getReviewersFavoriteVideos: state => key => {
    const videoInfo = state.cookVideos;
    const genreArray = videoInfo[key].genreTag;
    const menuArray = videoInfo[key].menuTag;
    let returnArray = [];
    Object.keys(videoInfo).forEach(kkey => {
      if (kkey !== key) {
        for (let i in genreArray) {
          if (
            videoInfo[kkey].genreTag &&
            videoInfo[kkey].genreTag.includes(genreArray[i]) &&
            !returnArray.includes(kkey)
          ) {
            returnArray.push(kkey);
          }
        }
        for (let j in menuArray) {
          if (
            videoInfo[kkey].menuTag &&
            videoInfo[kkey].menuTag.includes(menuArray[j]) &&
            !returnArray.includes(kkey)
          ) {
            returnArray.push(kkey);
          }
        }
      }
    });
    return returnArray;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
