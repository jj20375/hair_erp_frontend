import Vue from "vue";
import Router from "vue-router";
import { getStorage } from "../service/localStorage";
import store from "../store";
import { setIndexMode } from "../../env";
import { Loading } from "element-ui";

Vue.use(Router);

let loading;

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: "Loding Now...",
        background: "rgba(0,0,0,.7)",
    });
}

function endLoading() {
    loading.close();
}

// 初始路由
var routerOption = {
    // mode: "history",
    // base: "/",
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("../views/user/Login.vue"),
        },
    ],
};
//依env來決定是否要捨棄#號
if (setIndexMode) {
    routerOption.mode = "history";
}
const createRouter = () => new Router(routerOption);
const router = createRouter();
// router.matcher = resetRouter();
router.beforeEach((to, from, next) => {
    startLoading();
    function auth(auth) {
        return to.matched.some((record) => {
            return record.meta[auth];
        });
    }
    // 獲取登入token從 localStorage
    const isLogin = getStorage("token") !== null ? true : false;
    // 判斷是否為登入頁 如果是的話繼續
    if (!isLogin) {
        // 判斷是否登入 如果沒有登入，倒回登入頁，如果有登入則判斷是否有匹配且不等於requiresAuth
        if (to.matched.length > 0 && !auth("requiresAuth")) {
            next();
        } else {
            next({ name: "login" });
        }
    } else {
        // 取的個人資料
        if (store.state.userStore.user === null) {
            async function getData() {
                await store.dispatch("userStore/getLoginUserInfo");
            }
            getData();
        }
        // // 取得後台語系檔
        // if (store.state.i18nStore.langData === null) {
        //     async function getLang() {
        //         await store.dispatch("i18nStore/getDefalutLangData", getStorage("lang"));
        //     }
        //     getLang();
        // }
        // 判斷permissionList為空時執行獲取權限路由api
        if (store.state.permissionStore.permissionList === null) {
            store.dispatch("permissionStore/getPermissionList").then(() => {
                next({
                    path: to.path,
                });
            });
        } else {
            if (to.name !== "login") {
                next();
            } else {
                next(from.fullPath);
            }
        }
    }
});
router.afterEach((to, from, next) => {
    endLoading();
    let routerList = to.matched;
    // 取得麵包屑路由
    store.commit("breadcrumbStore/setCrumbList", routerList);
    // 取得當前路由
    // store.commit("permissionStore/setCurrentMenu", to.name);
});

export default router;

export const defaultRouter = [
    {
        path: "",
        name: "layout",
        redirect: "dashboard",
        component: () => import("../views/layout/content.vue"),
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                ico: "ni ni-shop",
                component: () => import("../views/Home.vue"),
                meta: {
                    title: 'Home Page - Example App',
                    name: "dashboard",
                    text: "首頁",
                    icon: "fab fa-angellist",
                },
            },
            {
                path: "/userUpdate",
                name: "userUpdate",
                ico: "ni ni-settings-gear-65",
                component: () => import("../views/user/Update.vue"),
                meta: {
                    name: "userUpdate",
                    text: "使用者更新",
                },
            },
        ],
    },
    {
        path: "*",
        name: "notfound",
        component: (resolve) => require(["../views/404.vue"], resolve),
    },
    // {
    //     path: "/register",
    //     name: "register",
    //     component: resolve => require(["../views/user/Register.vue"], resolve),
    // },
];
