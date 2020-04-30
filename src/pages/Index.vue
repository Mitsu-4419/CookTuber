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
      <registerReviewModal :registerURL="registerURL" />
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      registerURL: "",
      alertToSignUp: false,
      reviewSubmit: true
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn"])
  },
  methods: {
    showReviewMakeModal() {
      if (!this.loggedIn) {
        // ログインしていなかったらユーザー登録する様にDialogをだす
        this.alertToSignUp = true;
      } else if (this.loggedIn && this.$refs.VTRurl.validate()) {
        this.reviewSubmit = true;
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
