<template>
  <q-dialog v-model="alert" persistent>
    <q-card class="registerNickName q-pa-sm">
      <q-card-section class="q-mb-lg">
        <div class="text-h6">ニックネームを登録してください</div>
        <div class="subtitle-1" align="right">
          （後でマイページから変更できます）
        </div>
      </q-card-section>

      <q-input
        outlined
        v-model="nickName"
        label="ニックネーム"
        :rules="[val => !!val || 'ニックネームを入れてください']"
        class="nickNameField"
        ref="nickNameInput"
      />
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" @click="submitNickName()" />
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
      nickName: ""
    };
  },
  computed: {
    ...mapState("auth", ["userInfo"])
  },
  methods: {
    ...mapActions("usersPublic", ["getLoginUsersProfile"]),
    submitNickName() {
      this.$refs.nickNameInput.validate();
      if (!this.$refs.nickNameInput.hasError) {
        const key = Object.keys(this.userInfo)[0];
        firestoreDb
          .collection("userPublicInfo")
          .doc(key)
          .update({
            nickName: this.nickName
          });
        let payload = {
          id: key,
          nickName: this.nickName
        };
        this.getLoginUsersProfile(payload);
        // this.setNickName(payload);
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

<style scoped>
.registerNickName {
  width: 410px;
  z-index: 10px;
}

.nickNameField {
  width: 350px;
  margin-right: auto;
  margin-left: auto;
}
</style>
