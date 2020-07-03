<template>
  <q-card class="column editIntroductionCard">
    <q-card-section class="row items-center q-pb-none q-mb-md">
      <div class="displayLetter">プロフィールを変更</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-form class="q-pa-md">
      <q-input
        label="最大35文字"
        outlined
        :rules="[
          val => !!val || '* プロフィールを入力してください',
          val => val.length < 36 || '* 35字以下の文字を入力してください'
        ]"
        :maxlength="35"
        :value="editIntroduction"
        autofocus
        @input="$emit('update:userIntroduction', $event)"
        v-model="editIntroduction"
        label-color="black"
      />
      <div class="editIntroductionCardButtonWrapper" align="right">
        <q-space />
        <q-btn
          label="変更"
          type="submit"
          color="blue"
          @click.prevent="submitIntroduction"
          v-close-popup
        />
        <q-btn label="キャンセル" type="reset" color="primary" v-close-popup flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["userIntroduction"],
  data() {
    return {
      editIntroduction: this.userIntroduction
    };
  },
  computed: {
    ...mapState("auth", ["userId"])
  },
  methods: {
    ...mapActions("usersPublic", ["update_mypageIntroduction"]),
    submitIntroduction() {
      let payload = {
        id: this.userId,
        userIntroduction: this.editIntroduction
      };
      if (this.editIntroduction.length > 35) {
        alert("既定の文字数を超えています。35字以下に設定し直してください。");
      } else {
        this.update_mypageIntroduction(payload);
        this.$router.push({
          name: "account"
        });
      }
    }
  }
};
</script>

<style scoped>
.editIntroductionCard {
  min-width: 300px;
}
.displayLetter {
  font-size: 16px;
  font-weight: bold;
}
@media screen and (min-width: 360px) and (max-width: 499px) {
  .q-card.editIntroductionCard {
    min-width: 300px;
    height: 227px;
  }
  .editIntroductionCardButtonWrapper {
    margin-top: 30px;
  }
  .q-dialog__inner--minimized > div {
    max-height: 1000px;
  }
}
</style>
