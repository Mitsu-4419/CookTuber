import * as firebase from "firebase/app";
import { firestoreDb, firestorebase } from "src/boot/firebase";
import Vue from "vue";
const state = {
  usersPublicInfo: {}
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
    console.log(payload.obj.updatedAt);
    Vue.set(
      state.usersPublicInfo[payload.uid].favoriteVTRObj[payload.docId],
      "updatedAt",
      payload.obj.updatedAt
    );
    Vue.set(
      state.usersPublicInfo[payload.uid].favoriteVTRObj[payload.docId],
      "cooked",
      true
    );
  },
  delReviewInfoMutate(state, payload) {
    Vue.delete(
      state.usersPublicInfo[payload.uid].favoriteYoutuberObj,
      payload.docId
    );
  },
  increaseLikeMutate(state, payload) {
    console.log(payload.docId);
    if (
      state.usersPublicInfo[payload.reviewerUID].favoriteVTRObj[payload.docId]
        .LikeArray
    ) {
      state.usersPublicInfo[payload.reviewerUID].favoriteVTRObj[
        payload.docId
      ].LikeArray.push(payload.loginUID);
    } else {
      state.usersPublicInfo[payload.reviewerUID].favoriteVTRObj[
        payload.docId
      ] = { LikeArray: [payload.loginUID] };
    }
  },
  decreaseLikeMutate(state, payload) {
    state.usersPublicInfo[payload.reviewerUID].favoriteVTRObj[
      payload.docId
    ].LikeArray.some(function(v, i) {
      if (v == payload.loginUID)
        state.usersPublicInfo[payload.reviewerUID].favoriteVTRObj[
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
  },
  deleteVideoDataMutate(state, payload) {
    Vue.delete(
      state.usersPublicInfo[payload.uid]["favoriteVTRObj"],
      payload.docId
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
        photoName: data.data().photoName,
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
  // ------------------------------
  //ユーザー情報にお気に入りのVideoを登録
  // ------------------------------
  async addFavoriteVTR({ commit, state }, payload) {
    // -----------------------------------
    // userPublicにタグの情報を入れるときはtagArrayで入れている。
    // videoにタグ情報を入れている時はtagMApにして入れている。（個数をカウントするため）
    // ----------------------------------
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
        channelId: payload.snippet.channelId,
        LikeArray: [],
        star_number: payload.star_number,
        tagArray: payload.selectedTags,
        videoId: payload.favoriteVTRvideoID,
        cooked: payload.cooked
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
        LikeArray: [],
        cooked: payload.cooked
      }
    };
    commit("addReviewInfoMutate", Payload);
  },
  // ==================================
  // マイページの自分のレビューを更新するところ
  // ===================================
  updateFavoriteVTR({ commit, state }, payload) {
    // Userの情報の変更
    let updateTime = new Date().getTime();
    let updateObject = {};
    updateObject["seconds"] = Number(updateTime) / 1000;
    let Payload = {
      uid: payload.uid,
      docId: payload.docId,
      obj: {
        updatedAt: updateObject,
        review: payload.review,
        star_number: payload.star_number,
        tagArray: payload.selectedTags,
        cooked: true
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
        updatedAt: firestorebase.FieldValue.serverTimestamp(),
        cooked: true
      });
  },
  deleteFavoriteVTR({ commit }, payload) {
    commit("deleteVideoDataMutate", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .collection("favorite_VTR")
      .doc(payload.docId)
      .delete();
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
  // -----------------------------
  // レビューのいいねの増減の処理
  // -----------------------------
  increaseLike({ commit }, payload) {
    commit("increaseLikeMutate", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.reviewerUID)
      .collection("favorite_VTR")
      .doc(payload.docId)
      .update({
        LikeArray: firestorebase.FieldValue.arrayUnion(payload.loginUID)
      });
  },
  decreaseLike({ commit }, payload) {
    commit("decreaseLikeMutate", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.reviewerUID)
      .collection("favorite_VTR")
      .doc(payload.docId)
      .update({
        LikeArray: firestorebase.FieldValue.arrayRemove(payload.loginUID)
      });
  },
  // -----------------------------
  // カードなどからレビューの投稿
  // -----------------------------
  async addFavoriteVTRFromCard({ commit, state }, payload) {
    await firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .collection("favorite_VTR")
      .add({
        createdAt: firestorebase.FieldValue.serverTimestamp(),
        updatedAt: firestorebase.FieldValue.serverTimestamp(),
        review: payload.review,
        uid: payload.uid,
        channelId: payload.channelId,
        LikeArray: [],
        star_number: payload.star_number,
        videoId: payload.favoriteVTRvideoID,
        cooked: payload.cooked
      });
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
        LikeArray: [],
        cooked: payload.cooked
      }
    };
    commit("addReviewInfoMutate", Payload);
  }
};

const getters = {
  // ユーザーIDのお気に入りVideoReviewを取ってくる。
  getfavoriteCookedObject: state => (userId, tab) => {
    const valueArray = state.usersPublicInfo;
    let userFavoriteObj = valueArray[userId].favoriteVTRObj;
    if (tab == "cooked") {
      let returnObje = {};
      Object.keys(userFavoriteObj).forEach(key => {
        if (userFavoriteObj[key].cooked == true) {
          returnObje[key] = userFavoriteObj[key];
        }
      });
      return returnObje;
    } else if (tab == "NotCooked") {
      let returnObjo = {};
      Object.keys(userFavoriteObj).forEach(key => {
        if (userFavoriteObj[key].cooked == false) {
          returnObjo[key] = userFavoriteObj[key];
        }
      });
      return returnObjo;
    }
  },
  // ユーザーのObjにユーザーのレビュー数、付いたいいねの総数を入れる処理
  setLikeNumReviewNum: state => {
    const userInfoTotal = state.usersPublicInfo;
    Object.keys(userInfoTotal).forEach(key => {
      let obj = userInfoTotal[key].favoriteVTRObj;
      let reviewNum = 0;
      let LikeNum = 0;
      Object.keys(obj).forEach(id => {
        LikeNum += Number(obj[id].LikeArray.length);
        if (obj[id].cooked == true) {
          reviewNum++;
        }
      });
      userInfoTotal[key]["reviewNum"] = reviewNum;
      userInfoTotal[key]["LikeNumber"] = LikeNum;
    });
    return userInfoTotal;
  },
  getSortedReviewer: (state, getters) => model => {
    const UserInfoTotal = getters.setLikeNumReviewNum;
    const valArray = Object.values(UserInfoTotal);
    if (model == "参考になった数が多い順") {
      valArray.sort(function(a, b) {
        if (Number(a.LikeNumber) < Number(b.LikeNumber)) return 1;
        if (Number(a.LikeNumber) > Number(b.LikeNumber)) return -1;
        return 0;
      });
    } else if (model == "投稿数が多い順") {
      valArray.sort(function(a, b) {
        if (Number(a.reviewNum) < Number(b.reviewNum)) return 1;
        if (Number(a.reviewNum) > Number(b.reviewNum)) return -1;
        return 0;
      });
    }
    // トップ２０だけ取り出す
    let returnArray = [];
    if (valArray.length < 20) {
      return valArray;
    } else {
      for (let i = 0; i < 20; i++) {
        returnArray.push(valArray[i]);
      }
      return returnArray;
    }
  },
  // -------------------------------
  // topPageでトップレビューワーを取ってくるところ
  // -------------------------------
  getTop5Reviewer: (state, getters) => {
    const userInfoTotal = state.usersPublicInfo;
    Object.keys(userInfoTotal).forEach(key => {
      let reviewNum = Number(
        Object.keys(userInfoTotal[key].favoriteVTRObj).length
      );
      let obj = userInfoTotal[key].favoriteVTRObj;
      let LikeNum = 0;
      Object.keys(obj).forEach(id => {
        LikeNum += Number(obj[id].LikeArray.length);
      });
      userInfoTotal[key]["reviewNum"] = reviewNum;
      userInfoTotal[key]["LikeNumber"] = LikeNum;
    });
    const valArray = Object.values(userInfoTotal);
    valArray.sort(function(a, b) {
      if (Number(a.LikeNumber) < Number(b.LikeNumber)) return 1;
      if (Number(a.LikeNumber) > Number(b.LikeNumber)) return -1;
      return 0;
    });
    let KeyArray = [];
    for (let i = 0; i < 5; i++) {
      if (valArray[i]) {
        KeyArray.push(valArray[i]);
      }
    }
    return KeyArray;
  },
  makeFavorite_VTRCount: state => {
    let valueArray = Object.values(state.usersPublicInfo);
    let favorite_VTRObject = {};
    for (let i = 0; i < valueArray.length; i++) {
      Object.keys(valueArray[i].favoriteVTRObj).forEach(key => {
        favorite_VTRObject[key] = valueArray[i].favoriteVTRObj[key];
      });
    }
    return favorite_VTRObject;
  },
  getYoutuberReview: (state, getters) => videoId => {
    const Favorite = getters.makeFavorite_VTRCount;
    let resultObj = {};
    Object.keys(Favorite).forEach(key => {
      if (Favorite[key].videoId == videoId) {
        resultObj[key] = Favorite[key];
      }
    });
    return resultObj;
  },
  // ==============================
  // Detailページでレビュー投稿者のFavoriteVideoを取ってくる関数
  // ===============================
  getReviewersFavoriteVideos: state => (userArray, pageVideoID) => {
    const userInfo = state.usersPublicInfo;
    let allVideoArray = [];
    for (let i in userArray) {
      const userFavObj = userInfo[userArray[i]].favoriteVTRObj;
      const objArray = Object.values(userFavObj);
      for (let j in objArray) {
        if (
          !allVideoArray.includes(objArray[j].videoId) &&
          objArray[j].videoId !== pageVideoID &&
          objArray[j].cooked == true
        ) {
          allVideoArray.push(objArray[j].videoId);
        }
      }
    }
    return allVideoArray;
  },

  // ==============================
  // 検索でユーザーを表示する関数
  // ===============================
  //別ファイルのstateは第三引数で取得可能
  //https://vuex.vuejs.org/ja/guide/modules.html
  searchAllReviewer: (state, getters, rootState) => {
    let userInfo = state.usersPublicInfo;
    let returnObject = {};
    // console.log(rootState.youtubers.search);
    // console.log(userInfo);
    if (rootState.youtubers.search.length > 2) {
      Object.keys(userInfo).forEach(key => {
        if (
          userInfo[key].nickName
            .toLowerCase()
            .includes(rootState.youtubers.search.toLowerCase())
        ) {
          returnObject[key] = userInfo[key];
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
