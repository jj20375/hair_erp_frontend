<template>
    <Lists @onFilterSearch="filterSearch"
           @onReadAllNoticeActive="readAllNoticeActive"
           @onGetUnReadNoticeList="getUnReadNoticeList"
           @onPaginationAjax="paginationAjax"
           @onResetData="resetData"
           @onSubmit="onSubmit"
           :datas="datas"
           :noticeType="'withdrawal'"
           :paginationData="paginationData"
           :currentPage="currentPage" />

</template>

<script>
import Lists from "./Lists.vue";
/*
 * GetNoiceTypeListsApi = 獲取 所有分類通知訊息清單 api
 * GetUnReadNoiceTypeListsApi = 獲取 未讀的分類通知訊息清單 api
 * UpdateNoticeToAllReadedApi = 將分類通知全部更新為已讀
 * HandleNoticeApi = 更新通知審核方法
 * UpdateNoticeToReadedApi = 將選到的通知更新為已讀 api
 */
import { GetNoiceTypeListsApi, GetUnReadNoiceTypeListsApi, UpdateNoticeToAllReadedApi, UpdateNoticeToReadedApi, HandleNoticeApi } from "../../api/noticeApi";
// 導入sweat alert 套件
import Swal from "sweetalert2";
export default {
    components: {
        Lists,
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
                total: 1000,
            },
            // 判斷是否拉取未讀取資料
            checkSeeUnReadNotice: true,
            // 搜尋過濾條件
            filterData: {},
        };
    },
    methods: {
        /**
         * 表單發送事件
         * @param { 對應通知資料 } data
         * @param { 需要發送的表單值 } form
         */
        onSubmit(data, form) {
            let self = this;
            Object.keys(data.actData.sendData).map((objKey, index) => {
                form[objKey] = data.actData.sendData[objKey];
            });
            Swal.fire({
                title: "請問是否確認審核?",
                text: "已審核後將不會再顯示在通知上也無法再變更審核狀態",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "審核!",
                cancelButtonText: "取消",
            }).then(result => {
                if (result.value) {
                    HandleNoticeApi(data.actData.url, data.actData.method, form)
                        .then(({ data }) => {
                            self.$message({
                                type: "success",
                                message: "審核成功",
                            });
                        })
                        .catch(err => {
                            self.$message({
                                type: "error",
                                message: "審核失敗",
                            });
                        });

                    UpdateNoticeToReadedApi({ noteIds: [data.id] })
                        .then(() => {
                            self.resetData();
                            self.$message({
                                type: "success",
                                message: "更新已讀取成功",
                            });
                        })
                        .catch(err => {
                            self.$message({
                                type: "error",
                                message: "更新已讀取失敗",
                            });
                        });
                }
            });
        },
        // 重置資料
        resetData() {
            let self = this;
            if (self.checkSeeUnReadNotice) {
                self.getUnReadNoticeList({ sort: "created_at|DESC" });
                return;
            }
            self.getNoticeList({ sort: "created_at|DESC" });
        },
        // 獲取過濾的搜尋條件
        filterSearch(filterData, checkSeeUnReadNotice) {
            let self = this;
            // 搜尋完後將分頁改回第一頁
            self.currentPage = 1;
            // 將判斷是否拉取未讀通知訊息的條件更新成搜尋過濾條件傳回來值
            self.checkSeeUnReadNotice = checkSeeUnReadNotice;
            // 判斷是否拉取未讀通知訊息
            if (checkSeeUnReadNotice) {
                self.getUnReadNoticeList(filterData);
                return;
            }
            self.getNoticeList(filterData);
        },
        /**
         * 分頁切換或單頁幾筆資料呈現切換時 會觸發
         * @param { type Number(數字)
         *  如果是分頁切換 該數值 為分頁頁碼
         *  如果是一頁呈現幾筆資料的切換 該數值 為一頁幾筆資料數值 } val
         * @param { type Boolean(true or false) } pageSize 判斷是否有進行分頁切換 或者 一頁幾筆資料呈現的切換
         */
        paginationAjax(val, pageSize, filterData) {
            let self = this;
            self.datas = [];
            self.currentPage = 1;
            let setData;
            // 如果有搜尋過後 再切換分頁機制時觸發開判斷式 判斷是否有排序 key為依據
            if (filterData.hasOwnProperty("sort")) {
                setData = filterData;
            } else {
                setData = {
                    sort: "created_at|DESC",
                };
            }
            // 當pageSize 為 true 時 將一頁呈現幾筆值 改為傳入參數值 false 時 傳入預設的一頁輸出幾筆的值
            setData.per_page = pageSize ? val : self.paginationData.perPage;
            // 當pageSize 為 true 時 帶入第一頁分頁 false 時 則為傳入分頁頁數值
            setData.page = pageSize ? 1 : val;
            if (self.checkSeeUnReadNotice) {
                self.getUnReadNoticeList(setData, pageSize);
                return;
            }
            self.getNoticeList(setData, pageSize);
        },
        // 塞入資料
        addData(data, pageSize) {
            let self = this;
            self.datas = data.data;
            self.currentPage = data.current_page;
            self.paginationData.total = data.total;
            // 當pageSize 為 true 時 將預設一頁呈現幾筆值 改為傳入參數值
            if (pageSize) {
                self.paginationData.perPage = data.per_page;
            }
        },
        // 獲取通知訊息列表
        getNoticeList(setData, pageSize = false) {
            let self = this;
            // 要傳入的過濾分類陣列
            setData.noteType = ["pay", "payCheck"];
            GetNoiceTypeListsApi(setData)
                .then(({ data }) => {
                    self.addData(data, pageSize);
                })
                .catch(err => {
                    self.$message({
                        type: "error",
                        message: "取得通知訊息列表失敗",
                    });
                });
        },
        // 取得未讀的通知訊息列表
        getUnReadNoticeList(setData, pageSize = false) {
            let self = this;
            // 要傳入的過濾分類陣列
            setData.noteType = ["pay", "payCheck"];
            GetUnReadNoiceTypeListsApi(setData)
                .then(({ data }) => {
                    self.addData(data, pageSize);
                })
                .catch(err => {
                    self.$message({
                        type: "error",
                        message: "取得未讀通知訊息列表失敗",
                    });
                });
        },
        // 更新為全部已讀方法
        readAllNoticeActive() {
            let self = this;
            UpdateNoticeToAllReadedApi({ noteType: ["pay", "payCheck"] })
                .then(({ data }) => {
                    self.$message({
                        type: "success",
                        message: "更新全部已讀成功",
                    });
                    if (self.checkSeeUnReadNotice) {
                        self.getUnReadNoticeList({ noteType: ["pay", "payCheck"], sort: "created_at|DESC" });
                        return;
                    }
                    self.getNoticeList({ noteType: ["pay", "payCheck"], sort: "created_at|DESC" });
                })
                .catch(err => {
                    self.$message({
                        type: "error",
                        message: "更新為全部已讀失敗",
                    });
                });
        },
    },
    created() {
        let self = this;
    },
};
</script>