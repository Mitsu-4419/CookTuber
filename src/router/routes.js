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
        path: "/youtubers",
        component: () => import("pages/Menu/PageYoutubers.vue")
      },
      {
        path: "/CookvideoAll",
        component: () => import("pages/Menu/cookVideoAll.vue"),
        name: "allVideos",
        props: true
      },
      {
        path: "/show",
        component: () => import("pages/DetailPage/YoutuberDetail.vue"),
        name: "show"
      },
      {
        path: "/video",
        component: () => import("pages/DetailPage/videoDetailPage.vue"),
        name: "video"
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
      },
      {
        path: "/mypage",
        component: () => import("pages/MyPage/PageMypage.vue"),
        name: "mypage",
        props: true
      },
      {
        path: "/reviewtotal",
        component: () => import("pages/Menu/ReviewerTotal.vue")
      },
      {
        path: "/news",
        component: () => import("pages/Menu/NewsPage.vue")
      },
      {
        path: "/search",
        component: () => import("pages/Search/searchResult.vue"),
        name: "search",
        props: true
      },
      {
        path: "/privacypolicy",
        component: () => import("pages/Others/PlivacyPolicyPage.vue")
      },
      {
        path: "/termsOfService",
        component: () => import("pages/Others/TermsOfServicePage.vue")
      },
      {
        path: "/others",
        component: () => import("pages/Others/Others.vue")
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
