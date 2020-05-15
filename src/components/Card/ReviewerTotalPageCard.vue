<template>
  <div>
    <!-- ------- -->
    <!-- TopPage -->
    <!-- ------- -->
    <q-card class="my-ReviewrCard" v-if="usersInfo">
      <router-link :to="{ name: 'mypage', query: { id: uid } }" class="myCardWrapper">
        <!-- <q-img v-if="rankInfo.rank == 1" class="rankIcon" src="statics/rankIcon/crown_gold.png"></q-img>
        <q-img
          v-else-if="rankInfo.rank == 2"
          class="rankIcon"
          src="statics/rankIcon/crown_silver.png"
        ></q-img>
        <q-img
          v-else-if="rankInfo.rank == 3"
          class="rankIcon"
          src="statics/rankIcon/crown_copper.png"
        ></q-img>-->
        <div class="ReviewrIconWrapper">
          <q-avatar size="140px">
            <img :src="usersInfo.photoURL" alt />
          </q-avatar>
        </div>
        <div class="row">
          <q-btn rounded class="channelName" no-caps>
            {{
            usersInfo.nickName
            }}
          </q-btn>
        </div>
        <q-card-section class="card_description">
          <!-- <div>登録日:{{ channelInfo.register_date }}</div> -->
          <div>
            レビュー投稿数:
            <span class="channelRegiNum">
              {{
              usersInfo.reviewNum
              }}
            </span>
          </div>
          <div class="YoutuberReviewNumWrapper">
            参考になった数:
            <span class="channelRegiNum">
              {{
              usersInfo.LikeNumber
              }}
            </span>
          </div>
          <!-- <div class="YoutuberStarWrapper">
            <star-rating
              :read-only="true"
              v-model="starYoutuberGot"
              :star-size="20"
              :increment="0.1"
              :padding="4"
              active-color="yellow"
              text-class="custom-Text"
            ></star-rating>
          </div>-->
        </q-card-section>
        <!-- <div class="row">
          <div class="row favoriteCountWrapper" @click.prevent="switchFav()">
            <q-icon
              v-model="ratingModel"
              name="fas fa-star"
              size="1.8em"
              :class="ratingModel == 1 ? 'starActive' : 'starNonActive'"
        />-->
        <!-- <span class="favoriteNumber">{{ rankInfo.count }}</span> -->
        <!-- </div> -->
        <!-- </div> -->
      </router-link>
    </q-card>
  </div>
</template>

<script>
import { SessionStorage } from "quasar";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: ["usersInfo", "uid"],
  data() {
    return {};
  },
  computed: {},
  methods: {
    setYoutuberKey(value) {
      SessionStorage.set("YoutuberKey", value);
    }
    // switchFav() {
    //   if (this.loggedIn == false) {
    //     // ログインしていなかったらユーザー登録する様にDialogをだす
    //     this.alertToSignUp = true;
    //   } else if (this.loggedIn == true && this.ratingModel == 0) {
    //     this.writeReview = true;
    //   } else if (this.loggedIn == true && this.ratingModel == 1) {
    //     console.log("nothing");
    //   }
    // },
    // ユーザーがお気に入り登録しているかどうかの判断
    // ユーザーがログインしていなかったら全てratingModelを１にする
    // checkIfFavorite() {
    //   if (this.loggedIn == false) {
    //     this.ratingModel = 1;
    //   } else if (this.loggedIn == true) {
    //     let object = Object.values(this.userInfo)[0].favoriteYoutuberObj;
    //     let array = [];
    //     for (let j = 0; j < Object.values(object).length; j++) {
    //       array.push(Object.values(object)[j].channelId);
    //     }
    //     if (array.includes(this.id)) {
    //       this.ratingModel = 1;
    //     } else {
    //       this.ratingModel = 0;
    //     }
    //   } else {
    //     console.log("何らかのエラーが発生しています。");
    //   }
    // },
    // そのYoutuberに対してログインユーザーが書き込んだレビューを取ってくる
    // checkWritedReview() {
    //   let getReview = this.getYoutuberReview(this.channelInfo.id);
    //   let userReview;
    //   if (this.loggedIn) {
    //     Object.keys(getReview).forEach(key => {
    //       if (getReview[key].uid == Object.values(this.userInfo)[0].id) {
    //         userReview = getReview[key].review;
    //         // DocumentId をStateに入れる
    //         this.documentId = key;
    //       }
    //     });
    //     this.writedReview = userReview;
    //     // this.ratingModel = 0;
    //   }
    // },
    // closeReviewSubmi() {
    //   (this.writeReview = false), (this.ratingModel = 0);
    // },
    // addstar() {
    //   this.ratingModal = 1;
    // }
  },
  components: {},
  mounted() {
    // if (this.loggedIn) {
    //   this.userId = Object.values(this.userInfo)[0].id;
    // }
  },
  created() {
    // this.starModel = this.chkFavoriteTubers();
    // this.checkWritedReview();
    // this.checkIfFavorite();
    // this.starYoutuberGot = Number(
    //   this.channelInfo.starPoint / this.channelInfo.reviewCount
    // );
  }
};
</script>

<style>
.my-ReviewrCard {
  width: 185px;
  height: 238px;
  margin-right: 15px;
  margin-bottom: 15px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.25);
  text-align: center;
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
@media screen and (min-width: 360px) and (max-width: 499px) {
  .my-cardYoutuber {
    height: 270px;
    width: 168px;
    margin-right: 0px;
    margin-left: 8px;
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
</style>
