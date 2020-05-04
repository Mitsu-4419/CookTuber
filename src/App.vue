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
    ...mapActions("usersPublic", ["getUsersPublicProfile", "getVideos"]),
    ...mapActions("tags", ["getTags"])
  },
  created() {
    this.handleAuthStateChange();
    this.getUsersPublicProfile();
    this.getTags();
    this.getVideos();
  }
};
</script>
