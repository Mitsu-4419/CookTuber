import * as firebase from "firebase/app";
import { firestoreDb, firestorebase } from "src/boot/firebase";
import Vue from "vue";
const state = {
  usersPublicInfo: {}
};
console.log(state.usersPublicInfo);
const mutations = {
  setYoutuber_FavoriteCount(state, payload) {
    Vue.set(state.usersPublicInfo, payload.id, payload);
  },
  getLoginUsersProfileMutate(state, payload) {
    state.usersPublicInfo[payload.id] = payload;
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
    // console.log(payload);
    Vue.set(
      state.usersPublicInfo[payload.uid].favoriteYoutuberObj,
      payload.docId,
      payload.obj
    );
  },
  changeReviewInfoMutate(state, payload) {
    Vue.set(
      state.usersPublicInfo[payload.uid].favoriteYoutuberObj[payload.docId],
      "review",
      payload.obj.review
    );
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
  async getUsersPublicProfile({ commit }) {
    const snap = await firestoreDb.collection("userPublicInfo").get();
    // console.log(snap);
    snap.forEach(async data => {
      let payload = {
        id: data.data().id,
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
      let favoriteYoutuberObj = {};
      sp.forEach(async doc => {
        favoriteYoutuberObj[doc.id] = doc.data();
      });
      payload["favoriteYoutuberObj"] = favoriteYoutuberObj;
      commit("setYoutuber_FavoriteCount", payload);
    });
  },
  async getLoginUsersProfile({ commit }, payload) {
    const sp = await firestoreDb
      .collection("userPublicInfo")
      .doc(payload.id)
      .get();
    let obj = {
      id: sp.id,
      created_at: sp.data().created_at,
      updated_at: sp.data().updated_at,
      nickName: payload.nickName,
      introduction: sp.data().introduction,
      photoURL: sp.data().photoURL,
      favoriteCount: sp.data().favoriteCount
    };
    obj["favoriteYoutuberObj"] = {};
    commit("getLoginUsersProfileMutate", obj);
  },
  //ユーザー情報更新から、マイページのユーザーネームの更新
  update_mypageName({ commit }, payload) {
    commit("update_mypageNameMutate", payload);
  },
  //ユーザー情報更新から、マイページの自己紹介の更新
  update_mypageIntroduction({ commit }, payload) {
    commit("update_mypageIntroductionMutate", payload);
  },
  //ユーザー情報更新から、マイページのアイコンの更新
  update_mypagePhotoURL({ commit }, payload) {
    commit("update_mypagePhotoURLMutate", payload);
  },
  //ユーザー情報に登録youtuberの加算
  async addReviewInfo({ commit }, payload) {
    // ユーザーのSubCollectionにデータを入れる
    await firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .collection("favorite_Youtuber")
      .add({
        createdAt: firestorebase.FieldValue.serverTimestamp(),
        updatedAt: firestorebase.FieldValue.serverTimestamp(),
        review: payload.review,
        uid: payload.uid,
        channelId: payload.favoriteTubersChannelId,
        LikeArray: []
      });

    const sp = await firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .collection("favorite_Youtuber")
      .get();
    console.log(sp);
    let Obj = {};
    sp.forEach(doc => {
      Obj[doc.id] = doc.data();
    });
    let getKey;
    for (let key in Obj) {
      if (Obj[key].channelId === payload.favoriteTubersChannelId) {
        getKey = key;
      }
    }
    // console.log(getKey);
    let Payload = {
      docId: getKey,
      uid: payload.uid,
      channelId: payload.favoriteTubersChannelId,
      obj: {
        createdAt: firestorebase.FieldValue.serverTimestamp(),
        review: payload.review,
        uid: payload.uid,
        channelId: payload.favoriteTubersChannelId
      }
    };
    commit("addReviewInfoMutate", Payload);
  },
  // レビューの更新をする
  changeReviewInfo({ commit }, payload) {
    let Payload = {
      uid: payload.uid,
      channelId: payload.favoriteTubers,
      docId: payload.docId,
      obj: {
        createdAt: firestorebase.FieldValue.serverTimestamp(),
        review: payload.review,
        uid: payload.id,
        channelId: payload.favoriteTubers
      }
    };
    commit("changeReviewInfoMutate", Payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .collection("favorite_Youtuber")
      .doc(payload.docId)
      .update({
        review: payload.review,
        updatedAt: firestorebase.FieldValue.serverTimestamp()
      });
  },

  //ユーザー情報に登録youtuberの加算
  async addReviewInfo({ commit }, payload) {
    // ユーザーのSubCollectionにデータを入れる
    await firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .collection("favorite_Youtuber")
      .add({
        createdAt: firestorebase.FieldValue.serverTimestamp(),
        updatedAt: firestorebase.FieldValue.serverTimestamp(),
        review: payload.review,
        uid: payload.uid,
        channelId: payload.favoriteTubersChannelId,
        LikeArray: []
      });
    const sp = await firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .collection("favorite_Youtuber")
      .get();
    let Obj = {};
    sp.forEach(doc => {
      Obj[doc.id] = doc.data();
    });
    let getKey;
    for (let key in Obj) {
      if (Obj[key].channelId === payload.favoriteTubersChannelId) {
        getKey = key;
      }
    }
    // console.log(getKey);
    let Payload = {
      docId: getKey,
      uid: payload.uid,
      channelId: payload.favoriteTubersChannelId,
      obj: {
        createdAt: firestorebase.FieldValue.serverTimestamp(),
        review: payload.review,
        uid: payload.uid,
        channelId: payload.favoriteTubersChannelId
      }
    };
    commit("addReviewInfoMutate", Payload);
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
  // ユーザー全員のお気に入りレビューなどを取ってきている
  getfavoriteObject: state => (userId, live) => {
    if (live) {
      // console.log(live);//arrayで50個取れる
      const valueArray = state.usersPublicInfo;
      let userFavoriteArray = valueArray[userId].favoriteYoutuberObj;
      let returnObj = {};
      for (let key in userFavoriteArray) {
        for (let i = 0; i < live.length; i++) {
          if (userFavoriteArray[key].channelId === live[i]) {
            returnObj[key] = userFavoriteArray[key];
          }
        }
      }
      return returnObj;
    } else {
      let valueArray = state.usersPublicInfo;
      return valueArray[userId].favoriteYoutuberObj;
    }
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
