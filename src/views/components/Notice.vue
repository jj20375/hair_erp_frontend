<template>
    <li class="position-relative"
        style="top:0; right: 10px;">
        <span style="right: 0; bottom: 15px;"
              class="position-absolute badge badge-md badge-circle badge-danger border-white">{{ nowNoticeNum }}</span>
        <b-dropdown style="right: 30px; bottom: 15px;"
                    variant="link"
                    no-caret
                    menu-class="mt-4"
                    toggle-class="text-decoration-none text-white p-0 nav-item position-absolute"
                    @toggle="getNoticeTypeNumList">
            <template v-slot:button-content>
                <i style="font-size: 20px;"
                   class="ni ni-bell-55 text-white"></i>
            </template>
            <b-dropdown-item>
                <!-- Dropdown header -->
                <div class="px-3 py-3">
                    <h6 class="text-sm text-muted m-0">
                        未讀訊息數量
                        <strong class="text-primary">{{ nowNoticeNum }}</strong>
                    </h6>
                </div>
                <!-- List group -->
                <div class="list-group list-group-flush">
                    <router-link :to="{name:''}"
                                 v-for="(item,index) in datas"
                                 :key="index"
                                 class="list-group-item list-group-item-action">
                        <div class="row align-items-center">
                            <div class="col ml--2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4 class="mb-0 text-sm">
                                            {{ item.noteType }}
                                        </h4>
                                    </div>
                                    <div class="text-right text-muted">
                                        <span class="badge badge-md badge-circle badge-primary border-white">{{ item.num }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
                <!-- View all -->
                <!-- <router-link :to="{name: 'noticeControl_commodity'}"
                             class="dropdown-item text-center text-primary font-weight-bold py-3">查看全部</router-link> -->
            </b-dropdown-item>
        </b-dropdown>
    </li>
</template>

<script>
// 導入下拉選單組件
import BaseDropdown from "../../components/BaseDropdown.vue";
export default {
    components: {
        BaseDropdown,
    },
    computed: {
    },
    data() {
        return {
            datas: [],
        };
    },
    filters: {
        stringLength(val) {
            return val.substring(0, 15) + "...";
        },
    },
};
</script>