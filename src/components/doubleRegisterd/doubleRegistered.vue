<template>
  <q-card>
    <q-card-section class="row items-center">
      <q-avatar icon="warning" color="red" text-color="white" size="sm" />
      <span class="q-ml-sm">同じ動画は２回登録できません</span>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="OK" color="black" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script>
</script>