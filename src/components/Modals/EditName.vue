<template>
  <q-card class="column" style="min-width:300px;">
    <q-card-section class="row items-center q-pb-none q-mb-md">
      <div class="displayLetter">アカウントネームを変更</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-form style="min-width:300px;" class="q-pa-md">
      <q-input
        outlined
        label="最大15文字"
        :rules="[
          val => !!val || '* アカウントネームを入力してください',
          val => val.length < 16 || '* 15字以下の文字を入力してください',
        ]"
        :maxlength="15"
        :value="editName"
        autofocus
        @input="$emit('update:userName', $event)"
        v-model="editName"
      />
      <div class="q-mt-md" align="right">
        <q-space />
        <q-btn label="変更" type="submit" color="blue" @click.prevent="submitName" v-close-popup />
        <q-btn label="キャンセル" type="reset" color="primary" v-close-popup flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-card>
</template>


<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["userName"],
  data() {
    return {
      editName: this.userName
    };
  },
  computed: {
    ...mapState("auth", ["userId"])
  },
  methods: {
    ...mapActions("usersPublic", ["update_mypageName"]),
    submitName() {
      let payload = {
        id: this.userId,
        userName: this.editName
      };
      if (this.editName.length > 15) {
        alert("既定の文字数を超えています。15字以下に設定し直してください。");
      } else {
        this.update_mypageName(payload);
        this.$router.push({
          name: "account"
        });
      }
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