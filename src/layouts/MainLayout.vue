
 <template>
  <q-layout view="hHh lpr fFf" class="shadow-2 rounded-borders">
    <headerComponent />
    <drawerComponent />
    <q-page-container>
      <router-view />
    </q-page-container>
    <footerComponent />
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
</style>
