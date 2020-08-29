<template>
  <q-layout view="hHh lpR lFf" class="shadow-2 rounded-borders">
    <headerComponent />
    <drawerComponent />
    <div id="wrapper">
      <q-page-container style="margin-bottom:50px;">
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

<style lang="scss">
body {
  color: #3c3c3c;
  // min-height: 100vh;
  // transform: translateZ(0);
  overflow-y: scroll;
}
#wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.platoform-ios {
  .q-header {
    padding-top: constant(safe-area-inset-top); // for iOS 11.0
    padding-top: env(safe-area-inset-top); // for iOS 11.2 +
  }
  .q-footer {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
