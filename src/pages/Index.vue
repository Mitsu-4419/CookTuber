<template>
  <div>
    <q-page>
      <div class="topPageImageWrapper">
        <!-- <q-img class="topPageImage" src="statics/topPage/topPage_dishImg.jpg"></q-img> -->
        <div class="column registerWrapper">
          <q-input
            ref="VTRurl"
            bg-color="white"
            class="registerURLInput"
            rounded
            outlined
            v-model="registerURL"
            label="好きな料理Youtube動画のURLを貼ってください"
            :rules="[
              val =>
                val.includes('https://www.youtube.com/watch?v=') ||
                '登録できるのはYoutube動画のみです'
            ]"
          />
          <q-btn
            class="registerButton"
            label="登録"
            color="light-green-4"
            @click="showReviewMakeModal"
          ></q-btn>
        </div>
      </div>
      <div class="cookImageWrapper"></div>
    </q-page>

    <!-- ユーザー登録をする様に促すDialog -->
    <q-dialog v-model="alertToSignUp">
      <ToLoginAlert />
    </q-dialog>
    <!-- レビューをかく促すDialog -->
    <q-dialog v-model="reviewSubmit">
      <registerReviewModal :registerURL="registerURL" :snippet="Snippet" />
    </q-dialog>
    <!-- 同じ動画は投稿できませんModal -->
    <q-dialog v-model="doubleRegistAlert" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red" text-color="white" size="sm" />
          <span class="q-ml-sm">同じ動画は２回登録できません</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="black" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- 料理動画以外は投稿できません -->
    <q-dialog v-model="genreAlert" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red" text-color="white" size="sm" />
          <span class="q-ml-sm">料理動画以外は投稿できません</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="black" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      registerURL: "",
      alertToSignUp: false,
      reviewSubmit: false,
      doubleRegistAlert: false,
      genreAlert: false,
      Snippet: ""
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn", "userId"]),
    ...mapState("usersPublic", ["usersPublicInfo"])
  },
  methods: {
    async showReviewMakeModal() {
      if (!this.loggedIn) {
        // ログインしていなかったらユーザー登録する様にDialogをだす
        this.alertToSignUp = true;
      } else if (this.loggedIn && this.$refs.VTRurl.validate()) {
        // VideoId をURLから取り出す
        let splicedURL1 = this.registerURL.split("&")[0];
        let videoId = splicedURL1.split("v=")[1];
        // videoIdのsnippetを取ってきて、Categoryが明らかに違うものは弾くようにする。
        const res = await axios.get(
          "https://www.googleapis.com/youtube/v3/videos",
          {
            params: {
              key: "AIzaSyA7kq_sOzjdxusYJ_K3hm1d7HMAVYEGK_s",
              id: videoId,
              part: "snippet"
            }
          }
        );
        const snippet = res.data.items[0].snippet;
        console.log(snippet);
        this.Snippet = snippet;
        // ここで同じ動画を登録していないか動画をチェックする
        // 同じVideoを登録できないようにする処理
        let ObjectArray = Object.values(
          this.usersPublicInfo[this.userId].favoriteVTRObj
        );
        let videoArray = [];
        for (let i = 0; i < ObjectArray.length; i++) {
          videoArray.push(ObjectArray[i].videoId);
        }
        if (videoArray.includes(videoId)) {
          this.doubleRegistAlert = true;
        } else if (!(snippet.categoryId == 24 || snippet.categoryId == 26)) {
          this.genreAlert = true;
        } else {
          this.reviewSubmit = true;
        }
      }
    }
  },
  components: {
    ToLoginAlert: require("components/Card/ToLoginAlert.vue").default,
    registerReviewModal: require("components/modal/registerReviewModal.vue")
      .default
  }
};
</script>

<style>
.topPageImageWrapper {
  width: 100%;
  height: 480px;
  background: red;
  background-image: url("../statics/topPage/topPage_dishImg.jpg");
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
}
.topPageImage {
  width: 95%;
  max-width: 681.18px;
}
.registerWrapper {
  width: 360px;
  margin-top: 170px;
}
.registerButton {
  margin-top: 10px;
  width: 150px;
  margin-right: auto;
  margin-left: auto;
}
</style>
