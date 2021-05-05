<template>
    <div>
        <button class="darkBtn borderRadius10 px-3 py-2"
                v-if="$route.meta.params.Create==1"
                @click="clickDialog()">
            新增技術
        </button>
        <el-table :data="datas"
                  header-cell-class-name="bg-dark text-white text-nowrap"
                  v-loading="loading"
                  border
                  class="w-100 mt-2">
            <el-table-column label="#"
                             type="index"
                             :index="indexMethod"
                             sortable
                             width="100">
            </el-table-column>
            <el-table-column min-width="150"
                             label="名稱">
                <template v-slot="scope">
                    <div class="font-weight-bold hot-color">{{ scope.row.name }}</div>
                </template>
            </el-table-column>
            <el-table-column min-width="150"
                             label="分類">
                <template v-slot="scope">
                    <div class="font-weight-bold hot-color">名稱:<span class="ml-2">{{ scope.row.store_service.category.name }}</span></div>
                    <div class="font-weight-bold red-color">代碼:<span class="ml-2">{{ scope.row.store_service.category.key }}</span></div>
                </template>
            </el-table-column>
            <el-table-column min-width="150"
                             label="價位">
                <template v-slot="scope">
                    <div class="font-weight-bold red-color">{{ scope.row.store_service.store_service_info !== null ? scope.row.store_service.store_service_info.price : '尚未設定' }}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="150">
                <template v-slot="scope">
                    <button type="button"
                            class="hotBtn-outline borderRadius10 px-2 py-2 font-lg"
                            v-if="$route.meta.params.Update === 1"
                            @click="onEdit(scope.row)">
                        <i class="fad fa-money-check-edit"></i>
                    </button>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-md-left text-center">
            <MyPagination :paginationData="paginationData"
                          :currentPage="currentPage"
                          @onGetDatas="paginationAjax" />
        </div>
        <Form :formId="formId"
              :checkEdit="checkEdit"
              :showDialog="showDialog"
              @onRefresh="resetData"
              @onCloseDialog="closeDialog" />
    </div>
</template>

<style></style>
<script>
// 新增或更新表單
import Form from "./Form.vue";
/**
 * DesignerServiceListsApi = 取得服務列表api
 */
import { DesignerServiceListsApi } from "../../../../../api/designerApi";
// 導入分頁組件
import MyPagination from "../../../../components/MyPagination.vue";
export default {
    components: {
        Form,
        MyPagination,
    },
    data() {
        return {
            // 判斷是否關閉彈窗
            showDialog: false,
            // 群組列表資料
            datas: [],
            // 判斷目前是否為更新表單非新增
            checkEdit: false,
            // 取得更新資料 id
            formId: null,
            // 搜尋過濾時送出的物件
            filterData: {},
            // 當前頁面
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
        // 自定義索引
        indexMethod(val) {
            let self = this;
            return (
                (self.currentPage - 1) * self.paginationData.perPage + val + 1
            );
        },
        // 重置資料
        resetData() {
            let self = this;
            self.getLists(self.$route.params.designerId, {sort: ["service_id|DESC"]});
        },
        // 點擊新增時看起的談窗
        clickDialog() {
            let self = this;
            self.showDialog = true;
        },
        // 關閉彈窗
        closeDialog() {
            let self = this;
            self.showDialog = false;
            self.checkEdit = false;
        },
        /**
         * 更新表單事件
         * @param { type Object(物件) } data 選中列表資料
         */
        onEdit(data) {
            let self = this;
            self.showDialog = true;
            self.checkEdit = true;
            // 選擇到的分類id
            self.formId = data.service_id;
        },
        /**
         * 分頁切換或單頁幾筆資料呈現切換時 會觸發
         * @param { type Number(數字)
         *  如果是分頁切換 該數值 為分頁頁碼
         *  如果是一頁呈現幾筆資料的切換 該數值 為一頁幾筆資料數值 } val
         * @param { type Boolean(true or false) } pageSize 判斷是否有進行分頁切換 或者 一頁幾筆資料呈現的切換
         */
        paginationAjax(val, pageSize) {
            let self = this;
            self.datas = [];
            self.currentPage = 1;
            let sendData;
            // 如果有搜尋過後 再切換分頁機制時觸發開判斷式 判斷是否有排序 key為依據
            if (Object.keys(self.filterData).length > 0) {
                sendData = self.filterData;
            } else {
                sendData = {
                    sort: ["service_id|DESC"],
                };
            }
            // 當pageSize 為 true 時 將一頁呈現幾筆值 改為傳入參數值 false 時 傳入預設的一頁輸出幾筆的值
            sendData.perPage = pageSize ? val : self.paginationData.perPage;
            // 當pageSize 為 true 時 帶入第一頁分頁 false 時 則為傳入分頁頁數值
            sendData.page = pageSize ? 1 : val;
            self.getLists(self.$route.params.designerId, sendData, pageSize);
        },
        /**
         * 取得技術項目列表
         * @param { type Object(物件) } sendData 需要過濾的資料參數以及排序規則
         * @param { type Boolean(true or false) } pageSize 判斷是否有切換一頁呈現幾筆
         * @param { type String or Number(字串或數字) } designerId 設計師id
         */
        async getLists(designerId, sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await DesignerServiceListsApi(designerId,sendData);
                self.loading = false;
                self.datas = data.data.data;
                self.currentPage = data.data.current_page;
                self.paginationData.total = data.data.total;
                // 當pageSize 為 true 時 將預設一頁呈現幾筆值 改為傳入參數值
                if (pageSize) {
                    self.paginationData.perPage = data.data.per_page;
                }
                self.loading = false;
            } catch (err) {
                console.log(err);
                self.loading = false;
                self.$message({
                    type: "error",
                    message: "取得技術列表失敗",
                });
            }
        },
    },
    created() {
        let self = this;
        self.getLists(self.$route.params.designerId, {sort: ["service_id|DESC"]});
    },
};
</script>
