import Vue from "vue";
import moment from "moment";
/**
 * formatCurrency = 使用貨幣format方法 將三位數後加上逗號
 */
import { formatCurrency } from "../service/anyService";

// 貨幣 轉譯成三位數加上一個逗號格式
Vue.filter("formatCurrency", (val) => {
    let num = formatCurrency(val);
    return num == "NaN" ? "Err" : num;
});
// 將日期格式轉換
Vue.filter("formatDate", (val) => {
    return moment(val).format("YYYY/MM/DD");
});
//
Vue.filter("formatDateTime", (val) => {
    // 判斷時間格式是否需要
    return moment(val).format("YYYY/MM/DD HH:mm:ss");
});

// 時間搓 轉譯成日期時間格式
Vue.filter("formatUnixDate", (val) => {
    if (val === null) {
        return null;
    }
    if (val === 0) {
        return "尚未設定時間";
    }
    return moment.unix(val).format("YYYY/MM/DD HH:mm:ss");
});
// 訂單時間專用 時間搓 轉譯成日期時間格式
Vue.filter("formatOrderUnixDate", (val) => {
    if (val === null) {
        return null;
    }
    if (val === 0) {
        return "尚未完成";
    }
    return moment.unix(val).format("YYYY/MM/DD HH:mm:ss");
});
