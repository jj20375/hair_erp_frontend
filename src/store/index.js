import Vue from "vue";
import Vuex from "vuex";
import userStore from "./userStore";
import designerStore from "./designerStore";
import permissionStore from "./permissionStore";
import breadcrumbStore from "./breadcrumbStore";
import setIntervalStore from "./setIntervalStore";
import i18nStore from "./i18nStore";

import operatorStore from "./operatorStore";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        userStore,
        designerStore,
        operatorStore,
        permissionStore,
        breadcrumbStore,
        i18nStore,
        setIntervalStore,
    },
    // 等同於data
    state: {
        test1: "this is test333",
    },
    // 等同於 methods
    mutations: {},
    // 等同於computed
    getters: {},
    // 等同於mounted
    actions: {},
});
