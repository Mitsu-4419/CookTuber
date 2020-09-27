import Vue from "vue";
import VueRouter from "vue-router";
import StarRating from "vue-star-rating";
import routes from "./routes";
import VueGtag from "vue-gtag";

Vue.use(VueRouter);
Vue.component("star-rating", StarRating);
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function(/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  Vue.use(
    VueGtag,
    {
      config: { id: "UA-171503015-1" },
      includes: [{ id: "UA-174254526-1" }, { id: "G-YTXYE0HFBL" }]
    },
    Router
  );

  return Router;
}
