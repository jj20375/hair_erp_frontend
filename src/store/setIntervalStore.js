import { setStorage, getStorage } from "../service/localStorage";
// 重刷 token api
import { RefreshTokenApi } from "../api/userApi";
// 取得伺服器時間 api
import { GetServerTimeApi } from "../api/serverApi";
import { Message } from "element-ui";
export default {
    namespaced: true,
    // data
    state: {},
    // coumputed
    getters: {},
    // methods
    mutations: {},
    // mounted ajax的方法都寫在這
    actions: {
        /* 需要一直ajax 的事件 放這裡
         * 未來需要 ajax的東西需要包裝成 store去應用 ， 如果無法包裝的情況下再討論
         */
        async getSetIntervalStart({ state, commit, dispatch, rootState }, userData) {
            //現在時間
            let nowTime = 0;
            try {
                let { data } = await GetServerTimeApi();
                nowTime = data.data.unixTime;
            } catch (err) {
                Message({
                    type: "error",
                    message: "取得伺服器時間失敗",
                });
                return;
            }
            // 用token失效時間 減掉 看是要提早幾分鐘獲取
            let deleteTime = 60 * 5;
            //時間的計時器
            let timeCount = 0;
            // 5秒時間計時器
            // let timeCount10 = 0;

            //取得重刷時間
            let refreshTime = 0;
            //如果Storage沒有設定重刷時間就設定
            if (refreshTime == null || refreshTime == 0) {
                // tokenTime-deleteTime=refreshTime
                refreshTime = getStorage("tokenTime") - deleteTime;
                setStorage("refreshTime", refreshTime);
            } else {
                refreshTime = parseInt(getStorage("refreshTime"));
            }

            //每三分鐘執行
            let intervalRun = setInterval(() => {
                // 判斷是否有登入 如果沒有登入 就不繼續往下執行
                if (!getStorage("isAuth")) {
                    clearInterval(intervalRun);
                    return;
                }
                timeCount++;
                // timeCount10++;
                // 計時超過 10 秒鐘 重新取得通知
                // if (timeCount10 >= 10) {
                //     timeCount10 = 0;
                //     // dispatch("noticeStore/getNoticeNum", null, { root: true });
                // }
                //每三分鐘跟伺服器請求時間
                if (timeCount >= 1) {
                    // console.log("每分鐘重新取得一次伺服器時間", timeCount);
                    GetServerTimeApi()
                        .then(({ data }) => {
                            // console.log(data);
                            nowTime = data.data.unixTime;
                            timeCount = 0;
                        })
                        .catch((err) => {
                            Message({
                                type: "error",
                                message: "獲得伺服器時間失敗",
                            });
                        });
                }
                // console.log("nowTime:", nowTime);
                // console.log("refreshTime", refreshTime);
                //如果現在時間超過重刷時間就重新取得token
                if (nowTime >= refreshTime) {
                    RefreshTokenApi()
                        .then(({ data }) => {
                            // console.log(data);
                            // 重刷後將token重新存在 storage
                            setStorage("token", "Bearer " + data.data.token);
                            // 重設token失效時間
                            setStorage("tokenTime", data.data.tokenTime);
                            refreshTime = parseInt(data.data.tokenTime) - deleteTime;
                            // 將token時間減掉過期時間等於真正的登入時間
                            setStorage("refreshTime", refreshTime);
                        })
                        .catch((err) => {
                            commit("userStore/setIsAuth", false, { root: true });
                            Message({
                                type: "error",
                                message: "重刷token失效",
                            });
                        });
                }
            }, (1 * 1000 * 60 * 3));
        },
    },
};
