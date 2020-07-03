<template>
  <q-dialog v-model="alert" persistent>
    <q-card class="registerNickName q-pa-sm">
      <q-card-section class="nickNameRegisterTitle">
        <div class="text-h6 text-bold">ニックネームを登録してください</div>
        <div class="subtitle-1" align="right">（後でマイページから変更できます）</div>
      </q-card-section>
      <q-card-section>
        <q-input
          outlined
          v-model="nickName"
          label="ニックネーム"
          :rules="[val => !!val || 'ニックネームを入れてください']"
          class="nickNameField"
          label-color="black"
          ref="nickNameInput"
          color="grey-8"
        />
        <q-input
          outlined
          v-model="introduction"
          label="簡単な自己紹介をしてください（※空欄可）"
          :rules="[val => val.length <= 30 || '３０字以内です']"
          ref="introduceInput"
          label-color="black"
          type="textarea"
          class="introductionField"
          color="grey-8"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="black" @click="submitNickName()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { firestoreDb } from "src/boot/firebase";
export default {
  data() {
    return {
      alert: true,
      nickName: "",
      introduction: ""
    };
  },
  computed: {
    ...mapState("auth", ["userId"])
  },
  methods: {
    ...mapActions("usersPublic", ["updateNewLoginUsersProfile"]),
    submitNickName() {
      this.$refs.nickNameInput.validate();
      if (!this.$refs.nickNameInput.hasError) {
        const key = this.userId;
        firestoreDb
          .collection("userPublicInfo")
          .doc(key)
          .update({
            nickName: this.nickName,
            introduction: this.introduction
          });
        let payload = {
          id: key,
          nickName: this.nickName,
          introduction: this.introduction
        };
        this.updateNewLoginUsersProfile(payload);
        this.alert = false;
        localStorage.setItem("isNewUser", false);
        this.$router.push("/");
      } else {
        console.log("false");
      }
    }
  },
  created() {}
};
</script>

<style scoped lang='scss'>
.registerNickName {
  width: 410px;
  z-index: 10px;
  padding: 0;
}
.nickNameField {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}
.introductionField {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}
.nickNameRegisterTitle {
  background: #f7f3e8;
}
</style>
