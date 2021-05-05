import { setStorage, getStorage, removeStorage } from "../service/localStorage";
// 取得登入者資料 api
import { LoginUserInfoApi } from "../api/userApi";
import { Message } from "element-ui";
export default {
    namespaced: true,
    // data
    state: {
        isAuth: false,
        user: null, // 使用者資料
    },
    // computed
    getters: {
        getOperatorId: (state) => {
            if (state.user.group.group_code !== "SYSTEM") {
                return state.user.userable.user_operator.operator_id;
            } else {
                return 0;
            }
        },
    },
    // methods
    mutations: {
        // 設定為登入
        setIsAuth(state, val) {
            state.isAuth = val;
        },
        // 設定使用者資料
        setUser(state, val) {
            state.user = val;
        },
    },
    // mounted ajax的方法都寫在這
    actions: {
        // 取得使用者資料
        async getLoginUserInfo({ commit, state }, user) {
            if (getStorage("token")) {
                try {
                    let { data } = await LoginUserInfoApi();
                    commit("setUser", data.data);
                    setStorage("tokenTime", data.data.token_time);
                    return data.data;
                } catch (err) {
                    Message({
                        type: "error",
                        message: "取得使用者資料失敗",
                    });
                }
            }
        },
        // getServerTime({ state, commit }, userData) {
        //     let self = this;
        //     //現在時間
        //     let nowTime = 0;
        //     GetServerTimeApi()
        //         .then(({ data }) => {
        //             nowTime = data;
        //         })
        //         .catch((err) => {
        //             Message({
        //                 type: "error",
        //                 message: "獲得伺服器時間失敗",
        //             });
        //         });

        //     // 用登入時間加上要重新獲取token的時間 看是要提早幾分鐘獲取
        //     let deleteTime = 60 * 1;
        //     //時間的計時器
        //     let timeCount = 0;

        //     //取得重刷時間
        //     let refreshTime = getStorage("refreshTime");
        //     //如果Storage沒有設定重刷時間就設定
        //     if (refreshTime == null) {
        //         // tokenTime-deleteTime=refreshTime
        //         refreshTime = getStorage("tokenTime") - deleteTime;
        //         setStorage("refreshTime", refreshTime);
        //     } else {
        //         refreshTime = parseInt(getStorage("refreshTime"));
        //     }

        //     //每秒執行
        //     setInterval(() => {
        //         nowTime++;
        //         timeCount++;
        //         //console.log("nowTime:", nowTime);
        //         //console.log("timeCount:", timeCount);
        //         //console.log("refreshTime", refreshTime);

        //         //console.log("現在時間:", moment.unix(nowTime).format("YYYY-MM-DD HH:mm:ss"));
        //         //console.log("重刷時間:", moment.unix(refreshTime).format("YYYY-MM-DD HH:mm:ss"));

        //         //如果計時器超過一分鐘
        //         if (timeCount >= 60) {
        //             //console.log("每分鐘重新取得一次伺服器時間");
        //             GetServerTimeApi()
        //                 .then(({ data }) => {
        //                     nowTime = data;
        //                 })
        //                 .catch((err) => {
        //                     Message({
        //                         type: "error",
        //                         message: "獲得伺服器時間失敗",
        //                     });
        //                 });
        //             timeCount = 0;
        //         }

        //         //如果現在時間超過重刷時間就重新取得token
        //         if (nowTime >= refreshTime) {
        //             RefreshTokenApi()
        //                 .then(({ data }) => {
        //                     //console.log("reToken", data);
        //                     // 重刷後將token重新存在 storage
        //                     setStorage("token", "Bearer " + data.data.token);
        //                     refreshTime = parseInt(data.data.unixtime) - deleteTime;
        //                     // 將token時間減掉過期時間等於真正的登入時間
        //                     setStorage("refreshTime", refreshTime);
        //                 })
        //                 .catch((err) => {
        //                     Message({
        //                         type: "error",
        //                         message: "重刷token失效",
        //                     });
        //                 });
        //         }
        //     }, 1000);
        // },
        // 登出使用者清除localStorage
        logOutUser({ commit, rootState }) {
            let self = this;
            removeStorage("token");
            removeStorage("lang");
            removeStorage("loginTime");
            removeStorage("refreshTime");
            removeStorage("tokenTime");
            removeStorage("agentName");
            removeStorage("depth");
            removeStorage("defaultDepth");
            removeStorage("agentUserId");
            removeStorage("agentAddId");
            removeStorage("parent");
            removeStorage("isAuth");
            removeStorage("noticeLastId");
            commit("setIsAuth", false);
            commit("setUser", null);
            commit("permissionStore/clearCurrentState", "", { root: true });
        },
    },
};
