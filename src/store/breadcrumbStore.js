export default {
    namespaced: true,
    state: {
        // 麵包屑路由
        crumbList: [],
    },
    mutations: {
        // 設定麵包屑路由
        setCrumbList(state, list) {
            state.crumbList = list;
        },
    },
};
