import { firestoreDb, firestorebase } from "src/boot/firebase";
import Vue from "vue";
import axios from "axios";

const state = {
  cookVideos: {},
  search: ""
};
const mutations = {
  setSearch(state, value) {
    state.search = value;
  },
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
    firestoreDb
      .collection("video_info")
      .doc(payload.favoriteVTRvideoID)
      .update({
        registerCount: firestorebase.FieldValue.increment(-1),
        starPoint: firestorebase.FieldValue.increment(
          -Number(payload.star_number)
        )
      });
  },
  //検索バーから文字列を渡す
  setSearch({ commit }, value) {
    commit("setSearch", value);
  }
};

const getters = {
  // ==============================
  // Video全体を星の数順にソート
  // ===============================
  CookVideoStarOrder: state => {
    const videos = Object.values(state.cookVideos);
    // channelIdと星を１対１に対応したObjの配列をつく
    const array = videos.filter(data => {
      if (Number(data.registerCount) > 0) {
        let averageStar = Number(data.starPoint) / Number(data.registerCount);
        data["AverageStar"] = averageStar;
      } else {
        data["AverageStar"] = 0;
      }
      return data;
    });
    array.sort(function(a, b) {
      if (Number(a.AverageStar) < Number(b.AverageStar)) return 1;
      if (Number(a.AverageStar) > Number(b.AverageStar)) return -1;
      return 0;
    });
    return array;
  },
  // ==============================
  // YoutuberDetailの人気VideoをGETする関数
  // ===============================
  cookVideoYoutuberSort: (state, getters) => (youtuberId, model) => {
    const starOrderArray = getters.CookVideoStarOrder;
    const array = starOrderArray.filter(data => data.channelId == youtuberId);
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
  // 検索でビデオを表示する関数
  // ===============================
  searchAllVideo: state => {
    let VideoInfo = state.cookVideos;
    let returnObject = {};
    if (state.search.length > 2) {
      Object.keys(VideoInfo).forEach(key => {
        if (
          VideoInfo[key].videoTitle
            .toLowerCase()
            .includes(state.search.toLowerCase()) ||
          VideoInfo[key].videoDescription
            .toLowerCase()
            .includes(state.search.toLowerCase()) ||
          VideoInfo[key].channelTitle
            .toLowerCase()
            .includes(state.search.toLowerCase())
        ) {
          returnObject[key] = VideoInfo[key];
        }
      });
    }
    return returnObject;
  },
  // ======================================
  //  videoDetailページで関連動画のIDArrayを返す
  // ======================================
  getReviewersFavoriteVideos: state => key => {
    const videoInfo = state.cookVideos;
    const genreArray = videoInfo[key].genreTag;
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
