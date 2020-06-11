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
    ...mapActions("tags", ["getTags"]),
    ...mapActions("menuTag", ["getMenuTag"]),
    ...mapActions("materialTag", ["getMaterialTag"]),
    ...mapActions("videos", ["getAllCookingVideos"]),
    ...mapActions("youtubers", ["getYoutubers_info"])
  },
  created() {
    this.handleAuthStateChange();
    this.getUsersPublicProfile();
    this.getTags();
    this.getAllCookingVideos();
    this.getYoutubers_info();
    this.getMenuTag();
    this.getMaterialTag();
  }
};
</script>

<style></style>
