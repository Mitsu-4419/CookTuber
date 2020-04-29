<template>
  <div>
    <!-- ------- -->
    <!-- TopPage -->
    <!-- ------- -->
    <q-card v-if="Door == 'TopPage' && channelInfo" class="my-cardYoutuber">
      <router-link :to="{ name: 'show', query: { key: channelInfo.id } }" class="myCardWrapper">
        <q-img v-if="rankInfo.rank == 1" class="rankIcon" src="statics/rankIcon/crown_gold.png"></q-img>
        <q-img
          v-else-if="rankInfo.rank == 2"
          class="rankIcon"
          src="statics/rankIcon/crown_silver.png"
        ></q-img>
        <q-img
          v-else-if="rankInfo.rank == 3"
          class="rankIcon"
          src="statics/rankIcon/crown_copper.png"
        ></q-img>
        <div class="q-pa-xs">
          <q-img :src="channelInfo.iconUrl" />
        </div>
        <div class="row">
          <q-btn rounded class="channelName" no-caps>
            {{
            channelInfo.name
            }}
          </q-btn>
        </div>
        <q-card-section class="card_description">
          <div>登録日:{{ channelInfo.register_date }}</div>
          <div>
            チャンネル登録者数:
            <span class="channelRegiNum">
              {{
              channelInfo.subscriberCounts
              }}
            </span>
          </div>
        </q-card-section>
        <div class="row">
          <div class="row favoriteCountWrapper" @click.prevent="switchFav()">
            <q-icon
              v-model="ratingModel"
              name="fas fa-star"
              size="1.8em"
              :class="ratingModel == 1 ? 'starActive' : 'starNonActive'"
            />
            <span class="favoriteNumber">{{ rankInfo.count }}</span>
          </div>
        </div>
      </router-link>
    </q-card>
    <!-- --- -->
    <!-- ALL -->
    <!-- --- -->
    <q-card v-if="Door == 'All'" class="my-cardYoutuber">
      <router-link :to="'/show?key=' + channelInfo.id" class="myCardWrapper">
        <div class="q-pa-xs">
          <q-img :src="channelInfo.iconUrl" />
        </div>
        <div class="row">
          <q-btn rounded class="channelName" no-caps>
            {{
            channelInfo.name
            }}
          </q-btn>
        </div>
        <q-card-section class="card_description">
          <div>登録日:{{ channelInfo.register_date }}</div>
          <div>
            チャンネル登録者数:
            <span class="channelRegiNum">
              {{
              channelInfo.subscriberCounts
              }}
            </span>
          </div>
        </q-card-section>
        <div class="row">
          <div class="row favoriteCountWrapper" @click.prevent="switchFav()">
            <div v-if="userOrNot">
              <q-icon v-model="ratingModel" name="fas fa-star" size="1.8em" class="starActive" />
              <span class="favoriteNumber">{{ getNumberArray[id] }}</span>
            </div>
            <div v-else-if="!userOrNot">
              <q-icon
                v-model="ratingModel"
                name="fas fa-star"
                size="1.8em"
                :class="ratingModel == 1 ? 'starActive' : 'starNonActive'"
              />
              <span class="favoriteNumber">{{ getNumberArray[id] }}</span>
            </div>
          </div>
        </div>
      </router-link>
    </q-card>
    <!-- ユーザー登録をする様に促すDialog -->
    <q-dialog v-model="alertToSignUp">
      <ToLoginAlert />
    </q-dialog>
    <!-- レビュー投稿モーダル -->
    <q-dialog v-model="writeReview">
      <reviewSubmit
        @closeReviewSubmit="closeReviewSubmi"
        @addstar="addstar"
        :channelInfo="channelInfo"
      />
    </q-dialog>
  </div>
</template>

<script>
import { SessionStorage } from "quasar";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: ["channelInfo", "id", "Door", "rankInfo", "userOrNot"],
  data() {
    return {
      userId: "",
      alertToSignUp: false,
      writeReview: false,
      ratingModel: 0,
      ratingColors: ["yellow-12"],
      writedReview: "",
      documentId: ""
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn", "userInfo"]),
    ...mapGetters("usersPublic", ["getNumberArray", "getYoutuberReview"])
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
    // ユーザーがお気に入り登録しているかどうかの判断
    // ユーザーがログインしていなかったら全てratingModelを１にする
    checkIfFavorite() {
      if (this.loggedIn == false) {
        this.ratingModel = 1;
      } else if (this.loggedIn == true) {
        let object = Object.values(this.userInfo)[0].favoriteYoutuberObj;
        let array = [];
        for (let j = 0; j < Object.values(object).length; j++) {
          array.push(Object.values(object)[j].channelId);
        }
        if (array.includes(this.id)) {
          this.ratingModel = 1;
        } else {
          this.ratingModel = 0;
        }
      } else {
        console.log("何らかのエラーが発生しています。");
      }
    },
    // そのYoutuberに対してログインユーザーが書き込んだレビューを取ってくる
    checkWritedReview() {
      let getReview = this.getYoutuberReview(this.channelInfo.id);
      let userReview;
      if (this.loggedIn) {
        Object.keys(getReview).forEach(key => {
          if (getReview[key].uid == Object.values(this.userInfo)[0].id) {
            userReview = getReview[key].review;
            // DocumentId をStateに入れる
            this.documentId = key;
          }
        });
        this.writedReview = userReview;
        // this.ratingModel = 0;
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
    ToLoginAlert: require("components/Card/ToLoginAlert.vue").default,
    reviewSubmit: require("components/ReviewCard/reviewSubmit.vue").default
  },
  mounted() {
    if (this.loggedIn) {
      this.userId = Object.values(this.userInfo)[0].id;
    }
  },
  created() {
    // this.starModel = this.chkFavoriteTubers();
    this.checkWritedReview();
    this.checkIfFavorite();
  }
};
</script>

<style>
.my-cardYoutuber {
  width: 205px;
  height: 300px;
  margin-right: 15px;
  margin-bottom: 15px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.25);
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
/* Card内の星のところ */
.starActive {
  color: yellow;
  margin-left: 10px;
}
.starNonActive {
  color: rgb(254, 254, 191);
  margin-left: 10px;
}
.rankIcon {
  width: 40px;
  height: 40px;
  margin-left: 3px;
  margin-bottom: -30px;
  z-index: 10;
  position: absolute;
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
