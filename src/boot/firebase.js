import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";

var firebaseui = require("firebaseui-ja");

var firebaseConfig = {
  apiKey: "AIzaSyAU2_xBQsYmmlTMvW8nmMbbvfDmfOp5gig",
  authDomain: "cooktuber-e01f1.firebaseapp.com",
  databaseURL: "https://cooktuber-e01f1.firebaseio.com",
  projectId: "cooktuber-e01f1",
  storageBucket: "cooktuber-e01f1.appspot.com",
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

const uiConfig = {
  signInFlow: "redirect",
  signInSuccessUrl: "http://127.0.0.1:8081/",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  customParameters: {
    // Forces account selection even when one account
    // is available.
    prompt: "select_account"
  },
  callbacks: {
    signInSuccessWithAuthResult: result => {
      if (result.additionalUserInfo.isNewUser == true) {
        firestoreDb
          .collection("userPublicInfo")
          .doc(result.user.uid)
          .set({
            nickName: result.user.displayName,
            photoURL: result.user.photoURL,
            introduction: "",
            favoriteCount: 0,
            created_at: firebase.firestore.FieldValue.serverTimestamp(),
            updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            photoName: ""
          });
        localStorage.setItem("isNewUser", true);
      } else {
        localStorage.setItem("isNewUser", false);
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
