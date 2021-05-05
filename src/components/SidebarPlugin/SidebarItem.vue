<template>
    <component :is="baseComponent"
               :to="link.path ? {name: link.path} : '/'"
               class="nav-item"
               :class="{ active: isActive }"
               tag="li">
        <a v-if="isMenu"
           class="sidebar-menu-item nav-link"
           :class="{ active: isActive }"
           :aria-expanded="!collapsed"
           data-toggle="collapse"
           @click.prevent="collapseMenu">
            <template v-if="addLink">
                <span class="nav-link-text">
                    {{ link.name }} <b class="caret"></b>
                </span>
            </template>
            <template v-else>
                <i :class="link.icon"></i>
                <span class="nav-link-text">{{ link.name }} <b class="caret"></b></span>
            </template>
        </a>

        <collapse-transition>
            <div v-if="$slots.default || this.isMenu"
                 v-show="!collapsed"
                 class="collapse show">
                <ul class="nav nav-sm flex-column">
                    <slot></slot>
                </ul>
            </div>
        </collapse-transition>

        <slot name="title"
              v-if="children.length === 0 && !$slots.default && link.path">
            <component :to="{name: link.path }"
                       @click.native="linkClick(link.path)"
                       :is="elementType(link, false)"
                       class="nav-link"
                       :class="{ menuActive: link.active }"
                       :target="link.target">
                <template v-if="addLink">
                    <span class="nav-link-text">{{ link.name }}</span>
                </template>
                <template v-else>
                    <i :class="link.icon"></i>
                    <span class="nav-link-text">{{ link.name }}</span>
                </template>
            </component>
        </slot>
    </component>
</template>
<script>
import { mapMutations } from "vuex";
import { CollapseTransition } from "vue2-transitions";
export default {
    name: "sidebar-item",
    components: {
        CollapseTransition,
    },
    props: {
        menu: {
            type: Boolean,
            default: false,
            description: "Whether the item is a menu. Most of the item it's not used and should be used only if you want to override the default behavior.",
        },
        link: {
            type: Object,
            default: () => {
                return {
                    name: "",
                    path: "",
                    children: [],
                };
            },
            description: "Sidebar link. Can contain name, path, icon and other attributes. See examples for more info",
        },
        goTest: {
            type: Function,
        },
    },
    provide() {
        return {
            addLink: this.addChild,
            removeLink: this.removeChild,
        };
    },
    inject: {
        addLink: { default: null },
        removeLink: { default: null },
        autoClose: {
            default: true,
        },
    },
    data() {
        return {
            children: [],
            collapsed: true,
        };
    },
    computed: {
        baseComponent() {
            return this.isMenu || this.link.isRoute ? "li" : "router-link";
        },
        linkPrefix() {
            if (this.link.name) {
                let words = this.link.name.split(" ");
                return words.map(word => word.substring(0, 1)).join("");
            }
        },
        isMenu() {
            return this.children.length > 0 || this.menu === true;
        },
        isActive() {
            if (this.$route && this.$route.name) {
                let matchingRoute = this.children.find(c => this.$route.name.startsWith(c.link.path));
                if (matchingRoute !== undefined) {
                    return true;
                }
            }
            return false;
        },
    },
    methods: {
        addChild(item) {
            const index = this.$slots.default.indexOf(item.$vnode);
            this.children.splice(index, 0, item);
        },
        removeChild(item) {
            const tabs = this.children;
            const index = tabs.indexOf(item);
            tabs.splice(index, 1);
        },
        elementType(link, isParent = true) {
            if (link.isRoute === false) {
                return isParent ? "li" : "a";
            } else {
                return "router-link";
            }
        },
        linkAbbreviation(name) {
            const matches = name.match(/\b(\w)/g);
            return matches.join("");
        },
        linkClick(name) {
            // this.$router.push({ name: name }).catch(err => {
            //     err;
            // });
            // this.masterShow("MasterLists");
            // this.memberShow("Lists");
            // this.setParentAgents([]);
            // this.setSendFilterData({});
            // this.setReportData([]);
            // this.setAllReportData({});
            // this.setCurrentTab([]);
            // this.setReportTabs([{ name: "全部" }]);
            // this.setSumData(null);
            // this.setComeMemberReport(false);
            if (this.autoClose && this.$sidebar && this.$sidebar.showSidebar === true) {
                this.$sidebar.displaySidebar(false);
            }
        },
        collapseMenu() {
            this.collapsed = !this.collapsed;
        },
        collapseSubMenu(link) {
            link.collapsed = !link.collapsed;
        },
    },
    mounted() {
        if (this.addLink) {
            this.addLink(this);
        }
        if (this.link.collapsed !== undefined) {
            this.collapsed = this.link.collapsed;
        }
        if (this.isActive && this.isMenu) {
            this.collapsed = false;
        }
        let self = this;
    },
    destroyed() {
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
        if (this.removeLink) {
            this.removeLink(this);
        }
    },
};
</script>
<style scoped lang="scss" scoped>
@import "src/scss/var";
.sidebar-menu-item {
    cursor: pointer;
}
// 子選單被選中時 文字顏色
.menuActive {
    color: $hot-color !important;
    font-weight: 500;
}
// 主選單被選中時的顏色
.navbar-vertical.navbar-expand-xs .navbar-nav > .nav-item > .nav-link.active {
    background-color: lighten($light-hot-color, 10%);
    border-bottom: 1px dashed $hot-color;
}
.navbar-vertical .navbar-nav .nav-link[data-toggle="collapse"][aria-expanded="true"]:after {
    color: $hot-color;
}
</style>
