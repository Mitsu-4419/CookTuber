<template>
  <q-card class="q-pa-md">
    <q-card-section class="row">
      <q-icon name="edit" size="md"></q-icon>
      <div class="text-h6 q-ml-sm">お気に入りに登録</div>
    </q-card-section>
    <div class="q-pa-md" style="max-width: 300px">
      <q-input
        v-model="text"
        outlined
        type="textarea"
        :rules="[
          val => !!val || '* 料理のReviewを入力してください'
        ]"
      />
    </div>
    <q-card-section class>投稿したレビューはマイページで確認できます</q-card-section>
    <q-card-actions align="right" class="q-mt-md">
      <q-btn label="投稿する" color="primary" @click.prevent="submitReview(channelInfoToModal)" />
      <q-btn flat label="キャンセル" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script>
import { SessionStorage } from "quasar";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: ["channelInfoToModal"],
  data() {
    return {
      userId: "",
      writeReview: false,
      text: ""
    };
  },
  computed: {},
  methods: {
    // ...mapActions("auth", ["addFavoriteTuber"]),
    // ...mapActions("youtubers", ["incrementFavorite"]),
    submitReview(value) {
      console.log(value);
      this.addFavoriteTuber({
        id: this.userId,
        review: this.text,
        favoriteTubers: value
      });
      this.incrementFavorite({
        id: value
      });
      this.writeReview = false;
    }
  },
  created() {
    this.userId = Object.values(this.userInfo)[0].id;
  }
};
</script>

<style>
</style>