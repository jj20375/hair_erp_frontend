<template>
    <div>
        <base-header :type="'hotBg secondBorder borderTopWidth2'" class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-12">
                    <Breadcrumb class="breadcrumb" />
                    <h6 class="h2 text-white d-inline-block mb-0">
                       {{ $route.meta.text }}
                    </h6>
                </div>
            </div>
        </base-header>
        <div class="container-fluid mt--5">
            <div class="row starter-page">
                <card no-body class="col-12 shadow-lg">
                    <!-- <h1>{{ langData.leftMenu[this.$route.name].name }}</h1> -->
                    <router-view class="mt-2 mb-2"></router-view>
                </card>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Breadcrumb from "../../components/Breadcrumb.vue";
export default {
    components: {
        Breadcrumb,
    },
    computed: {
        ...mapState("i18nStore", ["langData"]),
    },
    methods: {
        ...mapActions("setIntervalStore", ["getSetIntervalStart"]),
    },
    beforeRouteLeave(to, from, next) {
        // location.reload();
        return next();
    },
};
</script>
