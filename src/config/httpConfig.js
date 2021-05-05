import axios from "axios";
import { Loading, Message } from "element-ui";
import { getStorage, removeStorage } from "../service/localStorage";
import store from "../store";
import router from "../router";

let instance = axios.create({
    timeout: 15000,
    baseURL: ``,
    headers: {},
});
// axios請求之前的動作
instance.interceptors.request.use(
    (config) => {
        config.headers["Accept-Language"] = getStorage("lang");
        if (getStorage("token") !== null) {
            config.headers.Authorization = getStorage("token");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// axios請求之後的動作
instance.interceptors.response.use(
    (response) => {
        // endLoading();
        return response;
    },
    (error) => {
        // endLoading();
        const { status } = error.response;
        if (status == 401) {
            Message.error("token失效，請重新登入");
            removeStorage("token");
            removeStorage("loginTime");
            removeStorage("tokenTime");
            removeStorage("refreshTime");
            removeStorage("lang");
            removeStorage("isAuth");
            store.commit("userStore/setUser", null);
            store.commit("userStore/setIsAuth", false);
            router.push({ name: "login" });
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
        return Promise.reject(error);
    }
);

export default instance;
