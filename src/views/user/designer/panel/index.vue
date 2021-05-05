<template>
    <div>
        <div class="float-left">
            <ul class="p-0">
                <li @click="showComponent(item.value)"
                    :class="currentTab === item.value ? 'hotBtn' : 'lightBtn'"
                    class="px-2 py-2 ml-1 d-inline-block boxShadow borderRadius10"
                    v-for="(item,index) in tabs"
                    :key="index">
                    {{ item.title }}
                </li>
            </ul>
        </div>
        <h5 class="float-right grayBg text-white p-2 borderRadius10 mb-0">設計師:<span class="font-weight-bold ml-2">{{ designerName }}</span></h5>
        <div class="clearfix"></div>
        <transition name="component-fade"
                    mode="out-in">
            <component :is="checkShow">
            </component>
        </transition>
    </div>
</template>

<script>
import { mapState } from "vuex";
// 詳細資料樣板
import Detail from "./Detail.vue";
import Service from "./Service/index.vue";
export default {
    components: {
        Detail,
        Service,
    },
    computed: {
        ...mapState("designerStore", ["designerName"]),
    },
    data() {
        return {
            checkShow: "Detail",
            currentTab: "Detail",
            tabs: [
                {
                    title: "設計師介紹",
                    value: "Detail",
                },
                {
                    title: "技術項目",
                    value: "Service",
                },
            ],
        };
    },
    methods: {
        showComponent(val) {
            let self = this;
            self.checkShow = val;
            self.currentTab = val;
        },
    },
};
</script>

<style lang="scss" scoped>
.boxShadow {
    box-shadow: 0 2px 5px #969696;
}
</style>
