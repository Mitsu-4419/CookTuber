<template>
  <div>
    <!-- ------- -->
    <!-- TopPage -->
    <!-- ------- -->
    <q-card class="my-cardYoutuber" v-if="channelInfo">
      <router-link
        :to="{ name: 'show', query: { key: channelInfo.id, from: from } }"
        class="myCardWrapper"
      >
        <q-img v-if="rankInfo == 1" class="YoutuberrankIcon" src="statics/rankIcon/crown_gold.png"></q-img>
        <q-img
          v-else-if="rankInfo == 2"
          class="YoutuberrankIcon"
          src="statics/rankIcon/crown_silver.png"
        ></q-img>
        <q-img
          v-else-if="rankInfo == 3"
          class="YoutuberrankIcon"
          src="statics/rankIcon/crown_copper.png"
        ></q-img>
        <div class="iconWrapper">
          <q-avatar class="YoutuberIconImage">
            <img :src="channelInfo.iconUrl" alt />
          </q-avatar>
        </div>
        <div class="row">
          <q-btn rounded class="channelNameYoutuberCard" no-caps>{{ channelInfo.name }}</q-btn>
        </div>
        <q-card-section class="card_description">
          <div>
            チャンネル登録者数:
            <span class="channelRegiNum">{{ channelInfo.subscriberCounts }}</span>
          </div>
          <div class="YoutuberReviewNumWrapper">
            Review投稿数:
            <span class="channelRegiNum">{{ channelInfo.reviewCount }}</span>
          </div>
          <div class="YoutuberStarWrapperLarge">
            <star-rating
              :read-only="true"
              :rating=" Number(this.channelInfo.starPoint) /
        Number(this.channelInfo.reviewCount)"
              :star-size="20"
              :increment="0.1"
              :padding="4"
              active-color="#ffd400"
              text-class="custom-Text"
            ></star-rating>
          </div>
          <div class="YoutuberStarWrapperSmall">
            <star-rating
              :read-only="true"
              :rating=" Number(this.channelInfo.starPoint) /
        Number(this.channelInfo.reviewCount)"
              :star-size="15"
              :increment="0.1"
              :padding="3"
              active-color="#ffd400"
              text-class="custom-TextSmall"
            ></star-rating>
          </div>
        </q-card-section>
      </router-link>
    </q-card>
  </div>
</template>

<script>
import { SessionStorage } from "quasar";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: ["channelInfo", "id", "from"],
  data() {
    return {
      rankInfo: Number(this.id) + 1
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn"])
  },
  methods: {
    setYoutuberKey(value) {
      SessionStorage.set("YoutuberKey", value);
    },
    switchFav() {
      if (this.loggedIn == false) {
        // ログインしていなかったらユーザー登録する様にDialogをだす
        this.alertToSignUp = true;
      } else if (this.loggedIn == true && this.ratingModel == 0) {
        this.writeReview = true;
      } else if (this.loggedIn == true && this.ratingModel == 1) {
        console.log("nothing");
      }
    },
    closeReviewSubmi() {
      (this.writeReview = false), (this.ratingModel = 0);
    },
    addstar() {
      this.ratingModal = 1;
    }
  },
  components: {
    ToLoginAlert: require("components/AlertModal/ToLoginAlert.vue").default
  }
};
</script>

<style>
.YoutuberrankIcon {
  width: 45px;
  height: 45px;
  margin-left: -100px;
  margin-top: -45px;
  z-index: 10;
  position: absolute;
}
.my-cardYoutuber {
  width: 195px;
  height: 290px;
  margin-right: 15px;
  margin-bottom: 15px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.25);
  text-align: center;
  position: relative;
}
.my-card:hover {
  -webkit-transform: translateY(-5px);
  -ms-transform: translateY(-5px);
  transform: translateY(-5px);
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.25);
}
.myCardWrapper {
  text-decoration: none;
  color: black;
}
/* アイコンを表示するところ */
.iconWrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 200px;
  padding: 10px;
}
.channelNameYoutuberCard {
  font-size: 11px;
  margin: -25px auto 0 auto;
  width: 178px;
  height: 25px;
  background-color: white;
  z-index: 1;
  overflow: hidden;
  border: 0.5px solid black;
}
.card_description {
  font-size: 13px;
  color: black;
  padding-top: 5px;
  padding-bottom: 7px;
  padding-left: 7px;
  padding-right: 7px;
}
.channelRegiNum {
  font-weight: bold;
}
.favoriteNumber {
  margin-top: 5px;
  margin-left: 10px;
  font-weight: bold;
  font-family: "Russo One", sans-serif;
}
.badgeCSS {
  font-weight: bold;
  margin-right: 10px;
  margin-top: 3px;
}
.favoriteCountWrapper {
  /* background: red; */
  z-index: 10;
}
.YoutuberIconImage {
  width: 160px;
  height: 160px;
}
.YoutuberReviewNumWrapper {
  margin-top: 4px;
}
/* Card内の星のところ */
.YoutuberStarWrapperLarge {
  margin-top: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.custom-Text {
  color: black;
  font-size: 15px;
  margin-bottom: 9px;
}
@media screen and (min-width: 500px) {
  .YoutuberStarWrapperSmall {
    display: none;
  }
}
@media screen and (min-width: 300px) and (max-width: 499px) {
  .my-cardYoutuber {
    height: 270px;
    width: 168px;
    margin-right: 0px;
    margin-left: 8px;
  }
  .YoutuberStarWrapperLarge {
    display: none;
  }
  .custom-TextSmall {
    color: black;
    font-size: 13px;
    margin-bottom: 9px;
  }
  .YoutuberStarWrapperSmall {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .channelName {
    font-size: 9px;
    margin: -25px auto 0 auto;
    width: 178px;
    height: 25px;
    background-color: white;
    z-index: 1;
    overflow: hidden;
    border: 0.5px solid black;
  }
  .card_description {
    font-size: 11px;
    color: black;
    padding-top: 5px;
    padding-left: 7px;
    padding-right: 7px;
  }
  .card_description {
    height: 50px;
  }
  .YoutuberrankIcon {
    width: 30px;
    height: 30px;
    margin-left: -80px;
    margin-top: -6px;
    z-index: 10;
    position: absolute;
  }
  .channelNameYoutuberCard {
    font-size: 10px;
    margin: -25px auto 0 auto;
    width: 178px;
    height: 27px;
    background-color: white;
    z-index: 1;
    overflow: hidden;
    border: 0.5px solid black;
  }
}
@media screen and (min-width: 300px) and (max-width: 413px) {
  .my-cardYoutuber {
    height: 270px;
    width: 164px;
    margin-right: 0px;
    margin-left: 4px;
  }
  .YoutuberIconImage {
    width: 120px;
    height: 120px;
  }
  .iconWrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    height: 160px;
    padding: 10px;
  }
  .channelNameYoutuberCard {
    font-size: 10px;
    margin: -25px auto 0 auto;
    width: 178px;
    height: 27px;
    background-color: white;
    z-index: 1;
    overflow: hidden;
    border: 0.5px solid black;
  }
}
</style>
