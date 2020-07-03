<template>
  <div>
    <q-item class="reviewList">
      <q-item-section top avatar>
        <q-avatar rounded>
          <img :src="review.photoURL" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="listNickName">{{ review.nickName }}</q-item-label>
        <q-item-label class="listReview">{{ review.review }}</q-item-label>
        <q-item-label class="row reviewLikeWrapper">
          <star-rating
            :read-only="true"
            v-model="starUserReview"
            :star-size="20"
            :increment="0.1"
            :padding="2"
            active-color="#ffd400"
            text-class="custom-Text"
          ></star-rating>
          <div class="likeButton">
            <q-icon
              name="fas fa-thumbs-up"
              size="1.5em"
              :class="userLike == true ? 'likeActive' : 'likeNonActive'"
              @click.prevent="addDecreaseLike()"
            ></q-icon>
          </div>
          <section class="likeNumber">{{ LikeNumbers }}</section>
        </q-item-label>
      </q-item-section>
    </q-item>
    <!-- ユーザー登録をする様に促すDialog -->
    <q-dialog v-model="alertToSignUp">
      <ToLoginAlert />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["id", "review"],
  data() {
    return {
      routerUserId: "",
      userLike: false,
      alertToSignUp: false,
      LikeNumbers: "",
      starUserReview: 0
    };
  },
  computed: {
    ...mapState("auth", ["userId", "loggedIn"])
  },
  methods: {
    ...mapActions("usersPublic", ["increaseLike", "decreaseLike"]),
    checkIfUserLikeOrNot() {
      let loginUid = this.userId;
      if (this.review.LikeArray && this.review.LikeArray.includes(loginUid)) {
        this.userLike = true;
      } else {
        this.userLike = false;
      }
    },
    // いいねの数の増減をする
    addDecreaseLike() {
      // ここのUidはレビューを書いた人のId
      if (this.loggedIn == false) {
        this.alertToSignUp = true;
      } else if (this.loggedIn == true && this.userLike == true) {
        let payload = {
          docId: this.review.docId,
          reviewerUID: this.review.uid,
          loginUID: this.userId
        };
        this.userLike = false;
        this.LikeNumbers--;
        this.decreaseLike(payload);
      } else if (this.loggedIn == true && this.userLike == false) {
        let payload = {
          docId: this.review.docId,
          reviewerUID: this.review.uid,
          loginUID: this.userId
        };
        this.userLike = true;
        this.LikeNumbers++;
        this.increaseLike(payload);
      }
    }
  },
  created() {
    if (this.review.LikeArray) {
      this.LikeNumbers = this.review.LikeArray.length;
    }
    this.routerUserId = this.review.uid;
    this.starUserReview = this.review.star_number;
    this.checkIfUserLikeOrNot();
  },
  components: {
    ToLoginAlert: require("components/AlertModal/ToLoginAlert.vue").default
  }
};
</script>

<style lang='scss' >
.reviewList {
  margin: 10px 5px;
  // background: red;
  width: 90%; /* border: 1px solid black; */
  background: rgb(250, 250, 250);
  .listNickName {
    font-size: 11px;
  }
  .listReview {
    font-size: 14px;
  }
  .likeButton {
    margin-left: 18px;
    margin-top: 5px;
  }
  //   星の数字と合わせている
  .likeNumber {
    margin-left: 6px;
    margin-right: 10px;
    margin-top: 8px;
    font-size: 13px;
  }
  .reviewLikeWrapper {
    margin-top: 21px;
    .q-item__label + .q-item__label {
      margin-top: 15px;
    }
  }
}
//いいね
.likeActive {
  color: rgb(55, 114, 216);
}
.likeNonActive {
  color: rgb(210, 210, 210);
}
</style>