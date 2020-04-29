<template>
  <q-card class="q-pa-md">
    <q-card-section class="row">
      <q-icon name="edit" size="md"></q-icon>
      <div class="text-h6 q-ml-sm">みんなに紹介しよう！</div>
    </q-card-section>
    <div class="q-pa-md reviewInput">
      <q-input
        v-model="text"
        outlined
        type="textarea"
        label="このチャンネルの紹介文を書いてください"
        :rules="[
          val => !!val || '* 紹介文を入力してください',
          val => val.length > 0 || '紹介文を入力してください'
        ]"
      />
    </div>
    <q-card-section style="font-size:14px;"
      >投稿したレビューはマイページで確認、編集が出来ます</q-card-section
    >
    <q-card-actions align="right" class="q-mt-md">
      <q-btn
        label="投稿する"
        color="primary"
        @click.prevent="submitReview(channelInfo.id)"
      />
      <q-btn
        flat
        label="キャンセル"
        color="primary"
        @click.prevent="closeModal"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Dialog } from "quasar";
export default {
  props: ["channelInfo"],
  data() {
    return {
      text: ""
    };
  },
  computed: {
    ...mapState("auth", ["userInfo"])
  },
  methods: {
    ...mapActions("auth", ["addFavoriteTuber"]),
    ...mapActions("usersPublic", ["addReviewInfo"]),
    async submitReview(value) {
      console.log(value);
      await this.addFavoriteTuber({
        uid: Object.values(this.userInfo)[0].id,
        review: this.text,
        favoriteTubersChannelId: value
      });
      await this.addReviewInfo({
        uid: Object.values(this.userInfo)[0].id,
        review: this.text,
        favoriteTubersChannelId: value
      });
      this.$emit("addstar");
      // firebaseの方のYoutuberデータのお気に入り数を加算している
      // await this.incrementFavorite({
      //   id: this.channelInfo.id
      // });
      this.writeReview = false;
      //   Stateが更新される時間を稼ぐために少し時間を置いてからページ移動
      // this.popUp();
      this.$router.push({
        name: "mypage",
        query: { id: Object.values(this.userInfo)[0].id }
      });
    },
    closeModal() {
      this.$emit("closeReviewSubmit");
    },
    popUp() {
      this.$q
        .dialog({
          title: "投稿されました！",
          message: "チャンネルのレビューが投稿されました！"
        })
        .onOk(() => {
          this.$router.push({
            name: "mypage",
            query: { id: Object.values(this.userInfo)[0].id }
          });
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }
  }
};
</script>

<style>
.reviewInput {
  min-width: 400px;
}
@media screen and (min-width: 360px) and (max-width: 499px) {
  .reviewInput {
    max-width: 300px;
    min-width: 300px;
  }
}
</style>
