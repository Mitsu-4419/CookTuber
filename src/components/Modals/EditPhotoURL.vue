<template>
  <q-card class="column" style="min-width:300px;">
    <q-card-section class="row items-center q-pb-none q-mb-md">
      <div class="displayLetter">アイコンを変更</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <div class="q-pa-md userIcon">
      <q-avatar size="120px">
        <img :src="Object.values(this.userInfo)[0].photoURL" />
      </q-avatar>
    </div>
    <q-form id="file_upload" style="min-width:300px;" class="q-pa-md">
      <q-input @input="val => { file = val[0] }" type="file" borderless />
      <div align="right">
        <q-space />
        <q-btn label="変更" type="submit" color="blue" @click.prevent="upload" v-close-popup />
        <q-btn label="キャンセル" type="reset" color="primary" v-close-popup flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-card>
</template>
<script>
import { mapState, mapActions } from "vuex";
import * as firebase from "firebase/app";
import { storageRef, storage } from "src/boot/firebase";
export default {
  data() {
    return {
      file: null,
      userId: "",
      userPhotoName: ""
    };
  },
  computed: {
    ...mapState("auth", ["userInfo"])
  },
  methods: {
    ...mapActions("auth", ["update_displayPhotoURL", "update_PhotoName"]),
    ...mapActions("usersPublic", ["update_mypagePhotoURL"]),
    upload: async function() {
      if (!this.file) {
        console.log("選択したファイルが存在しません。");
        return;
      }
      let uploadFileName = this.userId + this.file.name;
      let storageRef = await firebase
        .storage()
        .ref()
        .child("userIcon/" + uploadFileName);
      await storageRef.put(this.file);
      let url = await storageRef.getDownloadURL();
      if (this.userPhotoName != "") {
        await firebase
          .storage()
          .ref()
          .child("userIcon/" + this.userPhotoName)
          .delete();
      }
      let payload = await {
        id: this.userId,
        userPhotoURL: url,
        userPhotoName: uploadFileName
      };
      if (url == null) {
        alert("無効なファイルです。再度ご確認ください");
      } else {
        this.update_displayPhotoURL(payload);
        this.update_mypagePhotoURL(payload);
        this.update_PhotoName(payload);
      }
    }
  },
  created() {
    this.userId = Object.keys(this.userInfo)[0];
    this.userPhotoName = Object.values(this.userInfo)[0].photoName;
  }
};
</script>

<style>
.displayLetter {
  font-size: 16px;
  font-weight: bold;
}

.userIcon {
  text-align: center;
}
</style>