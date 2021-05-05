<template>
    <div>
        <button class="darkBtn borderRadius10 px-3 py-2"
                v-if="$route.meta.params.Create === 1"
                @click="clickDialog()"><i class="fas fa-plus mr-1"></i>新增
        </button>
        <div class="row align-items-center">
            <div class="col-md-6">
                <label class="d-block"
                       for="">日期區間</label>

                <MyDatePicker ref="myDatePicker"
                              @onSelectDate="checkSelectDate" />
            </div>
            <div class="col-md-3">
                <label for="">啟用狀態</label>
                <el-select class="w-100"
                           clearable
                           v-model="searchStatus"
                           placeholder="請選擇">
                    <el-option v-for="(item,key) in statusOptions"
                               :key="key"
                               :label="item.name"
                               :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="col-md-3">
                <label for="">帳號</label>
                <el-input placeholder="請輸入帳號"
                          v-model="searchAccount"
                          prefix-icon="el-icon-search"
                          clearable>
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
        <div class="table-responsive"
             v-loading="loading">
            <el-table :data="datas"
                      header-cell-class-name="text-left align-middle bg-dark text-white"
                      class="myTable"
                      cell-class-name="text-left align-middle"
                      border
                      style="width:100%;">
                <el-table-column label="#"
                                 type="index"
                                 :index="indexMethod"
                                 sortable
                                 width="100">
                </el-table-column>
                <el-table-column label="名稱"
                                 min-width="150">
                    <template v-slot="scope">
                        <div>
                            <h5 class="mb-0 dark-color">帳號:<span class="ml-2">{{ scope.row.account }}</span></h5>
                            <h5 class="mb-0 gray-color font-weight-bold">名稱:<span class="ml-2">{{ scope.row.name }}</span></h5>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="群組"
                                 min-width="150">
                    <template v-slot="scope">
                        <div>
                            <h5 class="mb-0 dark-color">類別:<span class="ml-2">{{ scope.row.user.group.group_code }}</span></h5>
                            <h5 class="mb-0 gray-color font-weight-bold">名稱:<span class="ml-2">{{ scope.row.user.group.group_name }}</span></h5>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="時間"
                                 min-width="200">
                    <template v-slot="scope">
                        <div class="gray-color">創建時間:<div class="ml-2">{{ scope.row.created_at | formatDateTime }}</div></div>
                        <div class="font-weight-bold">最後登入:<div class="ml-2">{{ scope.row.user.login_time | formatUnixDate }}</div></div>
                    </template>
                </el-table-column>
                <el-table-column label="登入IP"
                                 min-width="200">
                    <template v-slot="scope">
                        <div class="gray-color">創建IP:<span class="ml-2">{{ scope.row.user.create_ip }}</span></div>
                        <div class="font-weight-bold">最後登入IP:<span class="ml-2">{{ scope.row.user.last_ip }}</span></div>
                    </template>
                </el-table-column>
                <el-table-column prop="status"
                                 label="啟用狀態"
                                 min-width="200">
                    <template v-slot="scope">
                        <badge type="primary">
                            <el-switch style="display: block;"
                                       v-model="scope.row.status"
                                       :disabled="$route.meta.params.Update==0"
                                       active-color="#2dce89"
                                       inactive-color="#f5365c"
                                       active-text="啟用"
                                       :active-value="5"
                                       :inactive-value="0"
                                       inactive-text="禁止"
                                       @change="onActive(scope.row, scope.$index)">
                            </el-switch>
                        </badge>
                    </template>
                </el-table-column>
                <el-table-column label="操作"
                                 min-width="120">
                    <template v-slot="scope">
                        <button type="button"
                                class="hotBtn-outline borderRadius10 px-2 py-2 font-lg"
                                v-if="$route.meta.params.Update==1"
                                @click="onEdit(scope.row)">
                            <i class="fad fa-edit"></i>
                        </button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="text-md-left text-center">
            <MyPagination :paginationData="paginationData"
                          :currentPage="currentPage"
                          @onGetDatas="paginationAjax" />
        </div>
        <Form ref="form"
              :showDialog="showDialog"
              :formAccount="formAccount"
              :checkEdit="checkEdit"
              @onRefreshData="resetData"
              @onCloseDialog="closeDialog" />
    </div>
</template>
<script>
import { mapState } from "vuex";
// 新增與更新表單
import Form from "./Form.vue";
// 導入 swwetalert2 套件
import Swal from "sweetalert2";
// 導入日期搜尋模組
import MyDatePicker from "../../components/MyDatePicker.vue";
// 導入日期套件需要用到的方法
import DatePickerMixin from "../../../mixins/DatePickerService";
// 導入分頁組件
import MyPagination from "../../components/MyPagination.vue";
/**
 * SystemUserListApi = 取得系統使用者列表 api
 * UpdateSystemApi = 更新系統使用者 api
 */
