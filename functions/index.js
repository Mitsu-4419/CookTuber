const functions = require("firebase-functions");
//スプレッドシート
const { google } = require("googleapis");
//メール送信
const nodemailer = require("nodemailer");
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});
exports.appendSpreadSheet = functions
  .region("asia-northeast1")
  .firestore.document("video_info/{video_infoId}")
  .onCreate((snap, context) => {
    const video_info = snap.data();
    google.auth
      .getClient({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
      })
      .then(auth => {
        const sheets = google.sheets("v4");
        sheets.spreadsheets.values.append({
          auth,
          spreadsheetId: "1cxeRA6LLN5SsygHjpdNMPE04_NIE97uRObzngxnGfHA", // 書き込みたいスプレッドシートのID
          range: "新着レシピ", //書き込み先のシート名やセル範囲
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",
          resource: {
            values: [
              [
                //VideoIdで検索
                video_info.videoId,
                //ドキュメントの任意の属性を必要なだけ入れる
                video_info.channelId,
                video_info.channelTitle,
                video_info.materialTag,
                video_info.menuTag,
                video_info.registerCount,
                video_info.starPoint,
                video_info.videoDescription,
                video_info.videoTitle,
                video_info.viewCount
              ]
            ]
          }
        });
      })
      .then(() => {
        let mailOptions = {
          from: gmailEmail,
          to: gmailEmail,
          subject: "【新着レシピ】CookTuber",
          text:
            "アクセス→ https://docs.google.com/spreadsheets/d/1cxeRA6LLN5SsygHjpdNMPE04_NIE97uRObzngxnGfHA/edit#gid=0"
        };
        mailTransport.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("success");
        });
      });
  });
const admin = require("firebase-admin");
if (admin.apps.length < 1) {
  admin.initializeApp();
}
// // ユーザーのアカウントが作成された時に運営側が保持しておくメールアドレスなど
// フロントからは読み書きできない
exports.registerUsersPrivateData = functions
  .region("asia-northeast1")
  .auth.user()
  .onCreate(async user => {
    // const admin = await getAdmin();
    const db = await admin.firestore();
    var dt = new Date();
    // console.log(db);
    try {
      db.collection("userPrivateInfo")
        .doc(user.uid)
        .set({
          createdAt: dt,
          email: user.email,
          googleName: user.displayName,
          uesrId: user.uid
        });
    } catch (e) {
      db.collection("functions-Error-Log").add({
        detail: "ユーザー新規作成の際に何らかのエラーが発生しました。",
        createdAt: dt,
        payment: 0,
        userId: user.uid
      });
    }
  });
// authの情報削除
exports.registerUsersWithdrawl = functions
  .region("asia-northeast1")
  .auth.user()
  .onDelete(async user => {
    const db = await admin.firestore();
    var dt = new Date();
    try {
      db.collection("userPublicInfo")
        .doc(user.uid)
        .delete();
      db.collection("userPrivateInfo")
        .doc(user.uid)
        .update({
          deleted_at: dt
        });
    } catch (e) {
      db.collection("functions-Error-Log").add({
        detail: "ユーザー登録削除の際に何らかのエラーが発生しました。",
        createdAt: dt,
        userId: user.uid
      });
    }
  });

// 24時間ごとにVideoの再生数を更新する関数
const axios = require("axios");
exports.routineUpdateWatchNumber = functions
  .region("asia-northeast1")
  .pubsub.topic("updateRegisterCount")
  .onPublish(async message => {
    const DB = await admin.firestore();
    const SP = await DB.collection("video_info").get();
    for (let i = 0; i < SP.docs.length; i++) {
      const documentID = SP.docs[i]["id"];
      await axios
        .get("https://www.googleapis.com/youtube/v3/videos", {
          params: {
            key: "AIzaSyAU2_xBQsYmmlTMvW8nmMbbvfDmfOp5gig",
            id: documentID,
            part: "statistics"
          }
        })
        .then(async res => {
          await DB.collection("video_info")
            .doc(documentID)
            .update({
              viewCount: res.data.items[0].statistics.viewCount
            });
        })
        .catch(err => {
          console.log("Yoshidahametyahage");
          console.log(err);
        });
    }
  });
