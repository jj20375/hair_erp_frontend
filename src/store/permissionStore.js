// element ui alert 提醒功能
import { Message } from "element-ui";
// 取得使用者權限
import { UserMenuApi } from "../api/userApi";
// 導入 所有需要權限的router
import dynamicRoutes from "../router/dynamicRouter";
/**
 * permissionRouter = 過濾所有router方法，指返回該用戶擁有的權限路由
 * setDefaultRoute = 設定登入就可看到的路由頁面
 */
import { permissionRouter, setDefaultRoute } from "../service/routerService";
/**
 * router = 初始化路由 (vue router) 方法
 * defaultRouter = 登入即可觀看的路由
 */
import router, { defaultRouter } from "../router/index";
export default {
    namespaced: true,
    // data
    state: {
        // 初始權限的路由
        permissionList: null,
        // 左側選單
        sideBarMenu: [],
        // 樹狀結構權限
        permissionTree: [],
    },
    // coumputed
    getters: {},
    // methods
    mutations: {
        // 設定初始權限路由值
        setPermissionList(state, routes) {
            state.permissionList = routes;
        },
        // 設定左側選單
        setSideBarMenu(state, menu) {
            state.sideBarMenu = menu;
        },
        // 設定樹狀結構的權限
        setPermissionTree(state, tree) {
            state.permissionTree = tree;
        },
    },
    // mounted
    actions: {
        //es7 同步 ajax 寫法
        async getPermissionList({ commit, state, dispatch, rootState }) {
            try {
                let { data } = await UserMenuApi();
                // 獲取登入的使用者過濾完後可訪問的權限路由
                let permissionRoutes = permissionRouter(data.data, dynamicRoutes);
                // 判斷登入後即可瀏覽的路由頁面 該頁面的path === ''
                let findDefaultRouter = defaultRouter.find((value) => value.path === "");
                // 獲取登入後即可瀏覽的路由底下的children頁面
                let setPermissionRouter = findDefaultRouter.children;
                // 將登入後即可瀏覽的權限與需要權限的路由做整合
                setPermissionRouter.push(...permissionRoutes);
                // 過濾重複的資料
                let result = setPermissionRouter.filter(function(element, index, arr) {
                    return arr.indexOf(element) === index;
                });
                // 設定 SideBarMenu 值;
                commit("setSideBarMenu", result);
                // // 設定 樹狀結構權限 值;
                // commit("setPermissionTree", permissionList.data);
                // 初始化 登入後 即可訪問路由的權限
                setDefaultRoute(setPermissionRouter);
                // 初始路由
                let initialRoutes = router.options.routes;
                // 動態添加路由
                router.addRoutes(defaultRouter);
                // 初始的路由表
                commit("setPermissionList", [...initialRoutes, ...defaultRouter]);
            } catch (err) {
                console.log(err);
                Message({
                    type: "error",
                    message: "取得權限資料失敗",
                });
            }
        },
    },
};
