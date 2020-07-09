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
    ...mapActions("genreTag", ["getGenreTag"]),
    ...mapActions("videos", ["getAllCookingVideos"]),
    ...mapActions("youtubers", ["getYoutubers_info", "getLiveYoutubers_info"]),
    ...mapActions("timeTag", ["getTimeTag"])
  },
  created() {
    this.getAllCookingVideos();
    this.handleAuthStateChange();
    this.getUsersPublicProfile();
    this.getGenreTag();
    this.getYoutubers_info();
    this.getMenuTag();
    this.getMaterialTag();
    this.getTimeTag();
  }
};
</script>

<style></style>
