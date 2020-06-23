<template>
  <div>
    <!-- ------- -->
    <!-- TopPage -->
    <!-- ------- -->
    <q-card class="my-ReviewrCard" v-if="usersInfo">
      <router-link
        :to="{ name: 'mypage', query: { id: usersInfo.id } }"
        class="myCardWrapper"
      >
        <q-img
          v-if="rankInfo == 1"
          class="reviewerrankIcon"
          src="statics/rankIcon/crown_gold.png"
        ></q-img>
        <q-img
          v-else-if="rankInfo == 2"
          class="reviewerrankIcon"
          src="statics/rankIcon/crown_silver.png"
        ></q-img>
        <q-img
          v-else-if="rankInfo == 3"
          class="reviewerrankIcon"
          src="statics/rankIcon/crown_copper.png"
        ></q-img>
        <div class="ReviewrIconWrapper">
          <q-avatar class="reviewerIconImage">
            <img :src="usersInfo.photoURL" alt />
          </q-avatar>
        </div>
        <div class="row">
          <q-btn rounded class="channelName" no-caps>
            {{ usersInfo.nickName }}
          </q-btn>
        </div>
        <q-card-section class="card_description">
          <!-- <div>登録日:{{ channelInfo.register_date }}</div> -->
          <div>
            レビュー投稿数:
            <span class="channelRegiNum">
              {{ usersInfo.reviewNum }}
            </span>
          </div>
          <div class="YoutuberReviewNumWrapper">
            参考になった数:
            <span class="channelRegiNum">
              {{ usersInfo.LikeNumber }}
            </span>
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
  props: ["usersInfo", "id"],
  data() {
    return {
      rankInfo: Number(this.id) + 1
    };
  },
  methods: {
    setYoutuberKey(value) {
      SessionStorage.set("YoutuberKey", value);
    }
  }
};
</script>

<style>
.reviewerrankIcon {
  width: 45px;
  height: 45px;
  margin-left: -100px;
  margin-top: -45px;
  z-index: 10;
  position: absolute;
}
.my-ReviewrCard {
  width: 195px;
  height: 238px;
  margin-right: 10px;
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
.my-ReviewrCard:hover {
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
.ReviewrIconWrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 184px;
  padding: 10px;
}
.channelName {
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

.YoutuberReviewNumWrapper {
  margin-top: 4px;
}
/* Card内の星のところ */
.YoutuberStarWrapper {
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
.reviewerIconImage {
  width: 140px;
  height: 140px;
}
@media screen and (min-width: 414px) and (max-width: 499px) {
  .my-ReviewrCard {
    height: 230px;
    width: 168px;
    margin-right: 0px;
    margin-left: 8px;
  }
  .reviewerrankIcon {
    width: 30px;
    height: 30px;
    margin-left: -90px;
    margin-top: -8px;
    z-index: 10;
    position: absolute;
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
}
@media screen and (min-width: 300px) and (max-width: 413px) {
  .my-ReviewrCard {
    height: 210px;
    width: 164px;
    margin-right: 0px;
    margin-left: 4px;
  }
  .reviewerrankIcon {
    width: 30px;
    height: 30px;
    margin-left: -90px;
    margin-top: -8px;
    z-index: 10;
    position: absolute;
  }
  .reviewerIconImage {
    width: 120px;
    height: 120px;
  }
  .ReviewrIconWrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    height: 154px;
    padding: 10px;
  }
}
</style>
