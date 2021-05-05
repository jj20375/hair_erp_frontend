<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right"
                       v-if="chekcHome">
            <transition-group name="breadcrumb">
                <!-- 防止面包屑导航出现 首页/首页， v-if="route.name!='home'" -->
                <el-breadcrumb-item v-for="(route, i) in crumbList"
                                    :key="route.name"
                                    :to="{ name: route.name }"
                                    
                                    :class="{ 'is-last-link': i == crumbList.length - 1 }">
                    {{ route.meta.text }}
                </el-breadcrumb-item>
            </transition-group>
        </el-breadcrumb>
    </div>
</template>
<style lang="scss">
@import "src/scss/var";
.el-breadcrumb__inner.is-link {
    font-weight: normal !important;
}
.el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: $second-color !important;
    font-weight: bold !important;
}
</style>
<script>
import { mapState } from "vuex";
export default {
    computed: {
        ...mapState("breadcrumbStore", ["crumbList"]),
        ...mapState("i18nStore", ["langData"]),
        // 判斷是否在首頁 麵包屑不能出現在首頁
        chekcHome() {
            let self = this;
            return self.$route.name != "dashboard" ? true : false;
        },
    },
};
</script>