import { SystemUserListApi, UpdateSystemApi } from "../../../api/systemApi";
// 導入搜尋條件判斷式
import { checkHaveSelectData } from "../../../service/anyService";
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
            showDialog: false,
            // 列表
            datas: [],
            // 確認目前是否為編輯狀態
            checkEdit: false,
            // 加載狀態中
            loading: false,
            // 搜尋過濾時送出的物件
            filterData: {},
            // 選取啟用狀態值
            searchStatus: null,
            // 搜尋到的帳號
            searchAccount: null,
            // 下拉選單選取啟用狀態
            statusOptions: [
                { name: "啟用", value: 5 },
                { name: "禁止", value: 0 },
            ],
            // 當前頁面
            currentPage: 1,
            // 分頁資料
            paginationData: {
                perPage: 15,
                total: 0,
            },
            // 系統人員帳號
            formAccount: null,
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
            // 清空過濾資料
            self.filterData = {};
            // 清空搜尋帳號資料
            self.searchAccount = null;
            // 清空搜尋啟用狀態資料
            self.searchStatus = null;
            // 清空開始時間
            self.startTime = null;
            // 清空結束時間
            self.endTime = null;
            // 清空日期資料
            self.dateValue = null;
            // 清空日期模組資料
            self.$refs.myDatePicker.clearSelectedDate();
            // 重置成為搜尋時的資料 也就是秀出全部資料
            self.getLists({ sort: ["system_id|DESC"] });
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
                    sort: ["system_id|DESC"],
                };
            }
            // 當pageSize 為 true 時 將一頁呈現幾筆值 改為傳入參數值 false 時 傳入預設的一頁輸出幾筆的值
            sendData.perPage = pageSize ? val : self.paginationData.perPage;
            // 當pageSize 為 true 時 帶入第一頁分頁 false 時 則為傳入分頁頁數值
            sendData.page = pageSize ? 1 : val;
            self.getLists(sendData, pageSize);
        },
        // 搜尋按鈕
        filterSearch() {
            let self = this;
            checkHaveSelectData(
                [["system_id|DESC"], self.startTime, self.endTime, self.searchAccount, self.searchStatus],
                ["sort", "startDateTime", "endDateTime", "account", "status"],
                self.filterData
            );
            // 搜尋完後將分頁改回第一頁
            self.currentPage = 1;
            // 搜尋完後將分頁改回第一頁
            self.filterData.page = 1;
            self.getLists(self.filterData);
        },
        // 觸發新增管理者表單彈窗
        clickDialog() {
            let self = this;
            self.showDialog = true;
            self.checkEdit = false;
        },
        /**
         * 打開更新彈窗 並傳入選中的資料
         * @param { type Object(物件) } data 選中的列表資料
         */
        onEdit(data) {
            let self = this;
            self.showDialog = true;
            self.checkEdit = true;
            // 更新表單需要的資料
            self.formAccount = data.account;
        },
        // 關閉註冊彈窗
        closeDialog() {
            let self = this;
            self.showDialog = false;
        },
        /**
         * 開關系統使用者啟用狀態
         * @param { type Object(物件) } data 列表資料
         * @example { user_id: users表id system_id: user_systems表id, status: 狀態值}
         * @param { type Number(數字) } index 索引值
         */
        async onActive(data, index) {
            let self = this;
            // 表單發送資料
            let sendData = {
                user_id: data.user.user_id,
                system_id: data.system_id,
                status: data.status,
            }
            try {
                let { value } = await Swal.fire({
                    title: "請問是否更新狀態?",
                    customClass: {
                        container: "zindex10000",
                    },
                    html: `更新系統使用者：${data.name}`,
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
                        await UpdateSystemApi(sendData);
                        self.$message({
                            type: "success",
                            message: "更新成功",
                        });
                        self.closeDialog();
                        self.datas[index].status = data.status;
                    } catch (err) {
                        self.$message({
                            type: "error",
                            message: "更新失敗",
                        });
                        self.datas[index].status = data.status === 5 ? 0 : 5;
                    }
                } else {
                    self.datas[index].status = data.status === 5 ? 0 : 5;
                }
            } catch (err) {}
        },
        /**
         * 取得系統帳號列表
         * @param { type Object(物件) } sendData 需要過濾的資料參數以及排序規則
         * @param { type Boolean(true or false) } pageSize 判斷是否有切換一頁呈現幾筆
         */
        async getLists(sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await SystemUserListApi(sendData);
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
                    message: "取的系統使用者列表失敗",
                });
            }
        },
    },
    created() {
        let self = this;
        self.getLists({ sort: ["system_id|DESC"] });
    },
};
</script>
