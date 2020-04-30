import * as firebase from "firebase/app";
import { firestoreDb, firebaseDb } from "src/boot/firebase";
import Vue from "vue";
import axios from "axios";

const state = {
  YoutubersChannel_info: {},
  search: ""
};
console.log(state.YoutubersChannel_info);
const mutations = {
  setYoutuber_Info(state, payload) {
    Vue.set(state.YoutubersChannel_info, payload.id, payload);
  },
  setSearch(state, value) {
    state.search = value;
  }
};

const actions = {
  async getYoutubers_info({ commit }) {
    const snap = await firestoreDb.collection("YouTubers_basic_info").get();
    console.log(snap);
    snap.forEach(async data => {
      let payload = {
        id: data.id,
        description: data.data().description,
        favoriteCount: data.data().favoriteCount,
        iconUrl: data.data().iconUrl,
        name: data.data().name,
        register_date: data.data().register_date,
        subscriberCounts: data.data().subscriberCounts,
        twitterId: data.data().twitterId
      };
      console.log(payload);
      commit("setYoutuber_Info", payload);
    });
  },
  //youTuberBasic
  // Liveしているyouutbeの情報を取得
  // async getLiveYoutubers_info({ commit }) {
  // ページに訪れた際にその時にLiveしているYoutubeチャンネルの上位５０Channelをとってきて表示
  // const data = await axios.get(
  //   "https://www.googleapis.com/youtube/v3/search",
  //   {
  //     params: {
  //       key: "AIzaSyBXPu8UOq9uDnpquJOXnke3GV8qY1AZCbg",
  //       part: "snippet",
  //       type: "video",
  //       eventType: "live",
  //       videoCategoryId: "20",
  //       maxResults: 50,
  //       regionCode: "JP",
  //       q:
  //         "あ|い|う|え|お|か|き|く|け|こ|さ|し|す|せ|そ|た|ち|つ|て|と|な|に|ぬ|ね|の|は|ひ|ふ|へ|ほ|ま|み|む|め|も|や|ゆ|よ|ら|り|る|れ|ろ|わ|お|ん"
  //     }
  //   }
  // );
  // AIzaSyBXPu8UOq9uDnpquJOXnke3GV8qY1AZCbg
  //AIzaSyDEY1PP7MHXf9ePYoAxqIkK-zRIE-XedFg this one
  //AIzaSyD4zHOJT_M6y6ERxKN51VRWh11DoMCcHp4

  //AIzaSyDNYcYOeZ3VEwVtEQgDUjDkKTqHmpbEkf8
  //AIzaSyBjxhn_nQEqqgYGFprKLZJYcfZu3l0nEDI
  // AIzaSyC--tOcw2QmLOp2oudjQnITXgD0GeW-Voc ※

  // AIzaSyBtYjdGQvSJuLzfsNge3MuyJT_v1B5ZZ3k
  // AIzaSyC--tOcw2QmLOp2oudjQnITXgD0GeW-Voc
  // AIzaSyD-MVQqNW2oRsFidBbG9Q25EWna_OTEBTM
  // AIzaSyA7kq_sOzjdxusYJ_K3hm1d7HMAVYEGK_s

  // もしライブ中継しているビデオがあったらビデオの詳細をとってくる
  // if (data.data.items.length > 0) {
  //   data.data.items.forEach(async Doc => {
  //     let videoId = Doc.id.videoId;
  //     const res = await axios.get(
  //       "https://www.googleapis.com/youtube/v3/videos",
  //       {
  //         params: {
  //           key: "AIzaSyDEY1PP7MHXf9ePYoAxqIkK-zRIE-XedFg",
  //           id: videoId,
  //           part: "liveStreamingDetails, snippet, statistics"
  //         }
  //       }
  //     );
  //     const liveDetail = res.data.items[0].liveStreamingDetails;
  //     const snippet = res.data.items[0].snippet;
  //     const statistics = res.data.items[0].statistics;
  //     const payload = {
  //       id: Doc.snippet.channelId,
  //       videoId: videoId,
  //       videoStartTime: liveDetail.actualStartTime,
  //       concurrentViewers: liveDetail.concurrentViewers,
  //       snippet: snippet,
  //       likeCount: statistics.likeCount
  //     };
  //     commit("setLiveDetail", payload);
  //   });
  // その時にライブしているチャンネルのデータがまだDB登録されていなければ、DBに登録する
  // YoutuberのCollectionから一覧をとってくる
  // 現在LiveしているyoutuberのArrayを作る
  //     let liveYoutuberIDArray = [];
  //     data.data.items.forEach(dc => {
  //       liveYoutuberIDArray.push(dc.snippet.channelId);
  //     });
  //     const snap = await firebaseDb.ref("Youtubers_basic_info").once("value");
  //     for (let i = 0; i < liveYoutuberIDArray.length; i++) {
  //       if (!Object.keys(snap.val()).includes(liveYoutuberIDArray[i])) {
  //         let Data = await axios.get(
  //           "https://www.googleapis.com/youtube/v3/channels",
  //           {
  //             params: {
  //               key: "AIzaSyC--tOcw2QmLOp2oudjQnITXgD0GeW-Voc",

  //               id: liveYoutuberIDArray[i],
  //               part: "statistics, snippet"
  //             }
  //           }
  //         );
  //         const url = Data.data.items[0].snippet.thumbnails.default.url;
  //         const name = Data.data.items[0].snippet.title;
  //         const description = Data.data.items[0].snippet.description;
  //         const subscriberCount = Data.data.items[0].statistics.subscriberCount;
  //         const register_date = Data.data.items[0].snippet.publishedAt.split(
  //           "T"
  //         )[0];
  //         // Databaseに入れるJSONを作る
  //         let info = {};
  //         info[liveYoutuberIDArray[i]] = {
  //           id: liveYoutuberIDArray[i],
  //           name: name,
  //           description: description,
  //           iconUrl: url,
  //           subscriberCounts: subscriberCount,
  //           register_date: register_date,
  //           twitterId: "",
  //           favoriteCount: 0
  //         };
  //         await firebaseDb.ref("Youtubers_basic_info/").update(info);
  //       }
  //     }
  //   } else {
  //     console.log("現在実況はありません");
  //   }
  // },

  //検索バーから文字列を渡す
  setSearch({ commit }, value) {
    commit("setSearch", value);
  }
};

