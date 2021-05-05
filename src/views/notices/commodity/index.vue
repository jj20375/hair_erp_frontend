<template>
    <div>
        <!-- 用來更新列表用 暫時沒有想到更好得方法 -->
        <h1 v-show="false">{{ newNoticeLastId }}</h1>
        <Lists v-loading="loading"
               @onPaginationAjax="paginationAjax"
               @onFilterSearch="filterSearch"
               @onRefresh="refresh"
               :datas="datas"
               :noticeType="'commodityForm'"
               :paginationData="paginationData"
               :currentPage="currentPage" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// 導入通知列表 樣板
import Lists from "../Lists.vue";
/**
 * UnReadNoiceTypeListsApi = 取的未讀通知分類列表
 * NoticeListsApi = 取的分類通知列表
 */
import { UnReadNoiceTypeListsApi, NoticeListsApi } from "../../../api/noticeApi";
export default {
    components: {
        Lists,
    },
    computed: {
        ...mapGetters("noticeStore", ["nowNoticeLastId"]),
        // 目前藉由判斷 nowNoticeLastId 有更新值了 重新觸發 取得列表
        newNoticeLastId() {
            let self = this;
            self.refresh();
            return self.nowNoticeLastId;
        },
    },
    data() {
        return {
            // 通知清單資料
            datas: [],
            // 預設頁數
            currentPage: 1,
            // 分頁資料
            paginationData: {
                perPage: 15,
                total: 0,
            },
            loading: false,
        };
    },
    methods: {
        ...mapActions("noticeStore", ["getNoticeNum"]),
        /**
         * 獲取過濾的搜尋條件
         * @param { type Object(物件) } filterData 搜尋過濾資料
         * @param { type Boolean(布林值) } isUnRead 判斷是否選取未讀通知列表
         */
        filterSearch(filterData, isUnRead) {
            let self = this;
            // 搜尋完後將分頁改回第一頁
            self.currentPage = 1;
            // 判斷是否選取未讀通知列表
            if(isUnRead) {
                // 取得過濾後的通知資料
                self.getList(filterData);
                return;
            }
            self.getAllList(filterData);
        },
        /**
         * 分頁切換或單頁幾筆資料呈現切換時 會觸發
         * @param { type Number(數字)
         *  如果是分頁切換 該數值 為分頁頁碼
         *  如果是一頁呈現幾筆資料的切換 該數值 為一頁幾筆資料數值 } val
         * @param { type Boolean(true or false) } pageSize 判斷是否有進行分頁切換 或者 一頁幾筆資料呈現的切換
         * @param { type Object(物件) } filterData 搜尋過濾資料
         */
        paginationAjax(val, pageSize, filterData) {
            let self = this;
            self.datas = [];
            self.currentPage = 1;
            let sendData;
            // 如果有搜尋過後 再切換分頁機制時觸發開判斷式 判斷是否有排序 key為依據
            if (Object.keys(filterData).length > 0) {
                sendData = filterData;
            } else {
                sendData = {
                    perPage: self.paginationData.perPage,
                    sort: ["id|DESC"],
                };
            }
            // 當pageSize 為 true 時 將一頁呈現幾筆值 改為傳入參數值 false 時 傳入預設的一頁輸出幾筆的值
            sendData.perPage = pageSize ? val : self.paginationData.perPage;
            // 當pageSize 為 true 時 帶入第一頁分頁 false 時 則為傳入分頁頁數值
            sendData.page = pageSize ? 1 : val;
            self.getList(sendData, pageSize);
        },
        /**
         * 取得未處理通知列表
         * @param { type Object(物件) } sendData 需要過濾的資料參數以及排序規則
         * @param { type Boolean(true or false) } pageSize 判斷是否有切換一頁呈現幾筆
         */
        async getList(sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await UnReadNoiceTypeListsApi(sendData, "sale");
                self.datas = data.data.data;
                self.currentPage = data.data.current_page;
                self.paginationData.total = data.data.total;
                // 當pageSize 為 true 時 將預設一頁呈現幾筆值 改為傳入參數值
                if (pageSize) {
                    self.paginationData.perPage = data.data.per_page;
                }
                self.loading = false;
            } catch (err) {
                self.loading = false;
                self.$message({
                    type: "error",
                    message: "取的未處理買賣通知列表失敗",
                });
            }
        },
        /**
         * 取得全部通知列表
         * @param { type Object(物件) } sendData 需要過濾的資料參數以及排序規則
         * @param { type Boolean(true or false) } pageSize 判斷是否有切換一頁呈現幾筆
         */
        async getAllList(sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await NoticeListsApi(sendData, "sale");
                self.datas = data.data.data;
                self.currentPage = data.data.current_page;
                self.paginationData.total = data.data.total;
                // 當pageSize 為 true 時 將預設一頁呈現幾筆值 改為傳入參數值
                if (pageSize) {
                    self.paginationData.perPage = data.data.per_page;
                }
                self.loading = false;
            } catch (err) {
                self.loading = false;
                self.$message({
                    type: "error",
                    message: "取的未處理買賣通知列表失敗",
                });
            }
        },
        // 重置資料
        refresh() {
            let self = this;
            self.getList({ perPage: self.paginationData.perPage, sort: ["id|DESC"] });
        },
    },
    created() {
        let self = this;
        self.refresh();
    },
};
</script>