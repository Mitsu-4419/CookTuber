<template>
  <q-card class="q-pa-md">
    <q-card-section class="row">
      <q-icon name="sentiment_satisfied_alt" color="orange-4" size="md"></q-icon>
      <div class="text-h6 q-ml-sm">動画が後で作るに登録されました！</div>
    </q-card-section>
    <q-card-section class>マイページの "後で作る" からいつでも閲覧できます</q-card-section>
    <q-card-actions align="right" class="q-mt-md">
      <q-btn flat label="OK" color="black" v-close-popup />
      <q-btn
        label="マイページへ"
        style="font-weight:bold; background-color:#ff9933;color:white;"
        v-close-popup
        :to="{ name: 'mypage', query: { id:userId } }"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  props: ["userId"]
};
</script>

<style scoped>
</style>