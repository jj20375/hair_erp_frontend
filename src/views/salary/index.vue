<template>
    <div>
        <button class="darkBtn borderRadius10 px-3 py-2"
                v-if="$route.meta.params.Create == 1 && (user.group.group_code !== 'SYSTEM' || $route.params.operatorId !== undefined)"
                @click="clickDialog()">
            新增薪水
        </button>
        <div class="row align-items-center">
            <div class="col-md-4">
                <label for="">員工名稱</label>
                <el-input placeholder="請輸入員工名稱"
                          v-model="searchName"
                          clearable
                          prefix-icon="el-icon-search">
                </el-input>
            </div>
            <div class="col-md-4">
                <label for="">員工帳號</label>
                <el-input placeholder="請輸入員工帳號"
                          v-model="searchAccount"
                          clearable
                          prefix-icon="el-icon-search">
                </el-input>
            </div>
            <div class="col-md-4">
                <label for="">員工薪水</label>
                <el-input placeholder="請輸入員工薪水"
                          v-model="searchPay"
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
                             label="名稱">
                <template v-slot="scope">
                    <div class="font-weight-bold hot-color">{{ scope.row.name }}</div>
                </template>
            </el-table-column>
            <el-table-column min-width="150"
                             label="帳號">
                <template v-slot="scope">
                    <div class="font-weight-bold gray-color">{{ scope.row.account }}</div>
                </template>
            </el-table-column>
            <el-table-column min-width="150"
                             label="薪水">
                <template v-slot="scope">
                    <div class="font-weight-bold hot-color">薪水:<span class="ml-2">{{ scope.row.pay | formatCurrency }}</span></div>
                </template>
            </el-table-column>
            <el-table-column min-width="150"
                             label="薪水創建者"
                             v-if="user.group.group_code === 'SYSTEM'">
                <template v-slot="scope">
                    <div class="font-weight-bold red-color">帳號:<span class="ml-2">{{ scope.row.salaryable.user_operator.account }}</span></div>
                    <div class="font-weight-bold hot-color">名稱:<span class="ml-2">{{ scope.row.salaryable.user_operator.name }}</span></div>
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
        <Form :formAccount="formAccount"
              :checkEdit="checkEdit"
              :showDialog="showDialog"
              :operatorId="operatorId"
              @onRefresh="resetData"
              @onCloseDialog="closeDialog" />
        <MyPagination :paginationData="paginationData"
                      :currentPage="currentPage"
                      @onGetDatas="paginationAjax" />
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
// 導入 swwetalert2 套件
import Swal from "sweetalert2";
// 時間套件
import moment from "moment";
// 導入分頁組件
import MyPagination from "../components/MyPagination.vue";
// 導入搜尋條件判斷式
import { checkHaveSelectData } from "../../service/anyService";
// 新增或更新表單
import Form from "./Form.vue";
/**
 * SalaryListApi = 取得薪水列表api
 * SalaryListByIdApi = 取得指定id薪水列表api
 */
import { SalaryListApi, SalaryListByIdApi } from "../../api/salaryApi.js";

export default {
    components: {
        Form,
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
            // 判斷目前是否為更新表單非新增
            checkEdit: false,
            // 搜尋條件
            filterData: {},
            // 搜尋員工名稱
            searchName: null,
            // 搜尋員工帳號
            searchAccount: null,
            // 搜尋員工薪水
            searchPay: null,
            // 分頁機制預設值
            paginationData: {
                perPage: 15,
                total: 0
            },
            // 預設頁數
            currentPage: 1,
            // 取得更新資料 id
            formAccount: null,
            // 管理者id
            operatorId: null,
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
            // 清空員工名稱
            self.searchName = null;
            // 清空員工帳號
            self.searchAccount = null;
            // 清空員工薪水
            self.searchPay = null;
            if (self.$route.params.operatorId !== undefined) {
                self.getListsById({
                    operatorId: self.$route.params.operatorId,
                    sort: ["salary_id|DESC"]
                });
            } else {
                self.getLists({ sort: ["salary_id|DESC"] });
            }
        },
        // 搜尋條件
        filterSearch() {
            let self = this;
            // 判斷是否有值 有值就帶入搜尋條件
            checkHaveSelectData(["salary_id|DESC", self.searchName, self.searchAccount, self.searchPay], ["sort", "name", "account", "pay"], self.filterData);
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
            // 選擇到的薪水帳號
            self.formAccount = data.account;
            // 管理者id
            self.operatorId = data.operator_id;
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
                    sort: ["salary_id|DESC"]
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
         * 取得薪水列表
         * @param { type Object(物件) } sendData 需要過濾的資料參數以及排序規則
         * @param { type Boolean(true or false) } pageSize 判斷是否有切換一頁呈現幾筆
         */
        async getLists(sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await SalaryListApi(sendData);
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
                    message: "取得薪水列表失敗"
                });
            }
        },
        /**
         * 取得指定id專屬薪水列表
         * @param { type Object(物件) } sendData 需要過濾的資料參數以及排序規則
         * @param { type Boolean(true or false) } pageSize 判斷是否有切換一頁呈現幾筆
         */
        async getListsById(sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await SalaryListByIdApi(sendData);
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
                    message: "取得薪水列表失敗"
                });
            }
        },
    },
    watch: {
        "$route.params.operatorId": function (val) {
            let self = this;
            if (val !== undefined) {
                self.getListsById({
                    operatorId: self.$route.params.operatorId,
                    sort: ["salary_id|DESC"]
                });
            } else {
                self.getLists({ sort: ["salary_id|DESC"] });
            }
        }
    },
    created() {
        let self = this;
        if (self.$route.params.operatorId !== undefined) {
            self.getListsById({
                operatorId: self.$route.params.operatorId,
                sort: ["salary_id|DESC"]
            });
        } else {
            self.getLists({ sort: ["salary_id|DESC"] });
        }
        if (self.user.group.group_code !== "SYSTEM" && self.$route.params.operatorId === undefined) {
            self.operatorId = self.getOperatorId;
        } else {
            self.operatorId = self.$route.params.operatorId;
        }
    }
};
</script>
