<template>
    <div>
        <button class="darkBtn borderRadius10 px-3 py-2"
                v-if="$route.meta.params.Create == 1 && (user.group.group_code !== 'SYSTEM' || $route.params.operatorId !== undefined)"
                @click="onCreate()">
            新增進貨訂單
        </button>
        <div class="row align-items-center">
            <div class="col-md-6">
                <label class="d-block"
                       for="">日期區間</label>
                <MyDatePicker ref="myDatePicker"
                              @onSelectDate="checkSelectDate" />
            </div>
            <div class="col-md-3">
                <label for="">系統訂單號</label>
                <el-input placeholder="請輸入系統訂單號"
                          v-model="searchOrder"
                          clearable
                          prefix-icon="el-icon-search">
                </el-input>
            </div>
            <div class="col-md-3">
                <label for="">客製化訂單號</label>
                <el-input placeholder="請輸入客製化訂單號"
                          v-model="searchOperatorOrder"
                          clearable
                          prefix-icon="el-icon-search">
                </el-input>
            </div>
            <div class="col-md-12 mt-2 mb-2">
                <button class="secondBtn borderRadius10 px-3 py-2"
                        @click="filterSearch()">
                    <i class="fas fa-search"></i>搜尋
                </button>
                <button class="hotBtn-outline ml-2 borderRadius10 px-3 py-2"
                        @click="resetData()">
                    <i class="fas fa-redo-alt"></i>重置
                </button>
            </div>
        </div>
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
                             label="進貨訂單">
                <template v-slot="scope">
                    <div class="font-weight-bold hot-color">系統單號:<span class="ml-2">{{ scope.row.order_number }}</span></div>
                    <div class="font-weight-bold gray-color">客製化訂單號:<span class="ml-2">{{ scope.row.order_operator_number }}</span></div>
                    <div class="font-weight-bold red-color">進貨日期:<span class="ml-2">{{ scope.row.order_date | formatDate }}</span></div>
                </template>
            </el-table-column>
            <el-table-column min-width="150"
                             label="訂單標題">
                <template v-slot="scope">
                    <div class="font-weight-bold hot-color">{{ scope.row.title }}</div>
                </template>
            </el-table-column>
            <el-table-column min-width="150"
                             label="總金額">
                <template v-slot="scope">
                    <div class="font-weight-bold red-color">{{ scope.row.total | formatCurrency }}</div>
                </template>
            </el-table-column>
            <el-table-column min-width="150"
                             label="進貨訂單創建者"
                             v-if="user.group.group_code === 'SYSTEM'">
                <template v-slot="scope">
                    <div class="font-weight-bold red-color">帳號:<span class="ml-2">{{ scope.row.user_operator.account }}</span></div>
                    <div class="font-weight-bold hot-color">名稱:<span class="ml-2">{{ scope.row.user_operator.name }}</span></div>
                </template>
            </el-table-column>
            <el-table-column min-width="150"
                             label="創建與更新時間">
                <template v-slot="scope">
                    <div class="font-weight-bold red-color">創建時間:<span class="ml-2">{{ scope.row.created_at | formatDateTime }}</span></div>
                    <div class="font-weight-bold hot-color">更新時間:<span class="ml-2">{{ scope.row.updated_at | formatDateTime }}</span></div>
                </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="150">
                <template v-slot="scope">
                    <button type="button"
                            v-if="$route.meta.params.Update === 1"
                            class="hotBtn-outline borderRadius10 px-2 py-2 font-lg"
                            @click="onEdit(scope.row)">
                        <i class="fad fa-money-check-edit"></i>
                    </button>
                </template>
            </el-table-column>
        </el-table>
        <MyPagination :paginationData="paginationData"
                      :currentPage="currentPage"
                      @onGetDatas="paginationAjax" />
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
// 時間套件
import moment from "moment";
// 導入日期組建
import MyDatePicker from "../../components/MyDatePicker.vue";
// 導入日期套件需要用到的方法
import DatePickerMixin from "../../../mixins/DatePickerService";
// 導入分頁組件
import MyPagination from "../../components/MyPagination.vue";
// 導入搜尋條件判斷式
import { checkHaveSelectData } from "../../../service/anyService";
/**
 * PurchaseOrderListApi = 取得進貨訂單列表api
 * PurchaseOrderListByIdApi = 取得指定id進貨訂單列表api
 */
import { PurchaseOrderListApi, PurchaseOrderListByIdApi } from "../../../api/purchaseOrderApi";

