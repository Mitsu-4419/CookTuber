<template>
  <q-card class="q-pa-md">
    <q-card-section class="row">
      <q-icon name="report_problem" color="yellow-14" size="md"></q-icon>
      <div class="text-h6 q-ml-sm">ログインが必要です</div>
    </q-card-section>
    <q-card-section class>
      チャンネルお気に入り登録機能を使用されるには
      <br />ユーザー登録、ログインが必要です
    </q-card-section>
    <q-card-actions align="right" class="q-mt-md">
      <q-btn flat label="キャンセル" color="black" v-close-popup />
      <q-btn
        label="ログインへ"
        style="font-weight:bold; background-color:#ff9933;color:white;"
        v-close-popup
        to="/auth/sign_in"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
</script>

<style scoped>
</style>