import timeTags from "src/JSON/timeTag";
import genreTags from "src/JSON/genreTag";
import materialTags from "src/JSON/materialTag";
import menuTags from "src/JSON/menuTag";
import { arrayElementIncludeOrNot } from "src/functions/arrayElementIncludeOrNot";
const state = {
  timeTag: timeTags,
  genreTag: genreTags,
  menuTag: menuTags,
  materialTag: materialTags
};

const mutations = {};
const actions = {};

const getters = {
  // ======================================
  //  genreTagGetters
  // ======================================
  sortedTag: state => (meta, flag) => {
    let alltags = [];
    if (flag == "genre") {
      alltags = state.genreTag;
    } else if (flag == "menu") {
      alltags = state.menuTag;
    } else if (flag == "material") {
      alltags = state.materialTag;
    }
    return Object.values(alltags).filter(data => data.meta == meta);
  },
  sortByTagOfCookVideos: (state, getters, rootState, rootGetters) => (
    selectedTag,
    timeArray,
    model,
    flag
  ) => {
    let array = [];
    let videos = rootGetters["videos/CookVideoStarOrder"];
    if (selectedTag == "" && timeArray.length == 0) {
      array = videos;
    } else if (selectedTag != "" && timeArray.length == 0) {
      if (flag == "genre") {
        array = videos.filter(
          data =>
            data["genreTag"] != undefined && data.genreTag.includes(selectedTag)
        );
      } else if (flag == "menu") {
        array = videos.filter(
          data =>
            data["menuTag"] != undefined && data.menuTag.includes(selectedTag)
        );
      } else if (flag == "material") {
        array = videos.filter(
          data =>
            data["materialTag"] != undefined &&
            data.materialTag.includes(selectedTag)
        );
      }
    } else if (selectedTag == "" && timeArray.length > 0) {
      array = videos.filter(data =>
        arrayElementIncludeOrNot(timeArray, data.timeTag)
      );
    } else {
      if (flag == "genre") {
        array = videos.filter(data => {
          return (
            data["genreTag"] != undefined &&
            data.genreTag.includes(selectedTag) &&
            arrayElementIncludeOrNot(timeArray, data.timeTag)
          );
        });
      } else if (flag == "menu") {
        array = videos.filter(data => {
          return (
            data["menuTag"] != undefined &&
            data.menuTag.includes(selectedTag) &&
            arrayElementIncludeOrNot(timeArray, data.timeTag)
          );
        });
      } else if (flag == "material") {
        array = videos.filter(data => {
          return (
            data["materialTag"] != undefined &&
            data.materialTag.includes(selectedTag) &&
            arrayElementIncludeOrNot(timeArray, data.timeTag)
          );
        });
      }
    }
    if (model == "星の数順") {
      array.sort(function(a, b) {
        if (Number(a.AverageStar) < Number(b.AverageStar)) return 1;
        if (Number(a.AverageStar) > Number(b.AverageStar)) return -1;
        return 0;
      });
    } else if (model == "再生回数順") {
      array.sort(function(a, b) {
        if (Number(a.viewCount) < Number(b.viewCount)) return 1;
        if (Number(a.viewCount) > Number(b.viewCount)) return -1;
        return 0;
      });
    } else if (model == "レビュー数多い順") {
      array.sort(function(a, b) {
        if (Number(a.registerCount) < Number(b.registerCount)) return 1;
        if (Number(a.registerCount) > Number(b.registerCount)) return -1;
        return 0;
      });
    } else if (model == "投稿日が最近順") {
      array.sort(function(a, b) {
        if (Number(new Date(a.publishedAt)) < Number(new Date(b.publishedAt)))
          return 1;
        if (Number(new Date(a.publishedAt)) > Number(new Date(b.publishedAt)))
          return -1;
        return 0;
      });
    }
    if (array.length > 50) {
      return array.slice(0, 50);
    } else {
      return array;
    }
  },
  sortByTagOfCookVideosTop5: (state, getters) => (
    selectedTag,
    timeArray,
    model,
    flag
  ) => {
    let videoArray = getters.sortByTagOfCookVideos(
      selectedTag,
      timeArray,
      model,
      flag
    );
    if (videoArray.length > 5) {
      return videoArray.slice(0, 5);
    } else {
      return videoArray;
    }
  },
  sortByMeatTop5: (state, getters) => (selectedMeat, model) => {
    console.log(selectedMeat);
    let videoArray = getters.sortByTagOfCookVideos(
      "g6",
      ["time1", "time2", "time3"],
      model,
      "genre"
    );
    if (selectedMeat.length == 0) {
      return videoArray.slice(0, 5);
    } else {
      console.log("hages");
      const returnArray = videoArray.filter(
        data =>
          data["materialTag"] != undefined &&
          data.materialTag.includes(selectedMeat)
      );
      console.log(returnArray);
      if (returnArray.length > 5) {
        return returnArray.slice(0, 5);
      } else {
        return returnArray;
      }
    }
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
