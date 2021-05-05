<template>
    <side-bar>
        <template slot-scope="props"
                  slot="links">
            <hr class="my-3" />
            <sidebar-item v-for="(item, key) in sideBarMenu"
                          :key="key"
                          :link="{
                    name: item.meta.text,
                    icon: item.ico+' hot-color',
                    path: item.name,
                }">
                <sidebar-item v-if="checkParamsRoute(item2)"
                              v-for="(item2, key2) in item.children"
                              :key="key2"
                              :link="{
                        name: item2.meta.text,
                        path: item2.name,
                        active: item2.name === $route.name
                    }">
                    <sidebar-item v-if="checkParamsRoute(item3)"
                                  v-for="(item3, key3) in item2.children"
                                  :key="key3"
                                  :link="{
                            name: item3.meta.text,
                            path: item3.name,
                            active: item3.name === $route.name
                        }" />
                </sidebar-item>
            </sidebar-item>
        </template>

        <!-- <template slot="links-after">
            <hr class="my-3" />
            <h6 class="navbar-heading p-0 text-muted">Documentation</h6>

            <ul class="navbar-nav mb-md-3">
                <li class="nav-item">
                    <a class="nav-link"
                       href="https://demos.creative-tim.com/vue-argon-dashboard-pro/documentation"
                       target="_blank">
                        <i class="ni ni-spaceship"></i>
                        <span class="nav-link-text">Getting started</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link"
                       href="https://demos.creative-tim.com/vue-argon-dashboard-pro/documentation/foundation/colors.html"
                       target="_blank">
                        <i class="ni ni-palette"></i>
                        <span class="nav-link-text">Foundation</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link"
                       href="https://demos.creative-tim.com/vue-argon-dashboard-pro/documentation/components/avatars.html"
                       target="_blank">
                        <i class="ni ni-ui-04"></i>
                        <span class="nav-link-text">Components</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link"
                       href="https://demos.creative-tim.com/vue-argon-dashboard-pro/documentation/components/plugin_datepicker.html"
                       target="_blank">
                        <i class="ni ni-chart-pie-35"></i>
                        <span class="nav-link-text">Plugins</span>
                    </a>
                </li>
            </ul>
        </template> -->
    </side-bar>
</template>
<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import _ from "lodash";
import SideBar from "../../../components/SidebarPlugin/SideBar.vue";
import SidebarItem from "../../../components/SidebarPlugin/SidebarItem.vue";
export default {
    components: {
        SideBar,
        SidebarItem,
    },
    computed: {
        ...mapState("permissionStore", ["sideBarMenu", "currentMenu"]),
        ...mapState("i18nStore", ["langData"]),
    },
    methods: {
        ...mapMutations("i18nStore", ["setDefaultLang"]),
        // 檢查是否有帶參數的選單
        checkParamsRoute(value) {
            // let regex = /.*\/\:.*?/g;
            // if (regex.test(value.path)) {
            //     return true;
            // } else {
            //     return false;
            // }
            return value.meta.isMenu === 1 ? true : false;
        },
    },
};
</script>