const getters = {
  // 共通の処理を得るGetters
  getLiveDetailArray: state => {
    let liveWatcher = state.liveDetail;
    let array = [];
    array = Object.values(liveWatcher);
    return array;
  },
  // ジャンルがALLで、視聴者数などでソートするGetter
  AllLiveWatchNumber: (state, getters) => flag => {
    let array = getters.getLiveDetailArray;
    if (flag == "視聴者数が多い動画") {
      array.sort(function(a, b) {
        if (Number(a.concurrentViewers) < Number(b.concurrentViewers)) return 1;
        if (Number(a.concurrentViewers) > Number(b.concurrentViewers))
          return -1;
        return 0;
      });
    } else if (flag == "視聴者数が少ない動画") {
      array.sort(function(a, b) {
        if (Number(a.concurrentViewers) > Number(b.concurrentViewers)) return 1;
        if (Number(a.concurrentViewers) < Number(b.concurrentViewers))
          return -1;
        return 0;
      });
    } else if (flag == "高評価が多い動画") {
      array.sort(function(e, f) {
        if (Number(e.likeCount) < Number(f.likeCount)) return 1;
        if (Number(e.likeCount) > Number(f.likeCount)) return -1;
        return 0;
      });
    } else if (flag == "配信開始したばかりの動画") {
      array.sort(function(e, f) {
        if (
          Number(new Date(e.videoStartTime)) <
          Number(new Date(f.videoStartTime))
        )
          return 1;
        if (
          Number(new Date(e.videoStartTime)) >
          Number(new Date(f.videoStartTime))
        )
          return -1;
        return 0;
      });
    }
    let sortedByMany = {};
    for (let i = 0; i < array.length; i++) {
      sortedByMany[array[i].id] = array[i];
    }
    return sortedByMany;
  },
  // トップページで
  // TopPageで上位10個までのVideoを表示させるGetters
  AllLiveWatchManyTop10: (state, getters) => {
    let resultObj = getters.AllLiveWatchNumber("視聴者数が多い動画");
    let ObjectKeysArray = Object.keys(resultObj);
    let sortedByManyTop10 = {};
    //jsonにデータがあるYouTuberのみ、10名表示
    if (ObjectKeysArray.length > 10) {
      for (let j = 0; j < 10; j++) {
        sortedByManyTop10[ObjectKeysArray[j]] = resultObj[ObjectKeysArray[j]];
      }
      return sortedByManyTop10;
    } else {
      return resultObj;
    }
  },
  //-----------------------------------------------------------------------
  //--------------------------現在配信中-------------------------------------
  //------------------------------------------------------------------------
  // SortLiveWatchNumber: (state, getters) => (id, ID, flag) => {
  //   let SortLiveArray = getters.getLiveDetailArray;
  //   let SortedLiveArray = [];
  //   let LiveWatchManyObj = {};
  //   for (let k = 0; k < SortLiveArray.length; k++) {
  //     if (
  //       SortLiveArray[k].snippet.title.includes(id) ||
  //       SortLiveArray[k].snippet.title.toLowerCase().includes(ID)
  //     ) {
  //       SortedLiveArray.push(SortLiveArray[k]);
  //     }
  //   }
  //   if (flag == "視聴者数が多い動画") {
  //     SortedLiveArray.sort(function(e, f) {
  //       if (Number(e.concurrentViewers) < Number(f.concurrentViewers)) return 1;
  //       if (Number(e.concurrentViewers) > Number(f.concurrentViewers))
  //         return -1;
  //       return 0;
  //     });
  //   } else if (flag == "視聴者数が少ない動画") {
  //     SortedLiveArray.sort(function(e, f) {
  //       if (Number(e.concurrentViewers) > Number(f.concurrentViewers)) return 1;
  //       if (Number(e.concurrentViewers) < Number(f.concurrentViewers))
  //         return -1;
  //       return 0;
  //     });
  //   } else if (flag == "高評価が多い動画") {
  //     SortedLiveArray.sort(function(e, f) {
  //       if (Number(e.likeCount) < Number(f.likeCount)) return 1;
  //       if (Number(e.likeCount) > Number(f.likeCount)) return -1;
  //       return 0;
  //     });
  //   } else if (flag == "配信開始したばかりの動画") {
  //     SortedLiveArray.sort(function(e, f) {
  //       if (
  //         Number(new Date(e.videoStartTime)) <
  //         Number(new Date(f.videoStartTime))
  //       )
  //         return 1;
  //       if (
  //         Number(new Date(e.videoStartTime)) >
  //         Number(new Date(f.videoStartTime))
  //       )
  //         return -1;
  //       return 0;
  //     });
  //   }
  //   for (let l = 0; l < SortedLiveArray.length; l++) {
  //     LiveWatchManyObj[SortedLiveArray[l].id] = SortedLiveArray[l];
  //   }
  //   return LiveWatchManyObj;
  // },
  // //-----------------------------------------------------------------------
  //--------------------------配信待機中-------------------------------------
  //------------------------------------------------------------------------
  //ALLすぐに配信する順番でソート
  // AllLiveWaitSort: state => flag => {
  //   let liveWaiterStartTime = state.liveWaitDetail;
  //   let arrayTime = [];
  //   arrayTime = Object.values(liveWaiterStartTime);
  //   if (flag == "すぐに配信開始する動画") {
  //     arrayTime.sort(function(a, b) {
  //       if (
  //         Number(new Date(a.videoStartTime)) >
  //         Number(new Date(b.videoStartTime))
  //       )
  //         return 1;
  //       if (
  //         Number(new Date(a.videoStartTime)) <
  //         Number(new Date(b.videoStartTime))
  //       )
  //         return -1;
  //       return 0;
  //     });
  //   } else if (flag == "あとで配信開始する動画") {
  //     arrayTime.sort(function(a, b) {
  //       if (
  //         Number(new Date(a.videoStartTime)) <
  //         Number(new Date(b.videoStartTime))
  //       )
  //         return 1;
  //       if (
  //         Number(new Date(a.videoStartTime)) >
  //         Number(new Date(b.videoStartTime))
  //       )
  //         return -1;
  //       return 0;
  //     });
  //   } else if (flag == "高評価が多い動画") {
  //     arrayTime.sort(function(a, b) {
  //       if (Number(a.likeCount) < Number(b.likeCount)) return 1;
  //       if (Number(a.likeCount) > Number(b.likeCount)) return -1;
  //       return 0;
  //     });
  //   }
  //   let sortedByStartTime = {};
  //   for (let i = 0; i < arrayTime.length; i++) {
  //     sortedByStartTime[arrayTime[i].id] = arrayTime[i];
  //   }
  //   return sortedByStartTime;
  // },
  // // TopPageで表示する10の動画
  // AllLiveWaitStartTimeTop10: (state, getters) => {
  //   let resultObj = getters.AllLiveWaitSort("すぐに配信開始する動画");
  //   let ObjectKeysArray = Object.keys(resultObj);
  //   // console.log(ObjectKeysArray);
  //   let sortedByManyTop10 = {};
  //   //10名取得、jsonにデータがあるYouTuberのみ表示
  //   if (ObjectKeysArray.length > 10) {
  //     for (let j = 0; j < 10; j++) {
  //       sortedByManyTop10[ObjectKeysArray[j]] = resultObj[ObjectKeysArray[j]];
  //     }
  //     // console.log(sortedByManyTop10);
  //     return sortedByManyTop10;
  //   } else {
  //     return resultObj;
  //   }
  // },
  //------------------------ーーーーーーーーーーーーーーーーーー
  // 　Live中も、Live待機中も同じものを使っっている
  //------------------------ゲームごとにソートーーーーーーーーーーーーーーーーーー
  // 各TABを選択して、かつselectのところが配信時間間近の順のソート
  // SortLiveWaitByTitle: state => (id, ID, flag) => {
  //   let liveWaiter = state.liveWaitDetail;
  //   let SortLiveArray = [];
  //   SortLiveArray = Object.values(liveWaiter);
  //   let SortedLiveArray = [];
  //   let LiveWatchSmallObj = {};
  //   for (let k = 0; k < SortLiveArray.length; k++) {
  //     if (
  //       SortLiveArray[k].snippet.title.includes(id) ||
  //       SortLiveArray[k].snippet.title.toLowerCase().includes(ID)
  //     ) {
  //       SortedLiveArray.push(SortLiveArray[k]);
  //     }
  //   }
  //   if (flag == "すぐに配信開始する動画") {
  //     SortedLiveArray.sort(function(e, f) {
  //       if (
  //         Number(new Date(e.videoStartTime)) >
  //         Number(new Date(f.videoStartTime))
  //       )
  //         return 1;
  //       if (
  //         Number(new Date(e.videoStartTime)) <
  //         Number(new Date(f.videoStartTime))
  //       )
  //         return -1;
  //       return 0;
  //     });
  //   } else if (flag == "あとで配信開始する動画") {
  //     SortedLiveArray.sort(function(e, f) {
  //       if (
  //         Number(new Date(e.videoStartTime)) <
  //         Number(new Date(f.videoStartTime))
  //       )
  //         return 1;
  //       if (
  //         Number(new Date(e.videoStartTime)) >
  //         Number(new Date(f.videoStartTime))
  //       )
  //         return -1;
  //       return 0;
  //     });
  //   } else if (flag == "高評価が多い動画") {
  //     SortedLiveArray.sort(function(e, f) {
  //       if (Number(e.likeCount) < Number(f.likeCount)) return 1;
  //       if (Number(e.likeCount) > Number(f.likeCount)) return -1;
  //       return 0;
  //     });
  //   }
  //   for (let l = 0; l < SortedLiveArray.length; l++) {
  //     LiveWatchSmallObj[SortedLiveArray[l].id] = SortedLiveArray[l];
  //   }
  //   return LiveWatchSmallObj;
  // },
  //------------------------------------------------------------------
  //---------------------YoutuberPaged--------------------------------
  //------------------------------------------------------------------
  //--
  //------------------------ソート機能----------------------------------
  //--
  //------------------------------------------------
  // ALL YoutuberPagedで登録者数を多い順にソートする関数
  //------------------------------------------------
  // 共通の処理をまとめる
  // Searchに言葉があった時の処理
  // getYouruberDetailIncludes: state => {
  //   let YoutuberInfo = state.YoutubersChannel_info;
  //   let youtuberDetail = Object.values(YoutuberInfo).filter(fil => {
  //     return (
  //       fil.name.toLowerCase().includes(state.search.toLowerCase()) ||
  //       fil.description.toLowerCase().includes(state.search.toLowerCase())
  //     );
  //   });
  //   return youtuberDetail;
  // },
  sortRegiNumMany: (state, getters) => (genre1, genre2, flag) => {
    let youtuberDetail = [];
    let YoutuberInfo = state.YoutubersChannel_info;
    youtuberDetail = Object.values(YoutuberInfo);
    let SortedLiveArray = [];
    if (genre1 !== "all" && genre2 !== "all") {
      for (let k = 0; k < youtuberDetail.length; k++) {
        if (
          youtuberDetail[k].description.includes(genre1) ||
          youtuberDetail[k].description.toLowerCase().includes(genre2)
        ) {
          SortedLiveArray.push(youtuberDetail[k]);
        }
      }
      youtuberDetail = SortedLiveArray;
    } else if (genre1 == "all" && genre2 == "all") {
      youtuberDetail = youtuberDetail;
    }
    if (flag == "登録者数が多い順") {
      youtuberDetail.sort(function(a, b) {
        if (
          Number(a.subscriberCounts.toString()) <
          Number(b.subscriberCounts.toString())
        )
          return 1;
        if (
          Number(a.subscriberCounts.toString()) >
          Number(b.subscriberCounts.toString())
        )
          return -1;
        return 0;
      });
    } else if (flag == "登録者数が少ない順") {
      youtuberDetail.sort(function(a, b) {
        if (
          Number(a.subscriberCounts.toString()) >
          Number(b.subscriberCounts.toString())
        )
          return 1;
        if (
          Number(a.subscriberCounts.toString()) <
          Number(b.subscriberCounts.toString())
        )
          return -1;
        return 0;
      });
    }
    // 登録Youtuberの数が多いので50ずつ表示するように分けて、配列にしてデータを返す
    let SortedByManyYoutuberArray = [];
    let SortedByManyYoutuber = {};
    let syou = Math.floor(youtuberDetail.length / 50);
    for (let k = 0; k < syou; k++) {
      for (let j = k * 50; j < k * 50 + 50; j++) {
        SortedByManyYoutuber[youtuberDetail[j].id] = youtuberDetail[j];
      }
      SortedByManyYoutuberArray.push(SortedByManyYoutuber);
      SortedByManyYoutuber = {};
    }
    // 最後に余りの部分を配列に入れる
    for (let q = syou * 50; q < youtuberDetail.length; q++) {
      SortedByManyYoutuber[youtuberDetail[q].id] = youtuberDetail[q];
    }
    SortedByManyYoutuberArray.push(SortedByManyYoutuber);
    return SortedByManyYoutuberArray;
  }

  //------------------------------------------------------------------
  //---------------------MYpage--------------------------------
  //------------------------------------------------------------------
  //--
  //------------------------ソート機能----------------------------------
  //--
  //------------------------------------------------
  // ALL MYpageで登録者数を多い順にソートする関数
  //------------------------------------------------
  // sortRegiNumManyMyPage: state => (fav, flag, LiveOrWait, channelArray) => {
  //   let YoutuberInfo = state.YoutubersChannel_info;
  //   let youtubers = Object.values(YoutuberInfo).filter(function(value) {
  //     for (let i = 0; i < fav.length; i++) {
  //       if (value.id === fav[i]) return true;
  //     }
  //   });
  //   if (LiveOrWait == "all") {
  //     youtubers = youtubers;
  //   } else if (LiveOrWait == "LiveNow" || LiveOrWait == "LiveWait") {
  //     youtubers = youtubers.filter(function(value) {
  //       //オブジェクト内を繰り返す
  //       for (let i = 0; i < channelArray.length; i++) {
  //         //オブジェクトと配列の品名を比較する
  //         if (value.id === channelArray[i]) return true;
  //       }
  //     });
  //   }
  //   if (flag == "登録者数が多い順") {
  //     youtubers.sort(function(a, b) {
  //       if (
  //         Number(a.subscriberCounts.toString()) <
  //         Number(b.subscriberCounts.toString())
  //       )
  //         return 1;
  //       if (
  //         Number(a.subscriberCounts.toString()) >
  //         Number(b.subscriberCounts.toString())
  //       )
  //         return -1;
  //       return 0;
  //     });
  //   } else if (flag == "登録者数が少ない順") {
  //     youtubers.sort(function(a, b) {
  //       if (
  //         Number(a.subscriberCounts.toString()) >
  //         Number(b.subscriberCounts.toString())
  //       )
  //         return 1;
  //       if (
  //         Number(a.subscriberCounts.toString()) <
  //         Number(b.subscriberCounts.toString())
  //       )
  //         return -1;
  //       return 0;
  //     });
  //   }

  //   return youtubers;
  // },
  // -----------------------------
  // ----検索結果一覧表示----------
  // -----------------------------
  // Searchに言語があった時に引っかかったYoutuberをObjectとして返すゲッター
  // searchAllLiveVideo: state => {
  //   let liveDetailObj = state.liveDetail;
  //   let returnObject = {};
  //   if (state.search.length > 2) {
  //     Object.keys(liveDetailObj).forEach(key => {
  //       if (
  //         liveDetailObj[key].snippet.title
  //           .toLowerCase()
  //           .includes(state.search.toLowerCase()) ||
  //         liveDetailObj[key].snippet.description
  //           .toLowerCase()
  //           .includes(state.search.toLowerCase())
  //       ) {
  //         returnObject[key] = liveDetailObj[key];
  //       }
  //     });
  //   }
  //   return returnObject;
  // },
  // searchAllLiveWaitVideo: state => {
  //   let liveWaitDetailObj = state.liveWaitDetail;
  //   let returnObject = {};
  //   if (state.search.length > 2) {
  //     Object.keys(liveWaitDetailObj).forEach(key => {
  //       if (
  //         liveWaitDetailObj[key].snippet.title
  //           .toLowerCase()
  //           .includes(state.search.toLowerCase()) ||
  //         liveWaitDetailObj[key].snippet.description
  //           .toLowerCase()
  //           .includes(state.search.toLowerCase())
  //       ) {
  //         returnObject[key] = liveWaitDetailObj[key];
  //       }
  //     });
  //   }
  //   return returnObject;
  // },
  // Searchに言語があった時に引っかかったYoutuberをObjectとして返すゲッター
  // searchAllYoutubers: state => {
  //   let YoutuberInfo = state.YoutubersChannel_info;
  //   let returnObject = {};
  //   if (state.search.length > 2) {
  //     Object.keys(YoutuberInfo).forEach(key => {
  //       if (
  //         YoutuberInfo[key].name
  //           .toLowerCase()
  //           .includes(state.search.toLowerCase()) ||
  //         YoutuberInfo[key].description
  //           .toLowerCase()
  //           .includes(state.search.toLowerCase())
  //       ) {
  //         returnObject[key] = YoutuberInfo[key];
  //       }
  //     });
  //   }
  //   return returnObject;
  // }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

//AIzaSyCq8Phm_Ubutphp8iDORhH3lsY0yqh4tjw
//AIzaSyAUeFOmgX4D3VsQas9vYeQTQ7aK4A2mn2U
// AIzaSyB0UUv4LxvfoYy_Zm9aJxGNwk4GDxRWAx0
// AIzaSyA74rCZTKrL9ftAbYDss8ATaW1jVpKv0pk
// AIzaSyDolYHZvTZn-ludEQbnP2k1kVjGXwoyzUA
// AIzaSyDynJmKzSMkaRNTsAWnzIBQWbpOcBw3H_k
