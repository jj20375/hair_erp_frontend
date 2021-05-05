<template>
    <div>
        <button class="darkBtn borderRadius10 px-3 py-2"
                v-if="$route.meta.params.Create==1"
                @click="clickDialog()">
            新增分類
        </button>
        <div class="row align-items-center">
            <div class="col-md-6">
                <label class="d-block"
                       for="">日期區間</label>
                <MyDatePicker ref="myDatePicker"
                              @onSelectDate="checkSelectDate" />
            </div>
            <div class="col-md-3">
                <label for="">分類名稱</label>
                <el-input placeholder="請輸入分類名稱"
                          v-model="searchName"
                          clearable
                          prefix-icon="el-icon-search">
                </el-input>
            </div>
            <div class="col-md-3">
                <label for="">分類代碼</label>
                <el-input placeholder="請輸入分類代碼"
                          v-model="searchKey"
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
                    <div class="font-weight-bold gray-color">代碼:<span class="ml-2">{{ scope.row.key }}</span></div>
                </template>
            </el-table-column>
            <el-table-column min-width="150"
                             label="分類創建者">
                <template v-slot="scope">
                    <div class="font-weight-bold red-color">帳號:<span class="ml-2">{{ scope.row.categoryable.account }}</span></div>
                    <div class="font-weight-bold hot-color">名稱:<span class="ml-2">{{ scope.row.categoryable.name }}</span></div>
                </template>
            </el-table-column>
            <el-table-column label="啟用狀態"
                             min-width="120">
                <template v-slot="scope">
                    <badge type="primary">
                        <el-switch style="display: block;"
                                   v-model="scope.row.active"
                                   :disabled="$route.meta.params.Update == 0 || (user.group.group_code !== 'SYSTEM' && user.userable.user_operator.account !== scope.row.categoryable.account)"
                                   active-color="#2dce89"
                                   inactive-color="#f5365c"
                                   active-text="啟用"
                                   :active-value="1"
                                   :inactive-value="0"
                                   inactive-text="禁止"
                                   @change="onActive(scope.row, scope.$index)">
                        </el-switch>
                    </badge>
                </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="150">
                <template v-slot="scope">
                    <button type="button"
                            class="hotBtn-outline borderRadius10 px-2 py-2 font-lg"
                            v-if="$route.meta.params.Update === 1 && (user.group.group_code === 'SYSTEM' || user.userable.user_operator.account === scope.row.categoryable.account)"
                            @click="onEdit(scope.row)">
                        <i class="fad fa-money-check-edit"></i>
                    </button>
                </template>
            </el-table-column>
        </el-table>
        <Form :formId="formId"
              :checkEdit="checkEdit"
              :showDialog="showDialog"
              @onRefresh="resetData"
              @onCloseDialog="closeDialog" />
        <MyPagination :paginationData="paginationData"
                      :currentPage="currentPage"
                      @onGetDatas="paginationAjax" />
    </div>
</template>

<script>
import { mapState } from "vuex";
// 導入 swwetalert2 套件
import Swal from "sweetalert2";
// 時間套件
import moment from "moment";
// 導入日期組建
import MyDatePicker from "../components/MyDatePicker.vue";
// 導入日期套件需要用到的方法
import DatePickerMixin from "../../mixins/DatePickerService";
// 導入分頁組件
import MyPagination from "../components/MyPagination.vue";
// 導入搜尋條件判斷式
import { checkHaveSelectData } from "../../service/anyService";
// 新增或更新表單
import Form from "./Form.vue";
/**
 * CategoryListApi = 取得分類列表api
 * UpdateCategoryApi = 更新分類 api
 */
import { CategoryListApi, UpdateCategoryApi } from "../../api/categoryApi";

export default {
    mixins: [DatePickerMixin],
    components: {
        Form,
        MyDatePicker,
        MyPagination,
    },
    computed: {
        ...mapState("userStore", ["user"]),
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
            // 搜尋分類名稱
            searchName: null,
            // 搜尋分類代碼
            searchKey: null,
            // 分頁機制預設值
            paginationData: {
                perPage: 15,
                total: 0,
            },
            // 預設頁數
            currentPage: 1,
            // 取得更新資料 id
            formId: null,
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
        /**
         * 開關分類啟用狀態
         * @param { type Object(物件) } data 列表資料
         * @example { category_id: categories表id, active: 啟用狀態 }
         * @param { type Number(數字) } index 索引值
         */
        async onActive(data, index) {
            let self = this;
            // 表單發送資料
            let sendData = {
                category_id: data.category_id,
                active: data.active,
            };
            try {
                let { value } = await Swal.fire({
                    title: "請問是否更新狀態?",
                    customClass: {
                        container: "zindex10000",
                    },
                    html: `更新分類：${data.name}`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "更新!",
                    cancelButtonText: "取消",
                });
                // 判斷是否點擊更新
                if (value) {
                    try {
                        await UpdateCategoryApi(sendData);
                        self.$message({
                            type: "success",
                            message: "更新成功",
                        });
                        self.closeDialog();
                        self.datas[index].active = data.active;
                    } catch (err) {
                        self.$message({
                            type: "error",
                            message: "更新失敗",
                        });
                        self.datas[index].active = data.active === 1 ? 0 : 1;
                    }
                } else {
                    self.datas[index].active = data.active === 1 ? 0 : 1;
                }
            } catch (err) {}
        },
        // 搜尋條件
        filterSearch() {
            let self = this;
            // 判斷是否有值 有值就帶入搜尋條件
            checkHaveSelectData(
                [
                    "category_id|DESC",
                    self.searchName,
                    self.searchKey,
                    self.startTime,
                    self.endTime,
                ],
                ["sort", "name", "key", "startDate", "endDate"],
                self.filterData
            );
            // 搜尋完後將分頁改回第一頁
            self.currentPage = 1;
            // 搜尋完後將分頁改回第一頁
            self.filterData.page = 1;
            self.getLists(self.filterData);
        },
        // 重置資料
        resetData() {
            let self = this;
            self.filterData = {};
            // 清空分類名稱
            self.searchName = null;
            // 清空分類代碼
            self.searchKey = null;
            // 清空開始時間
            self.startTime = null;
            // 清空結束時間
            self.endTime = null;
            // 清空日期資料
            self.dateValue = null;
            // 清空日期模組資料
            self.$refs.myDatePicker.clearSelectedDate();
            self.getLists({ sort: ["category_id|DESC"] });
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
            self.formId = data.category_id;
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
                    sort: ["category_id|DESC"],
                };
            }
            // 當pageSize 為 true 時 將一頁呈現幾筆值 改為傳入參數值 false 時 傳入預設的一頁輸出幾筆的值
            sendData.perPage = pageSize ? val : self.paginationData.perPage;
            // 當pageSize 為 true 時 帶入第一頁分頁 false 時 則為傳入分頁頁數值
            sendData.page = pageSize ? 1 : val;
            self.getLists(sendData, pageSize);
        },
        // 取得所分類列表
        async getLists(sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await CategoryListApi(sendData);
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
                    message: "取得分類列表失敗",
                });
            }
        },
        // 如果有搜尋日期實就觸發
        checkSelectDate(val) {
            let self = this;
            self.dateValue = val;
            if (self.dateValue !== null) {
                self.startTime = moment(self.dateValue[0]).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                self.endTime = moment(self.dateValue[1]).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
            }
        },
    },
    created() {
        let self = this;
        self.getLists({ sort: ["category_id|DESC"] });
    },
};
</script>
