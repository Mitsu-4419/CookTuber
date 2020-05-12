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
    let Payload = {
      uid: payload.uid,
      docId: payload.docId,
      obj: {
        updatedAt: firestorebase.FieldValue.serverTimestamp(),
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
  getfavoriteCookedObject: state => (userId, tab) => {
    const valueArray = state.usersPublicInfo;
    let userFavoriteObj = valueArray[userId].favoriteVTRObj;
    let returnObj = {};
    if (tab == "cooked") {
      console.log("hフォhdそあほ");
      Object.keys(userFavoriteObj).forEach(key => {
        if (userFavoriteObj[key].cooked == true) {
          returnObj[key] = userFavoriteObj[key];
        }
      });
      return returnObj;
    } else if (tab == "NotCooked") {
      console.log("hhoohodshfaohdio");
      Object.keys(userFavoriteObj).forEach(key => {
        if (userFavoriteObj[key].cooked == false) {
          returnObj[key] = userFavoriteObj[key];
        }
      });
      return returnObj;
    }
  },
  // ユーザーのObjにユーザーのレビュー数、付いたいいねの総数を入れる処理
  setLikeNumReviewNum: state => {
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
    let sortedByMany = {};
    if (valArray.length < 20) {
      for (let i = 0; i < valArray.length; i++) {
        sortedByMany[valArray[i].id] = valArray[i];
      }
    } else {
      for (let i = 0; i < 20; i++) {
        sortedByMany[valArray[i].id] = valArray[i];
      }
    }

    return sortedByMany;
  },
  // -------------------------------
  // topPageでトップレビューワーを取ってくるところ
  // -------------------------------
  getTop5Reviewer: (state, getters) => {
    let videoObj = getters.getSortedReviewer("参考になった数が多い順");
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
    console.log(returnObj);
    return returnObj;
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
  // videolIdごとにレビュー情報を取ってきている
  // getYoutuberReview: (state, getters) => channelId => {
  //   const FavoriteCount = getters.makeYoutuberFavoriteCount;
  //   let resultObj = {};
  //   Object.keys(FavoriteCount).forEach(key => {
  //     if (FavoriteCount[key].channelId == channelId) {
  //       resultObj[key] = FavoriteCount[key];
  //     }
  //   });
  //   return resultObj;
  // },
  // userPublicのデータからKeyをDocID、データをお気に入りのデータとしてお気に入りを全て取ってきたオブジェクトを作る
  // makeYoutuberFavoriteCount: state => {
  //   let valueArray = Object.values(state.usersPublicInfo);
  //   let YoutuberFavoriteCountObject = {};
  //   for (let i = 0; i < valueArray.length; i++) {
  //     Object.keys(valueArray[i].favoriteYoutuberObj).forEach(key => {
  //       YoutuberFavoriteCountObject[key] =
  //         valueArray[i].favoriteYoutuberObj[key];
  //     });
  //   }
  //   return YoutuberFavoriteCountObject;
  // },
  // 共通の処理
  // チャンネルIdとお気に入り数の一対一のオブジェクトを返すGetter
  // {channelId:'お気に入り数',}
  // makeNumberArray: state => obj => {
  //   const NumberObj = {};
  //   let valueArray = Object.values(obj);
  //   let keyArray = Object.keys(obj);
  //   for (let j = 0; j < keyArray.length; j++) {
  //     let Key = valueArray[j].channelId;
  //     NumberObj[Key] = 0;
  //   }
  //   for (let i = 0; i < valueArray.length; i++) {
  //     let key = valueArray[i].channelId;
  //     NumberObj[key]++;
  //   }
  //   return NumberObj;
  // },
  // NumberObjを良いね数でランキングに並び替える関数
  // makeRankingObj: state => NumberObj => {
  //   let ObjArray = [];
  //   let kkeyArray = Object.keys(NumberObj);
  //   for (let k = 0; k < kkeyArray.length; k++) {
  //     let payload = {
  //       id: kkeyArray[k],
  //       count: NumberObj[kkeyArray[k]]
  //     };
  //     ObjArray.push(payload);
  //   }
  //   ObjArray.sort(function(a, b) {
  //     if (Number(a.count) < Number(b.count)) return 1;
  //     if (Number(a.count) > Number(b.count)) return -1;
  //     return 0;
  //   });
  //   let rankResultObj = {};
  //   if (ObjArray.length < 11) {
  //     for (let q = 0; q < ObjArray.length; q++) {
  //       let payload = {
  //         rank: q + 1,
  //         count: ObjArray[q].count
  //       };
  //       rankResultObj[ObjArray[q].id] = payload;
  //     }
  //   } else {
  //     for (let q = 0; q < 10; q++) {
  //       let payload = {
  //         rank: q + 1,
  //         count: ObjArray[q].count
  //       };
  //       rankResultObj[ObjArray[q].id] = payload;
  //     }
  //   }
  //   return rankResultObj;
  // },
  // 全体の{channelId:'お気に入り数'}のArrrayを返す
  // getNumberArray: (state, getters) => {
  //   const FavoriteCount = getters.makeYoutuberFavoriteCount;
  //   return getters.makeNumberArray(FavoriteCount);
  // },
  // getDailyRanking: (state, getters) => {
  //   const FavoriteCount = getters.makeYoutuberFavoriteCount;
  //   // 現在時刻を秒で取得
  //   let date = new Date();
  //   let a = date.getTime();
  //   let nowSeconds = Math.floor(a / 1000);
  //   // 1日は86400秒
  //   let startSeconds = Number(nowSeconds) - 86400;
  //   let sortedObj = {};
  //   Object.keys(FavoriteCount).forEach(key => {
  //     let regiDate = FavoriteCount[key].createdAt.seconds;
  //     if (startSeconds < regiDate && regiDate < nowSeconds) {
  //       sortedObj[key] = FavoriteCount[key];
  //     }
  //   });
  //   let NumBerObj = getters.makeNumberArray(sortedObj);
  //   return getters.makeRankingObj(NumBerObj);
  // },
  // getWeeklyRanking: (state, getters) => {
  //   const FavoriteCount = getters.makeYoutuberFavoriteCount;
  //   // 現在時刻を秒で取得
  //   let date = new Date();
  //   let a = date.getTime();
  //   let nowSeconds = Math.floor(a / 1000);
  //   // 1週間は604800秒
  //   let startSeconds = Number(nowSeconds) - 604800;
  //   let sortedObj = {};
  //   Object.keys(FavoriteCount).forEach(key => {
  //     let regiDate = FavoriteCount[key].createdAt.seconds;
  //     if (startSeconds < regiDate && regiDate < nowSeconds) {
  //       sortedObj[key] = FavoriteCount[key];
  //     }
  //   });
  //   let NumBerObj = getters.makeNumberArray(sortedObj);
  //   return getters.makeRankingObj(NumBerObj);
  // },
  // getMonthlyRanking: (state, getters) => {
  //   const FavoriteCount = getters.makeYoutuberFavoriteCount;
  //   // 現在時刻を秒で取得
  //   let date = new Date();
  //   let a = date.getTime();
  //   let nowSeconds = Math.floor(a / 1000);
  //   // １ヶ月は18144000秒
  //   let startSeconds = Number(nowSeconds) - 18144000;
  //   let sortedObj = {};
  //   Object.keys(FavoriteCount).forEach(key => {
  //     let regiDate = FavoriteCount[key].createdAt.seconds;
  //     if (startSeconds < regiDate && regiDate < nowSeconds) {
  //       sortedObj[key] = FavoriteCount[key];
  //     }
  //   });
  //   let NumBerObj = getters.makeNumberArray(sortedObj);
  //   return getters.makeRankingObj(NumBerObj);
  // },
  // getAllTermRanking: (state, getters) => {
  //   return getters.makeRankingObj(getters.getNumberArray);
  // }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
