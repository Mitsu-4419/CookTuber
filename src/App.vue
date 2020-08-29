<template>
  <div id="q-app" style="color:#333">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Vue from "vue";
export default {
  methods: {
    ...mapActions("auth", ["handleAuthStateChange"]),
    ...mapActions("usersPublic", ["getUsersPublicProfile"]),
    ...mapActions("videos", ["getAllCookingVideos", "getWatchNumber"]),
    ...mapActions("youtubers", ["getYoutubers_info", "getLiveYoutubers_info"]),
    ...mapActions("topPageImage", ["getTopPageImage"]),
  },
  created() {
    this.getTopPageImage();
    this.getAllCookingVideos();
    this.handleAuthStateChange();
    this.getUsersPublicProfile();
    this.getYoutubers_info();
    // this.getWatchNumber();
  },
};
</script>

<style></style>
