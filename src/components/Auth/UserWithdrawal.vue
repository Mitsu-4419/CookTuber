<template>
  <q-card class="column">
    <q-card-section class="row items-center q-pb-none q-mb-md">
      <div class="displayLetter">退会手続き</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <div class="q-pa-md">
      一度削除した登録情報は復旧することが出来ません。
      <br />予めご了承ください。
      <div class="q-mt-md" align="right">
        <q-space />
        <q-btn label="確認" type="submit" color="blue" @click.prevent="submitAction" />
        <q-btn label="キャンセル" type="reset" color="primary" v-close-popup flat class="q-ml-sm" />
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("auth", ["userInfo"])
  },
  methods: {
    submitAction() {
      this.$router.push({
        name: "withdrawal",
        query: { id: Object.keys(this.userInfo)[0] }
      });
    }
  }
};
</script>

<style lang="stylus">
.displayLetter {
  font-size: 16px;
  font-weight: bold;
}
</style>