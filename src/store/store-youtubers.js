import * as firebase from "firebase/app";
import { firestoreDb, firebaseDb } from "src/boot/firebase";
import Vue from "vue";
import axios from "axios";

const state = {
  YoutubersChannel_info: {},
  search: ""
};
const mutations = {
  setYoutuber_Info(state, payload) {
    Vue.set(state.YoutubersChannel_info, payload.id, payload);
  },
  setSearch(state, value) {
    state.search = value;
  },
  addYoutuberInfoMutate(state, payload) {
    Vue.set(state.YoutubersChannel_info, payload.channelId, payload);
  },
  updateYoutuberInfoMutate(state, payload) {
    let reviewCount = Number(
      state.YoutubersChannel_info[payload.channelId]["reviewCount"]
    );
    let starPoints = Number(
      state.YoutubersChannel_info[payload.channelId]["starPoint"]
    );
    let newStarNumber = starPoints + Number(payload.star_number);
    Vue.set(
      state.YoutubersChannel_info[payload.channelId],
      "reviewCount",
      reviewCount++
    );
    Vue.set(
      state.YoutubersChannel_info[payload.channelId],
      "starPoint",
      newStarNumber
    );
  }
};

const actions = {
  async getYoutubers_info({ commit }) {
    const snap = await firestoreDb.collection("YouTubers_basic_info").get();
    snap.forEach(async data => {
      let payload = {
        id: data.id,
        description: data.data().description,
        iconUrl: data.data().iconUrl,
        name: data.data().name,
        register_date: data.data().register_date,
        subscriberCounts: data.data().subscriberCounts,
        reviewCount: data.data().reviewCount,
        starPoint: data.data().starPoint
      };
      commit("setYoutuber_Info", payload);
    });
  },
  async addYoutuberInfo({ commit, state }, payload) {
    // チャンネルが登録されていない場合は新しくチャンネルを登録する
    if (
      !Object.keys(state.YoutubersChannel_info).includes(
        payload.snippet.channelId
      )
    ) {
      let Data = await axios.get(
        "https://www.googleapis.com/youtube/v3/channels",
        {
          params: {
            key: "AIzaSyA7kq_sOzjdxusYJ_K3hm1d7HMAVYEGK_s",
            id: payload.snippet.channelId,
            part: "statistics, snippet"
          }
        }
      );
      const url = Data.data.items[0].snippet.thumbnails.default.url;
      const name = Data.data.items[0].snippet.title;
      const description = Data.data.items[0].snippet.description;
      const subscriberCount = Data.data.items[0].statistics.subscriberCount;
      const register_date = Data.data.items[0].snippet.publishedAt.split(
        "T"
      )[0];
      let info = {};
      info[payload.snippet.channelId] = {
        channelId: payload.snippet.channelId,
        name: name,
        description: description,
        iconUrl: url,
        subscriberCounts: subscriberCount,
        register_date: register_date,
        reviewCount: 1,
        starPoint: payload.star_number
      };
      commit("addYoutuberInfoMutate", info);
      firestoreDb
        .collection("YouTubers_basic_info")
        .doc(payload.snippet.channelId)
        .set({
          channelId: payload.snippet.channelId,
          name: name,
          description: description,
          iconUrl: url,
          subscriberCounts: subscriberCount,
          register_date: register_date,
          reviewCount: 1,
          starPoint: payload.star_number
        });
    } else {
      commit("updateYoutuberInfoMutate", payload);
      firestoreDb
        .collection("YouTubers_basic_info")
        .doc(payload.snippet.channelId)
        .update({
          reviewCount: firestorebase.FieldValue.increment(1),
          starPoint: firestorebase.FieldValue.increment(
            Number(payload.star_number)
          )
        });
    }
  }
};

const getters = {
  setAverageStar: state => {
    let youtubers = state.YoutubersChannel_info;
    Object.keys(youtubers).forEach(key => {
      let averageStar =
        Number(youtubers[key].starPoint) / Number(youtubers[key].reviewCount);
      youtubers[key]["averageStar"] = averageStar;
    });
    return youtubers;
  },
  getSortedYoutubers: (state, getters) => model => {
    const array = Object.values(getters.setAverageStar);
    if (model == "高評価が多い順") {
      array.sort(function(e, f) {
        if (Number(e.averageStar) < Number(f.averageStar)) return 1;
        if (Number(e.averageStar) > Number(f.averageStar)) return -1;
        return 0;
      });
    } else if (model == "登録者数が多い順") {
      array.sort(function(a, b) {
        if (Number(a.subscriberCounts) < Number(b.subscriberCounts)) return 1;
        if (Number(a.subscriberCounts) > Number(b.subscriberCounts)) return -1;
        return 0;
      });
    } else if (model == "登録者数が少ない順") {
      array.sort(function(a, b) {
        if (Number(a.subscriberCounts) > Number(b.subscriberCounts)) return 1;
        if (Number(a.subscriberCounts) < Number(b.subscriberCounts)) return -1;
        return 0;
      });
    } else if (model == "レビュー数が多い順") {
      array.sort(function(a, b) {
        if (Number(a.reviewCount) < Number(b.reviewCount)) return 1;
        if (Number(a.reviewCount) > Number(b.reviewCount)) return -1;
        return 0;
      });
    }
    let sortedYoutubers = {};
    for (let i = 0; i < array.length; i++) {
      sortedYoutubers[array[i].id] = array[i];
    }
    return sortedYoutubers;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
