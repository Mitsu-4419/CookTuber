import * as firebase from "firebase/app";
import { firestoreDb, firestorebase } from "src/boot/firebase";
import Vue from "vue";
const state = {
  usersPublicInfo: {},
  videos: {}
};
const mutations = {
  setYoutuber_FavoriteCount(state, payload) {
    Vue.set(state.usersPublicInfo, payload.id, payload);
  },
  // 新規ユーザー登録時のMutation
  setNewUserProfileMutate(state, payload) {
    Vue.set(state.usersPublicInfo, payload.id, payload);
  },
  updateNewLoginUsersProfileMutate(state, payload) {
    Vue.set(state.usersPublicInfo[payload.id], "nickName", payload.nickName);
    Vue.set(
      state.usersPublicInfo[payload.id],
      "introduction",
      payload.introduction
    );
  },
  // 全てのビデオデータをStateに入れる
  setVideosMutate(state, payload) {
    Vue.set(state.videos, payload.id, payload);
  },
  // 新規のビデオデータをStateに入れる
  addVideoInfoMutate(state, payload) {
    Vue.set(state.videos, payload.id, payload);
  },
  // すでに登録してあった場合は数値を更新する
  uploadVideoMutate(state, payload) {
    state.videos[payload.id].registerCount =
      Number(state.videos[payload.id].registerCount) + 1;
    state.videos[payload.id].starPoint =
      Number(state.videos[payload.id].starPoint) + Number(payload.starPoint);
    Vue.set(state.videos[payload.id], "tagArray", payload.tagArray);
  },
  update_mypageNameMutate(state, payload) {
    Vue.set(state.usersPublicInfo[payload.id], "nickName", payload.userName);
  },
  update_mypageIntroductionMutate(state, payload) {
    Vue.set(
      state.usersPublicInfo[payload.id],
      "introduction",
      payload.userIntroduction
    );
  },
  addReviewInfoMutate(state, payload) {
    Vue.set(
      state.usersPublicInfo[payload.uid].favoriteVTRObj,
      payload.docId,
      payload.obj
    );
  },
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  // マイページからレビュー情報を変更する
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  changeReviewInfoMutate(state, payload) {
    Vue.set(
      state.usersPublicInfo[payload.uid].favoriteVTRObj[payload.docId],
      "review",
      payload.obj.review
    );
    Vue.set(
      state.usersPublicInfo[payload.uid].favoriteVTRObj[payload.docId],
      "star_number",
      payload.obj.star_number
    );
    Vue.set(
      state.usersPublicInfo[payload.uid].favoriteVTRObj[payload.docId],
      "tagArray",
      payload.obj.tagArray
    );
    Vue.set(
      state.usersPublicInfo[payload.uid].favoriteVTRObj[payload.docId],
      "updatedAt",
      payload.obj.updatedAt
    );
  },
  // video情報の更新
  updateVideoDataMutate(state, payload) {
    Vue.set(state.videos[payload.id], "starPoint", payload.starPoint);
  },
  reduceTagsMutate(state, payload) {
    Vue.set(
      state.videos[payload.id].tagMap,
      payload.key,
      state.videos[payload.id].tagMap[payload.key]--
    );
  },
  addTagsMutate(state, payload) {
    Vue.set(
      state.videos[payload.id].tagMap,
      payload.key,
      state.videos[payload.id].tagMap[payload.key]++
    );
  },
  addNewTagsMutate(state, payload) {
    Vue.set(state.videos[payload.id].tagMap, payload.key, 1);
  },
  delReviewInfoMutate(state, payload) {
    Vue.delete(
      state.usersPublicInfo[payload.uid].favoriteYoutuberObj,
      payload.docId
    );
  },
  increaseLikeMutate(state, payload) {
    if (
      state.usersPublicInfo[payload.reviewerUID].favoriteYoutuberObj[
        payload.docId
      ].LikeArray
    ) {
      state.usersPublicInfo[payload.reviewerUID].favoriteYoutuberObj[
        payload.docId
      ].LikeArray.push(payload.loginUID);
    } else {
      state.usersPublicInfo[payload.reviewerUID].favoriteYoutuberObj[
        payload.docId
      ] = { LikeArray: [payload.loginUID] };
    }
  },

  decreaseLikeMutate(state, payload) {
    state.usersPublicInfo[payload.reviewerUID].favoriteYoutuberObj[
      payload.docId
    ].LikeArray.some(function(v, i) {
      if (v == payload.loginUID)
        state.usersPublicInfo[payload.reviewerUID].favoriteYoutuberObj[
          payload.docId
        ].LikeArray.splice(i, 1);
    });
  },
  update_mypagePhotoURLMutate(state, payload) {
    Vue.set(
      state.usersPublicInfo[payload.id],
      "photoURL",
      payload.userPhotoURL
    );
  }
};

