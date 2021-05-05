import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 使用element-ui css 跟 js
import ElementUI from "element-ui";
import "element-ui/packages/theme-chalk/src/index.scss";
// 使用 vue bootstrap 方法
import BootstrapVue from "bootstrap-vue";
// 使用 argon vue 樣版
import argonVue from "./plugins/dashboard-plugin";
// 載入bootstrap
import "bootstrap";
// 載入 popper.js
import("popper.js");
// fontawsome icon 字型
import "./assets/js/library/fontawesome-all.min.js";
// 導入 vue argon 樣板樣式
import "./scss/vue-argon/argon.scss";
// 客制化css
import "./scss/main.scss";
// vue 全域化 prototype
import "./global/prototypes";
// vue 全域化 filters
import "./global/filters";
// vue 全域化 components
import "./global/components";
// vue 全域化 mixins
import "./global/mixins";
// 防止vue 在 console視窗多出現 一條已啟動的警告視窗
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(BootstrapVue);
Vue.use(argonVue);
new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");