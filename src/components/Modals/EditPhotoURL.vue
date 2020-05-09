<template>
  <q-card class="column editPhotoWrapper" style="min-width:300px;">
    <q-card-section class="row items-center q-pb-none q-mb-md">
      <div class="displayLetter">アイコンを変更</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <div class="q-pa-md userIcon">
      <q-avatar size="120px">
        <img :src="this.usersPublicInfo[this.userId].photoURL" />
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
import { storageRef, storage } from "src/boot/firebase";
export default {
  data() {
    return {
      file: null
    };
  },
  computed: {
    ...mapState("auth", ["userId"]),
    ...mapState("usersPublic", ["usersPublicInfo"])
  },
  methods: {
    ...mapActions("usersPublic", ["update_mypagePhotoURL"]),
    upload: async function() {
      if (!this.file) {
        console.log("選択したファイルが存在しません。");
        return;
      }
      // console.log(this.file);
      let uploadFileName = this.userId + this.file.name;
      // console.log(uploadFileName);
      let StorageRef = await storageRef.child("userIcon/" + uploadFileName);
      await StorageRef.put(this.file);
      let url = await StorageRef.getDownloadURL();
      // console.log(this.usersPublicInfo[this.userId].photoName);
      if (this.usersPublicInfo[this.userId].photoName != "") {
        await storageRef
          .child("userIcon/" + this.usersPublicInfo[this.userId].photoName)
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
        this.update_mypagePhotoURL(payload);
      }
    }
  },
  mounted() {}
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
.editPhotoWrapper {
  border: 2px solid #edecf0;
}
</style>