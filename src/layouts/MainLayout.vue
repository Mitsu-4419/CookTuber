<template>
  <q-layout view="hHh lpR lFf" class="shadow-2 rounded-borders">
    <headerComponent />
    <drawerComponent />
    <div id="wrapper">
      <q-page-container>
        <router-view />
      </q-page-container>
      <footerComponent />
    </div>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {};
  },
  components: {
    headerComponent: require("components/headerFooterDrawer/header.vue")
      .default,
    drawerComponent: require("components/headerFooterDrawer/drawer.vue")
      .default,
    footerComponent: require("components/headerFooterDrawer/footer.vue").default
  }
};
</script>

<style>
body {
  color: #3c3c3c;
}
#wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