const actions = {
  // 全員のPublicDataを取ってくる。
  async getUsersPublicProfile({ commit }) {
    const snap = await firestoreDb.collection("userPublicInfo").get();
    snap.forEach(async data => {
      let payload = {
        id: data.id,
        created_at: data.data().created_at,
        updated_at: data.data().updated_at,
        nickName: data.data().nickName,
        introduction: data.data().introduction,
        photoURL: data.data().photoURL,
        favoriteCount: data.data().favoriteCount
      };
      const sp = await firestoreDb
        .collection("userPublicInfo")
        .doc(data.id)
        .collection("favorite_VTR")
        .get();
      let favoriteVTRObj = {};
      sp.forEach(async doc => {
        favoriteVTRObj[doc.id] = doc.data();
      });
      payload["favoriteVTRObj"] = favoriteVTRObj;
      commit("setYoutuber_FavoriteCount", payload);
    });
  },
  // 新規ログインユーザーが入った時にstore-authでこのアクションを発火させることで新規ユーザーの情報をまずステートに入れる
  async setNewUserProfile({ commit }, value) {
    console.log(value);
    const sp = await firestoreDb
      .collection("userPublicInfo")
      .doc(value)
      .get();
    let obj = {
      id: sp.id,
      created_at: sp.data().created_at,
      updated_at: sp.data().updated_at,
      nickName: sp.data().nickName,
      introduction: sp.data().introduction,
      photoURL: sp.data().photoURL
    };
    obj["favoriteVTRObj"] = {};
    commit("setNewUserProfileMutate", obj);
  },
  // Stateに新規ユーザーの情報を入れる。
  // nickNameとIntroductionの情報の更新
  async updateNewLoginUsersProfile({ commit }, payload) {
    commit("updateNewLoginUsersProfileMutate", payload);
  },
  // -------------------------------
  // 全てのVideoDataを取ってきてStateに入れる。
  // -------------------------------
  async getVideos({ commit }) {
    const snap = await firestoreDb.collection("video_info").get();
    snap.forEach(async data => {
      let payload = {
        id: data.id,
        channelId: data.data().channelId,
        channelTitle: data.data().channelTitle,
        videoTitle: data.data().videoTitle,
        videoDescription: data.data().videoDescription,
        thumbnail: data.data().thumbnail,
        registerCount: Number(data.data().registerCount),
        starPoint: Number(data.data().starPoint),
        tagMap: data.data().tagMap
      };
      commit("setVideosMutate", payload);
    });
  },
  // ------------------------------
  //ユーザー情報にお気に入りのVideoを登録
  // ------------------------------
  async addFavoriteVTR({ commit, state }, payload) {
    // -----------------------------------
    // userPublicにタグの情報を入れるときはtagArrayで入れている。
    // videoにタグ情報を入れている時はtagMApにして入れている。（個数をカウントするため）
    // ----------------------------------

    // ーーーーーーーーーーーーーー
    // ユーザーのSubCollectionにデータを入れる
    await firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .collection("favorite_VTR")
      .add({
        createdAt: firestorebase.FieldValue.serverTimestamp(),
        updatedAt: firestorebase.FieldValue.serverTimestamp(),
        review: payload.review,
        uid: payload.uid,
        channelId: "",
        LikeArray: [],
        star_number: payload.star_number,
        tagArray: payload.selectedTags,
        videoId: payload.favoriteVTRvideoID
      });
    // DocumentId を取ってきてStateに登録
    const sp = await firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .collection("favorite_VTR")
      .get();
    let getKey;
    sp.forEach(doc => {
      if (doc.data().videoId == payload.favoriteVTRvideoID) {
        getKey = doc.id;
      }
    });
    let Payload = {
      docId: getKey,
      uid: payload.uid,
      obj: {
        createdAt: firestorebase.FieldValue.serverTimestamp(),
        review: payload.review,
        uid: payload.uid,
        videoId: payload.favoriteVTRvideoID,
        star_number: payload.star_number,
        tagArray: payload.selectedTags,
        LikeArray: []
      }
    };
    commit("addReviewInfoMutate", Payload);
    // Video情報を取ってきて保存するところ
    // Videoの情報がすでに登録されていなければ登録する
    let tagMap = {};
    for (let k = 0; k < payload.selectedTags.length; k++) {
      tagMap[payload.selectedTags[k]] = 1;
    }
    if (!Object.keys(state.videos).includes(payload.favoriteVTRvideoID)) {
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
      let videoTagMap = state.videos[payload.favoriteVTRvideoID].tagMap;
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
  // ==================================
  // マイページの自分のレビューを更新するところ
  // ===================================
  updateFavoriteVTR({ commit, state }, payload) {
    // Userの情報の変更
    let Payload = {
      uid: payload.uid,
      channelId: payload.favoriteTubers,
      docId: payload.docId,
      obj: {
        updatedAt: firestorebase.FieldValue.serverTimestamp(),
        review: payload.review,
        star_number: payload.star_number,
        tagArray: payload.selectedTags
      }
    };
    commit("changeReviewInfoMutate", Payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .collection("favorite_VTR")
      .doc(payload.docId)
      .update({
        review: payload.review,
        star_number: payload.star_number,
        tagArray: payload.selectedTags,
        updatedAt: firestorebase.FieldValue.serverTimestamp()
      });
    //=================
    // Video情報の変更
    //=================
    // まず最初に付いていてタグを減算してから、新しくつけたタグを加える
    let TAGMAP = state.videos[payload.favoriteVTRvideoID].tagMap;
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
      state.videos[payload.favoriteVTRvideoID].starPoint + changeAmount;
    let payyload = {
      starPoint: changedStarPoint,
      id: payload.favoriteVTRvideoID
    };
    console.log("hage6");
    commit("updateVideoDataMutate", payyload);
  },
  // ーーーーーーーーーーーーーーーーーーーーーーーーーー
  // プロフィールの編集のところ
  // ーーーーーーーーーーーーーーーーーーーーーーーーーー
  //ユーザー情報更新から、マイページのユーザーネームの更新
  update_mypageName({ commit }, payload) {
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.id)
      .update({
        nickName: payload.userName,
        updated_at: firestorebase.FieldValue.serverTimestamp()
      });
    commit("update_mypageNameMutate", payload);
  },
  //ユーザー情報更新から、マイページの自己紹介の更新
  update_mypageIntroduction({ commit }, payload) {
    commit("update_mypageIntroductionMutate", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.id)
      .update({
        introduction: payload.userIntroduction,
        updated_at: firestorebase.FieldValue.serverTimestamp()
      });
  },
  //ユーザー情報更新から、マイページのアイコンの更新
  update_mypagePhotoURL({ commit }, payload) {
    commit("update_mypagePhotoURLMutate", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.id)
      .update({
        photoURL: payload.userPhotoURL,
        updated_at: firestorebase.FieldValue.serverTimestamp(),
        photoName: payload.userPhotoName
      });
  },

  //ユーザー情報に登録youtuberの加算
  // async addReviewInfo({ commit }, payload) {
  //   // ユーザーのSubCollectionにデータを入れる
  //   await firestoreDb
  //     .collection("userPublicInfo")
  //     .doc(payload.uid)
  //     .collection("favorite_Youtuber")
  //     .add({
  //       createdAt: firestorebase.FieldValue.serverTimestamp(),
  //       updatedAt: firestorebase.FieldValue.serverTimestamp(),
  //       review: payload.review,
  //       uid: payload.uid,
  //       channelId: payload.favoriteTubersChannelId,
  //       LikeArray: []
  //     });
  //   const sp = await firestoreDb
  //     .collection("userPublicInfo")
  //     .doc(payload.uid)
  //     .collection("favorite_Youtuber")
  //     .get();
  //   let Obj = {};
  //   sp.forEach(doc => {
  //     Obj[doc.id] = doc.data();
  //   });
  //   let getKey;
  //   for (let key in Obj) {
  //     if (Obj[key].channelId === payload.favoriteTubersChannelId) {
  //       getKey = key;
  //     }
  //   }
  //   // console.log(getKey);
  //   let Payload = {
  //     docId: getKey,
  //     uid: payload.uid,
  //     channelId: payload.favoriteTubersChannelId,
  //     obj: {
  //       createdAt: firestorebase.FieldValue.serverTimestamp(),
  //       review: payload.review,
  //       uid: payload.uid,
  //       channelId: payload.favoriteTubersChannelId
  //     }
  //   };
  //   commit("addReviewInfoMutate", Payload);
  // },
  // レビューを消す
  delReviewInfo({ commit }, payload) {
    commit("delReviewInfoMutate", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .collection("favorite_Youtuber")
      .doc(payload.docId)
      .delete();
  },
  // いいね数を増やす
  increaseLike({ commit }, payload) {
    commit("increaseLikeMutate", payload);

    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.reviewerUID)
      .collection("favorite_Youtuber")
      .doc(payload.docId)
      .update({
        LikeArray: firebase.firestore.FieldValue.arrayUnion(payload.loginUID)
      });
  },
  decreaseLike({ commit }, payload) {
    commit("decreaseLikeMutate", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.reviewerUID)
      .collection("favorite_Youtuber")
      .doc(payload.docId)
      .update({
        LikeArray: firebase.firestore.FieldValue.arrayRemove(payload.loginUID)
      });
  }
};

const getters = {
  // ユーザーIDのお気に入りVideoReviewを取ってくる。
  getfavoriteObject: state => userId => {
    const valueArray = state.usersPublicInfo;
    let userFavoriteArray = valueArray[userId].favoriteVTRObj;
    return userFavoriteArray;
  },
  // channelIdごとにレビュー情報を取ってきている
  getYoutuberReview: (state, getters) => channelId => {
    const FavoriteCount = getters.makeYoutuberFavoriteCount;
    let resultObj = {};
    Object.keys(FavoriteCount).forEach(key => {
      if (FavoriteCount[key].channelId == channelId) {
        resultObj[key] = FavoriteCount[key];
      }
    });
    return resultObj;
  },
  // userPublicのデータからKeyをDocID、データをお気に入りのデータとしてお気に入りを全て取ってきたオブジェクトを作る
  makeYoutuberFavoriteCount: state => {
    let valueArray = Object.values(state.usersPublicInfo);
    let YoutuberFavoriteCountObject = {};
    for (let i = 0; i < valueArray.length; i++) {
      Object.keys(valueArray[i].favoriteYoutuberObj).forEach(key => {
        YoutuberFavoriteCountObject[key] =
          valueArray[i].favoriteYoutuberObj[key];
      });
    }
    return YoutuberFavoriteCountObject;
  },
  // 共通の処理
  // チャンネルIdとお気に入り数の一対一のオブジェクトを返すGetter
  // {channelId:'お気に入り数',}
  makeNumberArray: state => obj => {
    const NumberObj = {};
    let valueArray = Object.values(obj);
    let keyArray = Object.keys(obj);
    for (let j = 0; j < keyArray.length; j++) {
      let Key = valueArray[j].channelId;
      NumberObj[Key] = 0;
    }
    for (let i = 0; i < valueArray.length; i++) {
      let key = valueArray[i].channelId;
      NumberObj[key]++;
    }
    return NumberObj;
  },
  // NumberObjを良いね数でランキングに並び替える関数
  makeRankingObj: state => NumberObj => {
    let ObjArray = [];
    let kkeyArray = Object.keys(NumberObj);
    for (let k = 0; k < kkeyArray.length; k++) {
      let payload = {
        id: kkeyArray[k],
        count: NumberObj[kkeyArray[k]]
      };
      ObjArray.push(payload);
    }
    ObjArray.sort(function(a, b) {
      if (Number(a.count) < Number(b.count)) return 1;
      if (Number(a.count) > Number(b.count)) return -1;
      return 0;
    });
    let rankResultObj = {};
    if (ObjArray.length < 11) {
      for (let q = 0; q < ObjArray.length; q++) {
        let payload = {
          rank: q + 1,
          count: ObjArray[q].count
        };
        rankResultObj[ObjArray[q].id] = payload;
      }
    } else {
      for (let q = 0; q < 10; q++) {
        let payload = {
          rank: q + 1,
          count: ObjArray[q].count
        };
        rankResultObj[ObjArray[q].id] = payload;
      }
    }
    return rankResultObj;
  },

  // 全体の{channelId:'お気に入り数'}のArrrayを返す
  getNumberArray: (state, getters) => {
    const FavoriteCount = getters.makeYoutuberFavoriteCount;
    return getters.makeNumberArray(FavoriteCount);
  },
  getDailyRanking: (state, getters) => {
    const FavoriteCount = getters.makeYoutuberFavoriteCount;
    // 現在時刻を秒で取得
    let date = new Date();
    let a = date.getTime();
    let nowSeconds = Math.floor(a / 1000);
    // 1日は86400秒
    let startSeconds = Number(nowSeconds) - 86400;
    let sortedObj = {};
    Object.keys(FavoriteCount).forEach(key => {
      let regiDate = FavoriteCount[key].createdAt.seconds;
      if (startSeconds < regiDate && regiDate < nowSeconds) {
        sortedObj[key] = FavoriteCount[key];
      }
    });
    let NumBerObj = getters.makeNumberArray(sortedObj);
    return getters.makeRankingObj(NumBerObj);
  },
  getWeeklyRanking: (state, getters) => {
    const FavoriteCount = getters.makeYoutuberFavoriteCount;
    // 現在時刻を秒で取得
    let date = new Date();
    let a = date.getTime();
    let nowSeconds = Math.floor(a / 1000);
    // 1週間は604800秒
    let startSeconds = Number(nowSeconds) - 604800;
    let sortedObj = {};
    Object.keys(FavoriteCount).forEach(key => {
      let regiDate = FavoriteCount[key].createdAt.seconds;
      if (startSeconds < regiDate && regiDate < nowSeconds) {
        sortedObj[key] = FavoriteCount[key];
      }
    });
    let NumBerObj = getters.makeNumberArray(sortedObj);
    return getters.makeRankingObj(NumBerObj);
  },
  getMonthlyRanking: (state, getters) => {
    const FavoriteCount = getters.makeYoutuberFavoriteCount;
    // 現在時刻を秒で取得
    let date = new Date();
    let a = date.getTime();
    let nowSeconds = Math.floor(a / 1000);
    // １ヶ月は18144000秒
    let startSeconds = Number(nowSeconds) - 18144000;
    let sortedObj = {};
    Object.keys(FavoriteCount).forEach(key => {
      let regiDate = FavoriteCount[key].createdAt.seconds;
      if (startSeconds < regiDate && regiDate < nowSeconds) {
        sortedObj[key] = FavoriteCount[key];
      }
    });
    let NumBerObj = getters.makeNumberArray(sortedObj);
    return getters.makeRankingObj(NumBerObj);
  },
  getAllTermRanking: (state, getters) => {
    return getters.makeRankingObj(getters.getNumberArray);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
