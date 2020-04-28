<template>
  <q-page>
    <div class="topPageImageWrapper">
      <!-- <q-img class="topPageImage" src="statics/topPage/topPage_dishImg.jpg"></q-img> -->
      <div class="column registerWrapper">
        <q-input
          bg-color="white"
          class="registerURLInput"
          rounded
          outlined
          v-model="register"
          label="好きな料理Youtube動画のURLを貼ってください"
          :rules="[val => val.includes('https://www.youtube.com/watch') || '登録できるのはYoutube動画のみです']"
        />
        <q-btn class="registerButton" label="登録" color="light-green-4"></q-btn>
      </div>
    </div>
    <div class="cookImageWrapper"></div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      register: ""
    };
  }
};
</script>

<style>
.topPageImageWrapper {
  width: 100%;
  height: 480px;
  background: red;
  background-image: url("../statics/topPage/topPage_dishImg.jpg");
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
}
.topPageImage {
  width: 95%;
  max-width: 681.18px;
}
.registerWrapper {
  width: 360px;
  margin-top: 170px;
}
.registerButton {
  margin-top: 10px;
  width: 150px;
  margin-right: auto;
  margin-left: auto;
}
</style>