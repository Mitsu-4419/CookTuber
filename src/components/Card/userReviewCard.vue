<template>
  <q-card class="reviewCard">
    <router-link :to="{ name: 'mypage', query: { id: routerUserId } }" class="routerDec">
      <q-card-section>
        <div class="row">
          <q-avatar size="32px">
            <q-img :src="review.photoURL"></q-img>
          </q-avatar>
          <section class="userNameDetail">{{ review.nickName }}</section>
        </div>
      </q-card-section>
      <div class="reviewDetail">{{ review.review }}</div>
      <q-card-section class="row">
        <star-rating
          :read-only="true"
          v-model="starUserReview"
          :star-size="21"
          :increment="0.1"
          :padding="1"
          active-color="yellow"
          text-class="custom-TextUserReview"
        ></star-rating>
        <q-space></q-space>
        <q-icon
          name="fas fa-heart"
          size="1.9em"
          :class="userLike == true ? 'likeActive' : 'likeNonActive'"
          @click.prevent="addDecreaseLike()"
        ></q-icon>
        <section class="likeNumberReviewCard">{{ LikeNumbers }}</section>
      </q-card-section>
    </router-link>
  </q-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["review", "id"],
  data() {
    return {
      routerUserId: "",
      userLike: "",
      LikeNumbers: "",
      starUserReview: 0
    };
  },
  methods: {
    ...mapActions("usersPublic", ["increaseLike", "decreaseLike"])
    // checkIfUserLikeOrNot() {
    //   let loginUid = Object.keys(this.userInfo)[0];
    //   if (this.review.LikeArray && this.review.LikeArray.includes(loginUid)) {
    //     this.userLike = true;
    //   } else {
    //     this.userLike = false;
    //   }
    // },
    // // いいねの数の増減をする
    // addDecreaseLike() {
    //   // ここのUidはレビューを書いた人のId
    //   if (this.userLike == true) {
    //     let payload = {
    //       docId: this.review.docId,
    //       reviewerUID: this.id,
    //       loginUID: Object.keys(this.userInfo)[0]
    //     };
    //     this.userLike = false;
    //     this.LikeNumbers--;

    //     this.decreaseLike(payload);
    //   } else if (this.userLike == false) {
    //     let payload = {
    //       docId: this.review.docId,
    //       reviewerUID: this.id,
    //       loginUID: Object.keys(this.userInfo)[0]
    //     };
    //     this.userLike = true;
    //     this.LikeNumbers++;
    //     this.increaseLike(payload);
    //   }
    // }
  },
  computed: {
    ...mapState("auth", ["userInfo"])
  },
  created() {
    // if (this.review.LikeArray) {
    //   this.LikeNumbers = this.review.LikeArray.length;
    // }
    // this.checkIfUserLikeOrNot();
    this.routerUserId = this.review.uid;
    this.starUserReview = this.review.star_number;
  }
};
</script>

<style>
.reviewCard {
  width: 424px;
  height: 224px;
  margin-right: auto;
  margin-bottom: 24px;
  margin-left: 24px;
}
.reviewCard {
  width: 320px;
  height: 224px;
  margin-right: auto;
  margin-bottom: 24px;
  margin-left: 12fpx;
}

.userNameDetail {
  font-size: 17px;
  margin-top: 5px;
  margin-left: 10px;
}
.routerDec {
  text-decoration: none;
  color: black;
}
.reviewDetail {
  padding-left: 12px;
  padding-right: 12px;
  font-size: 20px;
  overflow: scroll;
  height: 100px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.likeNumberReviewCard {
  margin-left: 10px;
  font-size: 13px;
  margin-top: 5px;
  font-weight: bold;
  font-family: "Russo One", sans-serif;
}
.custom-TextUserReview {
  margin-bottom: 6px;
}
.likeActive {
  color: red;
}
.likeNonActive {
  color: pink;
}
@media screen and (min-width: 1490px) {
  .reviewCard {
    width: 424px;
    height: 224px;
    margin-right: auto;
    margin-bottom: 24px;
    margin-left: 24px;
  }
}
@media screen and (min-width: 320px) and (max-width: 499px) {
  .reviewCard {
    width: 310px;
    height: 224px;
    margin-right: auto;
    margin-bottom: 12px;
    margin-left: auto;
  }
}
</style>
