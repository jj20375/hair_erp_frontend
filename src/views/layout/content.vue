<template>
    <div class="wrapper">
        <SidebarMenu />
        <div class="main-content">
            <Header :type="$route.meta.navbarType" />
            <div @click="$sidebar.displaySidebar(false)">
                <fade-transition :duration="200"
                                 origin="center top"
                                 mode="out-in">
                    <router-view></router-view>
                </fade-transition>
            </div>
            <Footer />
        </div>
    </div>
</template>
<script>
function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
    if (hasElement(className)) {
        new PerfectScrollbar(`.${className}`);
    } else {
        // try to init it later in case this component is loaded async
        setTimeout(() => {
            initScrollbar(className);
        }, 100);
    }
}

import SidebarMenu from "./sidebar/Sidebar.vue";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import Header from "./header/Header.vue";
import Footer from "./footer/Footer.vue";
import { FadeTransition } from "vue2-transitions";
export default {
    components: {
        Header,
        Footer,
        FadeTransition,
        SidebarMenu,
    },
    methods: {
        initScrollbar() {
            let isWindows = navigator.platform.startsWith("Win");
            if (isWindows) {
                initScrollbar("sidenav");
            }
        },
    },
    mounted() {
        this.initScrollbar();
    },
};
</script>