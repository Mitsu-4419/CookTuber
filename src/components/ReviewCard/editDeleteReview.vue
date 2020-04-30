<template>
  <q-card class="q-pa-md">
    <q-card-section class="row">
      <q-icon name="edit" size="md"></q-icon>
      <div class="text-h6 q-ml-sm">投稿したレビューを更新</div>
    </q-card-section>
    <div class="q-pa-md" style="min-width:400px;">
      <q-input
        v-model="WritedReview"
        outlined
        type="textarea"
        :rules="[
          val => !!val || '* 紹介文を入力してください',
          val => val.length > 0 || '紹介文を入力してください',
        ]"
      />
    </div>
    <q-card-section class>投稿したレビューを削除した場合、復元することは出来ません。</q-card-section>
    <q-card-actions align="right" class="q-mt-md">
      <q-btn label="更新する" color="blue" @click.prevent="rewriteReview(channelInfo.id)" />
      <q-btn label="削除する" color="red" @click.prevent="deleteReview(channelInfo.id)" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: ["writedReview", "channelInfo", "documentId"],
  data() {
    return {
      WritedReview: this.writedReview,
      AuthDocId: ""
    };
  },
  computed: {
    ...mapState("auth", ["userInfo"]),
    ...mapState("usersPublic", ["usersPublicInfo"])
  },
  methods: {
    ...mapActions("auth", ["delFavoriteTuber", "rewriteReviewAction"]),
    ...mapActions("usersPublic", ["changeReviewInfo", "delReviewInfo"]),
    getAuthDocId() {
      console.log(this.usersPublicInfo);
      let myFavoriteArray = Object.values(this.userInfo)[0].favoriteYoutuberObj;
      let returnKey;
      for (let key in myFavoriteArray) {
        if (myFavoriteArray[key].channelId === this.channelInfo.id) {
          returnKey = key;
        }
      }
      return returnKey;
    },
    rewriteReview(value) {
      //stateを通してフロントでユーザーにはレビュー編集削除が行われているように見せる
      this.rewriteReviewAction({
        uid: Object.keys(this.userInfo)[0],
        review: this.WritedReview,
        docId: this.AuthDocId,
        favoriteTubers: value
      });
      //DBの更新
      this.changeReviewInfo({
        uid: Object.keys(this.userInfo)[0],
        review: this.WritedReview,
        docId: this.documentId,
        favoriteTubers: value
      });
      this.$emit("closeModal", this.WritedReview);
    },
    deleteReview(value) {
      //stateを通してフロントでユーザーにはレビュー編集削除が行われているように見せる
      this.delFavoriteTuber({
        uid: Object.keys(this.userInfo)[0],
        favoriteTubers: value,
        docId: this.AuthDocId
      });
      //DBの更新
      this.delReviewInfo({
        uid: Object.keys(this.userInfo)[0],
        favoriteTubers: value,
        docId: this.documentId
      });
      this.$emit("deleteModal", Object.keys(this.userInfo)[0]);
    }
  },
  created() {
    this.AuthDocId = this.getAuthDocId();
  }
};
</script>

<style>
</style>