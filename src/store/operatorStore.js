export default {
    namespaced: true,
    state: {
        operator: {
            name: "最上層",
        },
    },
    mutations: {
        // 設定管理者資料
        setOperator(state, val) {
            state.operator = val;
        },
    },
};