export default {
    mixins: [DatePickerMixin],
    components: {
        MyDatePicker,
        MyPagination
    },
    computed: {
        ...mapState("userStore", ["user"]),
        // 取得每個登入身份使用者的管理者id
        ...mapGetters("userStore", ["getOperatorId"])
    },
    data() {
        return {
            // 判斷是否關閉彈窗
            showDialog: false,
            // 群組列表資料
            datas: [],
            // 搜尋條件
            filterData: {},
            // 搜尋訂單號
            searchOrder: null,
            // 搜尋客製化訂單號
            searchOperatorOrder: null,
            // 分頁機制預設值
            paginationData: {
                perPage: 15,
                total: 0
            },
            // 預設頁數
            currentPage: 1,
            loading: false
        };
    },
    methods: {
        // 自定義索引
        indexMethod(val) {
            let self = this;
            return (self.currentPage - 1) * self.paginationData.perPage + val + 1;
        },
        // 重置資料
        resetData() {
            let self = this;
            self.filterData = {};
            // 清空系統訂單號
            self.searchOrder = null;
            // 清空客製化訂單號
            self.searchOperatorOrder = null;
            // 清空開始時間
            self.startTime = null;
            // 清空結束時間
            self.endTime = null;
            // 清空日期資料
            self.dateValue = null;
            // 清空日期模組資料
            self.$refs.myDatePicker.clearSelectedDate();
            if (self.$route.params.operatorId !== undefined) {
                self.getListsById({
                    operatorId: self.$route.params.operatorId,
                    sort: ["purchase_order_id|DESC"]
                });
            } else {
                self.getLists({ sort: ["purchase_order_id|DESC"] });
            }
        },
        // 搜尋條件
        filterSearch() {
            let self = this;
            // 判斷是否有值 有值就帶入搜尋條件
            checkHaveSelectData(["purchase_order_id|DESC", self.searchOrder, self.searchOperatorOrder, self.startTime, self.endTime], ["sort", "order_number", "order_operator_number", "start|order_date", "end|order_date"], self.filterData);
            // 搜尋完後將分頁改回第一頁
            self.currentPage = 1;
            // 搜尋完後將分頁改回第一頁
            self.filterData.page = 1;
            if (self.$route.params.operatorId !== undefined) {
                self.filterData.operatorId = self.$route.params.operatorId;
                self.getListsById(self.filterData);
            } else {
                self.getLists(self.filterData);
            }
        },
        /**
         * 新增表單事件
         */
        onCreate() {
            let self = this;
            let operatorId = null;
            // 如果是系統身份時 抓取網址上 管理者id
            if (self.user.group.group_code === "SYSTEM") {
                operatorId = self.$route.params.operatorId;
            } else {
                operatorId = self.getOperatorId;
            }
            self.$router.push({
                name: "orderControl_purchase_order_data",
                params: { operatorId }
            });
        },
        /**
         * 更新表單事件
         * @param { type Object(物件) } data 選中列表資料
         */
        onEdit(data) {
            let self = this;
            self.$router.push({
                name: "orderControl_purchase_order_data",
                params: {
                    orderNumber: data.order_number,
                    operatorId: data.operator_id
                }
            });
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
                    sort: ["purchase_order_id|DESC"]
                };
            }
            // 當pageSize 為 true 時 將一頁呈現幾筆值 改為傳入參數值 false 時 傳入預設的一頁輸出幾筆的值
            sendData.perPage = pageSize ? val : self.paginationData.perPage;
            // 當pageSize 為 true 時 帶入第一頁分頁 false 時 則為傳入分頁頁數值
            sendData.page = pageSize ? 1 : val;
            if (self.$route.params.operatorId !== undefined) {
                sendData.operatorId = self.$route.params.operatorId;
                self.getListsById(sendData, pageSize);
            } else {
                self.getLists(sendData, pageSize);
            }
        },
        /**
         * 取得進貨訂單列表
         * @param { type Object(物件) } sendData 需要過濾的資料參數以及排序規則
         * @param { type Boolean(true or false) } pageSize 判斷是否有切換一頁呈現幾筆
         */
        async getLists(sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await PurchaseOrderListApi(sendData);
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
                    message: "取得進貨訂單列表失敗"
                });
            }
        },
        /**
         * 取得指定id專屬進貨訂單列表
         * @param { type Object(物件) } sendData 需要過濾的資料參數以及排序規則
         * @param { type Boolean(true or false) } pageSize 判斷是否有切換一頁呈現幾筆
         */
        async getListsById(sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await PurchaseOrderListByIdApi(sendData);
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
                    message: "取得進貨訂單列表失敗"
                });
            }
        },
        // 如果有搜尋日期實就觸發
        checkSelectDate(val) {
            let self = this;
            self.dateValue = val;
            if (self.dateValue !== null) {
                self.startTime = moment(self.dateValue[0]).format("YYYY-MM-DD HH:mm:ss");
                self.endTime = moment(self.dateValue[1]).format("YYYY-MM-DD HH:mm:ss");
            }
        }
    },
    watch: {
        "$route.params.operatorId": function (val) {
            let self = this;
            if (val !== undefined) {
                self.getListsById({
                    operatorId: self.$route.params.operatorId,
                    sort: ["purchase_order_id|DESC"]
                });
            } else {
                self.getLists({ sort: ["purchase_order_id|DESC"] });
            }
        }
    },
    created() {
        let self = this;
        if (self.$route.params.operatorId !== undefined) {
            self.getListsById({
                operatorId: self.$route.params.operatorId,
                sort: ["purchase_order_id|DESC"]
            });
        } else {
            self.getLists({ sort: ["purchase_order_id|DESC"] });
        }
        // 判斷非系統身份 且網址上沒有傳送 operatorId參數時
        if (self.user.group.group_code !== "SYSTEM" && self.$route.params.operatorId === undefined) {
            self.operatorId = self.getOperatorId;
        } else {
            self.operatorId = self.$route.params.operatorId;
        }
    }
};
</script>
