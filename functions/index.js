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
