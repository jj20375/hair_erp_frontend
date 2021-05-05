import Vue from "vue";
/**
 * apiConfig = api 連線網址
 * gcsImgUrl = google cloud storage 網址
 * systemShow = 判斷是否為系統人員 需顯示 按鈕 或頁面
 */
import { apiConfig, gcsImgUrl, systemShow } from "../../env";
// ajax 套件
import axios from "../config/httpConfig";
Vue.prototype.$gcsImgUrl = gcsImgUrl;
Vue.prototype.$axios = axios;
Vue.prototype.$apiConfig = apiConfig;
Vue.prototype.$systemShow = systemShow;
