const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      {
        path: "/auth/sign_up",
        component: () => import("pages/Auth/PageAuthSignUp.vue")
      },
      {
        path: "/auth/sign_in",
        component: () => import("pages/Auth/PageAuthLogIn.vue")
      },
      {
        path: "/registerDisplayName",
        component: () => import("pages/SetUp/PageRegisterDisplayName.vue")
      },
      {
        path: "/account",
        component: () => import("pages/Navigation/AccountInfo.vue"),
        name: "account"
      },
      {
        path: "/contact",
        component: () => import("pages/Navigation/Contact.vue")
      },
      {
        path: "/withdrawal",
        component: () => import("pages/Navigation/Withdrawal.vue"),
        name: "withdrawal",
        props: true
      },
      {
        path: "/thanksbyebye",
        component: () => import("pages/Navigation/Thanks.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;