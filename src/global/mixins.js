import Vue from "vue";
/**
 * checkLang = 導入語系判斷方法
 */
import { checkLang } from "../service/anyService";

// vue 全域 mixin
Vue.mixin({
    data() {
        return {
            isMobile: false,
        };
    },
    methods: {
        /**
         * 判斷語系檔 是否存在 不存在則回傳key
         * @param { type Object (物件) 該值為語系檔的值} value
         * @param { type String (字串) 該值為檔案名稱 } langFile
         * @param { type String (字串) 該值為要傳入對應語系檔得key } langKey
         */
        checkLang(value, langFile, langKey) {
            return checkLang(value, langFile, langKey);
        },
        // 判斷介面寬度 是否為手機
        checkMobile() {
            let windowWidth = window.innerWidth;
            if (windowWidth > 768) {
                this.isMobile = false;
            } else {
                this.isMobile = true;
            }
        },
        /**
         * 判斷字元過長就出現...
         * @param { type String(字串) 要過濾的文字 } val
         * @param { type Number(數字) 要過濾的文字長度 } num
         */
        subString(val, num) {
            if (val.length > num) {
                return val.substring(0, num) + "...";
            }
            return val;
        },
    },
    created() {
        this.checkMobile();
    },
});
