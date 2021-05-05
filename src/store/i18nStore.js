import { setStorage, getStorage } from "../service/localStorage";
// 預設語系
import { defaultLanguage } from "../../env";
// 導入語系判斷方法
import { checkLang } from "../service/anyService";
// 設定預設語系在localStorage
if (getStorage("lang") === null) {
    setStorage("lang", defaultLanguage);
}
export default {
    namespaced: true,
    state: {
        locale: getStorage("lang"),
        langData: null,
    },
    getters: {
        langs: (state) => {
            let langData = [
                { lang: "cn", name: "简体中文", icon: "cn" },
                { lang: "en", name: "English", icon: "us" },
                { lang: "tw", name: "繁體中文", icon: "tw" },
            ];
            return langData;
        },
    },
    mutations: {
        setLang(state, lang) {
            state.locale = lang;
        },
        // 設定後臺語系檔
        setDefaultLang(state, langData) {
            state.langData = langData;
        },
    },
    actions: {
        getLang({ commit }, lang) {
            commit("setLang", lang);
            setStorage("lang", lang);
        
        },
        // 取得後臺語系
        getDefalutLangData({ commit, state }, lang) {
           
        },
    },
};
