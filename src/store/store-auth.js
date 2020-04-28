import * as firebase from "firebase/app";
import { LocalStorage, Loading } from "quasar";
import { firestoreDb, firestorebase, firebaseAuth } from "src/boot/firebase";
import Vue from "vue";
const state = {
  loggedIn: false,
  userInfo: {}
};
const mutations = {
  setLoggedIn(state, value) {
    state.loggedIn = value;
  },
  setUserInfo(state, payload) {
    Vue.set(state.userInfo, payload.id, payload);
  }
};
const actions = {
  logoutUser() {
    firebaseAuth.signOut();
  },
  handleAuthStateChange({ commit }) {
    firebaseAuth.onAuthStateChanged(async user => {
      Loading.hide();
      let isNewUser = localStorage.getItem("isNewUser");
      if (user) {
        const snap = await firestoreDb
          .collection("userPublicInfo")
          .doc(user.uid)
          .get();
        var payload = {
          id: user.uid,
          nickName: snap.data().nickName,
          photoURL: snap.data().photoURL,
          favoriteCount: snap.data().favoriteCount,
          introduction: snap.data().introduction,
          photoName: snap.data().photoName
        };
        const sp = await firestoreDb
          .collection("userPublicInfo")
          .doc(user.uid)
          .collection("favorite_VTR")
          .get();
        // console.log(sp);
        let favoriteYoutuberObj = {};
        sp.forEach(async doc => {
          favoriteYoutuberObj[doc.id] = doc.data();
        });
        payload["favoriteYoutuberObj"] = favoriteYoutuberObj;
        // await firestoreDb.collection
        commit("setLoggedIn", true);
        commit("setUserInfo", payload);
        LocalStorage.set("loggedIn", true);
        // 初めてのユーザーの場合最初にDisplayNameを決めてもらう。
        if (isNewUser == "true") {
          this.$router.push("/registerDisplayName").catch(err => {});
        } else if (isNewUser == "false") {
          this.$router.push("/").catch(err => {});
        }
      } else {
        commit("setLoggedIn", false);
        LocalStorage.set("loggedIn", false);
        commit("deleteUserInfo", {});
        this.$router.replace("/").catch(err => {});
      }
    });
  },
  // userInfoの編集
  //ユーザー情報更新から、ユーザーネームの更新
  update_displayName({ commit }, payload) {
    commit("update_displayNameMutate", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.id)
      .update({
        nickName: payload.userName,
        updated_at: firestorebase.FieldValue.serverTimestamp()
      });
  },
  // setNickName({ commit }, payload) {
  //   commit("setNickNameMutate", payload);
  // },
  //ユーザー情報更新から、自己紹介の更新
  update_displayIntroduction({ commit }, payload) {
    commit("update_displayIntroductionMutate", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.id)
      .update({
        introduction: payload.userIntroduction,
        updated_at: firestorebase.FieldValue.serverTimestamp()
      });
  },
  //ユーザー情報更新から、アイコンの更新
  update_displayPhotoURL({ commit }, payload) {
    commit("update_displayPhotoURLMutate", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.id)
      .update({
        photoURL: payload.userPhotoURL,
        updated_at: firestorebase.FieldValue.serverTimestamp()
      });
  },
  //次回の更新にdeleteするファイル名を識別のためにidつけて名前を保存
  update_PhotoName({ commit }, payload) {
    commit("update_PhotoName", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.id)
      .update({
        photoName: payload.userPhotoName
      });
  },

  //ユーザー情報に登録youtuberの加算
  addFavoriteTuber({ commit }, payload) {
    //stateを通してフロントでユーザーにはレビュー編集削除が行われているように見せる
    //DBの更新はstore-userPublic.jsで行う
    let Payload = {
      uid: payload.uid,
      docId: makeRandomDocId(),
      obj: {
        createdAt: firestorebase.FieldValue.serverTimestamp(),
        review: payload.review,
        uid: payload.uid,
        channelId: payload.favoriteTubersChannelId
      }
    };
    //favカウントの加算
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .update({
        //deleteする場所と値の指定
        favoriteCount: firestorebase.FieldValue.increment(1)
      });
    commit("addFavoriteTuberMutate", Payload);
  },
  //レビューの更新
  rewriteReviewAction({ commit }, payload) {
    commit("rewriteReviewMutate", payload);
  },
  //ユーザー情報から登録youtuberを削除
  delFavoriteTuber({ commit }, payload) {
    commit("delFavoriteTuber", payload);
    firestoreDb
      .collection("userPublicInfo")
      .doc(payload.uid)
      .update({
        //deleteする場所と値の指定
        favoriteCount: firestorebase.FieldValue.increment(-1)
      });
  }
};
const getters = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
