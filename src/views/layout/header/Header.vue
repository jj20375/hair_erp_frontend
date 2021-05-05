<template>
    <base-nav container-classes="container-fluid"
              class="navbar-top border-bottom navbar-expand"
              :class="{ 'hotBg blackBlueBorder borderBottomWidth2 navbar-dark': type === 'default' }">
        <!-- Search form -->
        <form class="navbar-search form-inline mr-sm-3"
              :class="{
                'navbar-search-light': type === 'default',
                'navbar-search-dark': type === 'light',
            }"
              id="navbar-search-main">
            <div class="form-group mb-0">
                <div class="input-group input-group-alternative input-group-merge">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-search"></i></span>
                    </div>
                    <input class="form-control"
                           placeholder="Search"
                           type="text" />
                </div>
            </div>
            <button type="button"
                    class="close"
                    data-action="search-close"
                    data-target="#navbar-search-main"
                    aria-label="Close">
                <!-- <span aria-hidden="true">×</span> -->
            </button>
        </form>
        <!-- Navbar links -->
        <ul class="navbar-nav align-items-center ml-md-auto">
            <li class="nav-item d-xl-none">
                <!-- Sidenav toggler -->
                <div class="pr-3 sidenav-toggler"
                     :class="{
                        active: $sidebar.showSidebar,
                        'sidenav-toggler-dark': type === 'default',
                        'sidenav-toggler-light': type === 'light',
                    }"
                     @click="toggleSidebar">
                    <div class="sidenav-toggler-inner">
                        <i class="sidenav-toggler-line"></i>
                        <i class="sidenav-toggler-line"></i>
                        <i class="sidenav-toggler-line"></i>
                    </div>
                </div>
            </li>
            <li class="nav-item d-sm-none">
                <a class="nav-link"
                   href="#"
                   data-action="search-show"
                   data-target="#navbar-search-main">
                    <i class="ni ni-zoom-split-in"></i>
                </a>
            </li>
            <!-- 通知功能組件 -->
            <Notice />
            <base-dropdown class="nav-item"
                           tag="li"
                           title-classes="nav-link"
                           title-tag="a"
                           icon="ni ni-world-2"
                           menu-classes="dropdown-menu-right py-0 overflow-hidden">
                <template>
                    <div class="px-3">
                        <span class="align-middle">目前語系</span>
                        <country-flag class="align-middle"
                                      :country="showLang(locale)"
                                      size="normal"></country-flag>
                    </div>
                    <div class="list-group list-group-flush"
                         v-for="(item, index) in langs"
                         :key="index">
                        <a href="#!"
                           v-show="item.icon !== localeLang"
                           @click.prevent="getLang(item.lang)"
                           class="list-group-item p-1">
                            <div class="row align-items-center">
                                <div class="col-auto">
                                    <country-flag class="align-middle"
                                                  :country="item.icon"
                                                  size="normal"></country-flag>
                                </div>
                                <div class="col ml--2">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h4 class="mb-0"
                                                style="font-size: 8px;">
                                                {{item.name}}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </template>
            </base-dropdown>

        </ul>
        <ul class="navbar-nav align-items-center ml-auto ml-md-0">
            <base-dropdown menu-on-right
                           class="nav-item"
                           tag="li"
                           title-tag="a"
                           title-classes="nav-link pr-0">
                <a href="#"
                   class="nav-link pr-0"
                   @click.prevent
                   slot="title-container">
                    <div class="media align-items-center">
                        <span class="avatar avatar-sm rounded-circle">
                            <img alt="Image placeholder"
                                 src="https://demos.creative-tim.com/vue-argon-dashboard-pro//img/theme/team-4.jpg" />
                        </span>
                        <div class="media-body ml-2 d-none d-lg-block">
                            <span class="mb-0 text-sm font-weight-bold">{{ userName }}</span>
                        </div>
                    </div>
                </a>

                <template>
                    <div class="dropdown-header noti-title">
                        <h6 class="text-overflow m-0">Welcome!</h6>
                    </div>
                    <router-link class="dropdown-item"
                                 :to="{name: 'userUpdate'}">
                        <i class="ni ni-single-02"></i>
                        <span>個人資料</span>
                    </router-link>
                    <div class="dropdown-divider"></div>
                    <a href="#!"
                       class="dropdown-item"
                       @click.prevent="logOut()">
                        <i class="ni ni-user-run"></i>
                        <span>登出</span>
                    </a>
                </template>
            </base-dropdown>
        </ul>
        <!-- <audio ref="audioNotice"
               controls
               hidden
               muted>
            <source src="../../../assets/mp3/notice.mp3"
                    type="audio/mpeg">
        </audio>
        <button class="btn btn-secondary btn-sm ml-2" id="playAudio" @click="playBtn($event)">開啟音效&nbsp;<i class="fas fa-music"></i></button> -->
    </base-nav>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { getStorage } from "../../../service/localStorage";
import { LogOutApi } from "../../../api/userApi";
import { CollapseTransition } from "vue2-transitions";
import { BaseNav, Modal } from "../../../components/index";
import BaseDropdown from "../../../components/BaseDropdown.vue";
// 通知功能模板
import Notice from "../../components/Notice.vue";

export default {
    components: {
        CollapseTransition,
        BaseNav,
        Modal,
        BaseDropdown,
        Notice,
    },
    props: {
        type: {
            type: String,
            default: "default", // default|light
            description: "Look of the dashboard navbar. Default (Green) or light (gray)",
        },
    },
    computed: {
        routeName() {
            const { name } = this.$route;
            return this.capitalizeFirstLetter(name);
        },
        // 取得目前使用語系
        ...mapState("i18nStore", { locale: "locale" }),
        // 取得可選擇語係
        ...mapGetters("i18nStore", ["langs"]),
        // 取得登入者資料
        ...mapState("userStore", ["user"]),
        // 用來呈現登入者名稱
        userName() {
            let self = this;
            if (getStorage("token") && self.user !== null) {
                return self.user.userable.name;
            } else {
                return "";
            }
        },
        // 判斷目前使用語系呈現對應icon
        localeLang() {
            let self = this;
            switch (self.locale) {
                case "en":
                    return "us";
                    break;
                default:
                    return self.locale;
                    break;
            }
        },
    },
    data() {
        return {
            activeNotifications: false,
            showMenu: false,
            searchModalVisible: false,
            searchQuery: "",
        };
    },
    methods: {
        ...mapActions("userStore", ["logOutUser"]),
        ...mapActions("i18nStore", ["getLang"]),
        ...mapActions("setIntervalStore", ["getSetIntervalStart"]),
        capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        toggleNotificationDropDown() {
            this.activeNotifications = !this.activeNotifications;
        },
        closeDropDown() {
            this.activeNotifications = false;
        },
        toggleSidebar() {
            this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
        },
        hideSidebar() {
            this.$sidebar.displaySidebar(false);
        },
        logOut() {
            let self = this;
            self.logOutUser();
            self.$router.push({ name: "login" });
            location.reload();
        },
        showLang(val) {
            let self = this;
            if (val === "en") {
                return "us";
            }
            return self.locale;
        },

        playBtn() {
            let self = this;
            let playAudio = self.$refs.audioNotice;
            playAudio.play();
        },
        
    },
    created() {
        let self = this;
        self.getSetIntervalStart();
    },
};
</script>
