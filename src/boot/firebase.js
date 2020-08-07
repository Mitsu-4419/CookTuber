import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";

var firebaseui = require("firebaseui");

var firebaseConfig = {
  apiKey: "AIzaSyAU2_xBQsYmmlTMvW8nmMbbvfDmfOp5gig",
  authDomain: "cooktuber-e01f1.firebaseapp.com",
  databaseURL: "https://cooktuber-e01f1.firebaseio.com",
  projectId: "cooktuber-e01f1",
  storageBucket: "gs://cooktuber-e01f1.appspot.com",
  messagingSenderId: "599210527796",
  appId: "1:599210527796:web:9505d6256a70917d838e61",
  measurementId: "G-F3S0VKEBQ7"
};
// Initialize Firebase

let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth();

let firebaseDb = firebaseApp.database();
let firestoreDb = firebaseApp.firestore();
let ui = new firebaseui.auth.AuthUI(firebase.auth());
require("firebaseui/dist/firebaseui.css");

let storage = firebase.storage();
let storageRef = storage.ref();

let firestorebase = firebase.firestore;

//Apple認証Id
const providerApple = new firebase.auth.OAuthProvider("apple.com");

const uiConfig = {
  signInFlow: "redirect",
  signInSuccessUrl: "cooktuber.com",
  // signInSuccessUrl: "http://127.0.0.1:8080/",
  signInOptions: [
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //apple,Microsoft,Yahooは以下のように呼び出し。日本語（firebaseui-ja）はまだ未対応
    {
      provider: providerApple.providerId
    }
  ],

  customParameters: {
    // Forces account selection even when one account
    // is available.
    prompt: "select_account"
  },
  callbacks: {
    signInSuccessWithAuthResult: result => {
      console.log(result);
      if (result.additionalUserInfo.providerId === "google.com") {
        if (result.additionalUserInfo.isNewUser == true) {
          localStorage.setItem("isNewUser", true);
          firestoreDb
            .collection("userPublicInfo")
            .doc(result.user.uid)
            .set({
              nickName: result.user.displayName,
              photoURL: result.user.photoURL,
              introduction: "",
              created_at: firebase.firestore.FieldValue.serverTimestamp(),
              updated_at: firebase.firestore.FieldValue.serverTimestamp(),
              photoName: ""
            });
        } else {
          localStorage.setItem("isNewUser", false);
        }
      } else if (result.additionalUserInfo.providerId === "apple.com") {
        if (result.additionalUserInfo.isNewUser == true) {
          localStorage.setItem("isNewUser", true);
          firestoreDb
            .collection("userPublicInfo")
            .doc(result.user.uid)
            .set({
              nickName: "Apple承認中のアカウント",
              photoURL:
                "https://cooktuber.com/statics/icons/favicon-128x128.png",
              introduction: "",
              created_at: firebase.firestore.FieldValue.serverTimestamp(),
              updated_at: firebase.firestore.FieldValue.serverTimestamp(),
              photoName: ""
            });
        } else {
          localStorage.setItem("isNewUser", false);
        }
      } else if (result.additionalUserInfo.providerId === "twitter.com") {
        if (result.additionalUserInfo.isNewUser == true) {
          localStorage.setItem("isNewUser", true);
          firestoreDb
            .collection("userPublicInfo")
            .doc(result.user.uid)
            .set({
              nickName: result.user.displayName,
              photoURL: result.user.photoURL,
              introduction: "",
              created_at: firebase.firestore.FieldValue.serverTimestamp(),
              updated_at: firebase.firestore.FieldValue.serverTimestamp(),
              photoName: ""
            });
        } else {
          localStorage.setItem("isNewUser", false);
        }
        // // 確認メールの有無
        // const mailFlag = result.user.emailVerified;
        // if (mailFlag === false) {
        //   // 確認メール未時に確認メール送信
        //   firebase
        //     .auth()
        //     .currentUser.sendEmailVerification({
        //       url: "https://cooktuber.com/",
        //       handleCodeInApp: false
        //     })
        //     .then(function() {
        //       localStorage.setItem("isMailUser", true);
        //       firestoreDb
        //         .collection("userPublicInfo")
        //         .doc(result.user.uid)
        //         .set({
        //           nickName: "メール承認中のアカウント",
        //           photoURL:
        //             "https://cooktuber.com/statics/icons/favicon-128x128.png",
        //           introduction: "",
        //           created_at: firebase.firestore.FieldValue.serverTimestamp(),
        //           updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        //           photoName: ""
        //         });
        //       alert("登録メールを送信しました。ご確認ください。");
        //       // console.log(result);
        //     })
        //     .catch(function(error) {});
        // } else {
        //   localStorage.setItem("isMailUser", false);
        // }
      }
    }
  }
};

function deleteUserAccount() {
  firebase
    .auth()
    .currentUser.delete()
    .then(function() {
      console.log("退会処理が完了しました");
    })
    .catch(function(error) {
      alert(
        "ログインの有効時間が切れています。一度ログアウトをして頂き、再度ログインした上でお試しください。"
      );
    });
}

export {
  firebaseAuth,
  firebaseDb,
  uiConfig,
  ui,
  firestoreDb,
  storageRef,
  storage,
  firestorebase,
  deleteUserAccount
};
