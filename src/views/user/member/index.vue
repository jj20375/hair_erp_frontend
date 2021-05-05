<template>
    <div>
        <button class="darkBtn borderRadius10 px-3 py-2"
                v-if="$route.meta.params.Create === 1 && (user.group.group_code !== 'SYSTEM' || $route.params.operatorId !== undefined)"
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
            <div class="col-md-3">
                <label for="">名稱</label>
                <el-input placeholder="請輸入會員名稱"
                          v-model="searchName"
                          prefix-icon="el-icon-search"
                          clearable>
                </el-input>
            </div>
            <div class="col-md-3">
                <label for="">暱稱</label>
                <el-input placeholder="請輸入會員暱稱"
                          v-model="searchNickName"
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
                <el-table-column label="會員"
                                 min-width="250">
                    <template v-slot="scope">
                        <div>
                            <h5 class="mb-0 dark-color">帳號:<span class="ml-2">{{ scope.row.account }}</span></h5>
                            <h5 class="mb-0 red-color font-weight-bold">名稱:<span class="ml-2">{{ scope.row.name }}</span></h5>
                            <h5 class="mb-0 gray-color font-weight-bold">暱稱:<span class="ml-2">{{ scope.row.nickname }}</span></h5>
                            <div class="font-weight-bold hot-color">生日:<span class="ml-2">{{ scope.row.birthday | formatDate }}</span></div>
                            <h5 class="font-weight-bold green-color mb-0">點數:<span class="ml-2">{{ scope.row.user_member_info === null ? 0 : scope.row.user_member_info.point | formatCurrency }}</span></h5>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column min-width="150"
                                 label="店家"
                                 v-if="user.group.group_code === 'SYSTEM'">
                    <template v-slot="scope">
                        <div class="font-weight-bold red-color">帳號:<span class="ml-2">{{ scope.row.user_operator.account }}</span></div>
                        <div class="font-weight-bold hot-color">名稱:<span class="ml-2">{{ scope.row.user_operator.name }}</span></div>
                    </template>
                </el-table-column>
                <el-table-column label="時間/登入ip"
                                 min-width="200">
                    <template v-slot="scope">
                        <div class="gray-color borderBottomWidth1 grayBorder">創建時間:<div class="ml-2">{{ scope.row.created_at | formatDateTime }}</div>
                        </div>
                        <div class="font-weight-bold borderBottomWidth1 grayBorder">最後登入:<div class="ml-2">{{ scope.row.user.login_time | formatUnixDate }}</div>
                        </div>
                        <div class="gray-color borderBottomWidth1 grayBorder">創建IP:<span class="ml-2">{{ scope.row.user.create_ip }}</span></div>
                        <div class="font-weight-bold borderBottomWidth1 grayBorder">最後登入IP:<span class="ml-2">{{ scope.row.user.last_ip }}</span></div>
                    </template>
                </el-table-column>
                <el-table-column prop="status"
                                 label="設定"
                                 width="180">
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
                        <button type="button"
                                class="hotBtn-outline borderRadius10 px-2 py-2 w-100"
                                v-if="checkShow('member_addPoint')"
                                @click="addPoint(scope.row)">
                            新增點數
                            <i class="fas fa-plus-hexagon"></i>
                        </button>
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
              :operatorId="operatorId"
              :checkEdit="checkEdit"
              @onRefreshData="resetData"
              @onCloseDialog="closeDialog" />
        <PointForm :showDialog="showPointDialog"
                   :formAccount="formAccount"
                   @onRefreshData="resetData"
                   @onCloseDialog="closeDialog" />
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
// 導入 lodash 套件
import _ from "lodash";
// 新增與更新表單
import Form from "./Form.vue";
// 點數訂單表單
import PointForm from "./PointForm.vue";
// 導入 swwetalert2 套件
import Swal from "sweetalert2";
// 導入日期搜尋模組
import MyDatePicker from "../../components/MyDatePicker.vue";
// 導入日期套件需要用到的方法
import DatePickerMixin from "../../../mixins/DatePickerService";
// 導入分頁組件
import MyPagination from "../../components/MyPagination.vue";
/**
 * MemberListApi = 取的會員列表 api
 * MemberListByIdApi = 取的指定id會員列表 api
 * UpdateMemberApi = 更新會員 api
 */
import { MemberListApi, MemberListByIdApi, UpdateMemberApi } from "../../../api/memberApi";
// 導入搜尋條件判斷式
import { checkHaveSelectData } from "../../../service/anyService";
export default {
    mixins: [DatePickerMixin],
    components: {
        Form,
        PointForm,
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
            showDialog: false,
            // 判斷是否開啟新增點數彈窗
            showPointDialog: false,
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
            // 搜尋帳號
            searchAccount: null,
            // 搜尋名稱
            searchName: null,
            // 搜尋暱稱
            searchNickName: null,
            // 下拉選單選取啟用狀態
            statusOptions: [
                { name: "啟用", value: 5 },
                { name: "禁止", value: 0 }
            ],
            // 當前頁面
            currentPage: 1,
            // 分頁資料
            paginationData: {
                perPage: 15,
                total: 0
            },
            // 會員帳號
            formAccount: null,
            // 管理者id
            operatorId: null
        };
    },
    methods: {
        /**
         * 檢查是否要顯示功能按鈕
         * @param { type String(字串) } val 路由名稱
         */
        checkShow(val) {
            let self = this;
            return _.some(self.$route.meta.options, { key: val });
        },
        // 自定義索引
        indexMethod(val) {
            let self = this;
            return (self.currentPage - 1) * self.paginationData.perPage + val + 1;
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
            // 清空搜尋名稱資料
            self.searchName = null;
            // 清空搜尋名稱資料
            self.searchNickName = null;
            // 清空開始時間
            self.startTime = null;
            // 清空結束時間
            self.endTime = null;
            // 清空日期資料
            self.dateValue = null;
            // 清空日期模組資料
            self.$refs.myDatePicker.clearSelectedDate();
            // 重置成為搜尋時的資料 也就是秀出全部資料
            if (self.$route.params.operatorId !== undefined) {
                self.getListsById({
                    operatorId: self.$route.params.operatorId,
                    sort: ["member_id|DESC"]
                });
            } else {
                self.getLists({ sort: ["member_id|DESC"] });
            }
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
                    sort: ["member_id|DESC"]
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
        // 搜尋按鈕
        filterSearch() {
            let self = this;
            checkHaveSelectData([["member_id|DESC"], self.startTime, self.endTime, self.searchAccount, self.searchStatus, self.searchName, self.searchNickName], ["sort", "startDateTime", "endDateTime", "account", "status", "name", "nickname"], self.filterData);
            // 搜尋完後將分頁改回第一頁
            self.currentPage = 1;
            // 搜尋完後將分頁改回第一頁
            self.filterData.page = 1;
            if (self.$route.params.userId !== undefined) {
                self.filterData.userId = self.$route.params.userId;
                self.getListsById(self.filterData);
            } else {
                self.getLists(self.filterData);
            }
        },
        // 觸發彈窗
        clickDialog() {
            let self = this;
            self.showDialog = true;
            self.checkEdit = false;
            self.formAccount = null;
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
            // 管理者id
            self.operatorId = data.operator_id;
        },
        /**
         * 新增點數
         * @param { type Object(物件) } data 選中的列表資料
         */
        addPoint(data) {
            let self = this;
            self.showPointDialog = true;
            // 更新表單需要的資料
            self.formAccount = data.account;
        },
        // 關閉彈窗
        closeDialog() {
            let self = this;
            self.showDialog = false;
            self.showPointDialog = false;
        },
        /**
         * 開關子帳號啟用狀態
         * @param { type Object(物件) } data 列表資料
         * @example { member_id: user_members表id, user_id: users表id status: 狀態值}
         * @param { type Number(數字) } index 索引值
         */
        async onActive(data, index) {
            let self = this;
            // 表單發送資料
            let sendData = {
                member_id: data.member_id,
                user_id: data.user.user_id,
                status: data.status
            };
            try {
                let { value } = await Swal.fire({
                    title: "請問是否更新狀態?",
                    customClass: {
                        container: "zindex10000"
                    },
                    html: `更新會員：${data.name}`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "更新!",
                    cancelButtonText: "取消"
                });
                // 判斷是否點擊更新
                if (value) {
                    try {
                        await UpdateMemberApi(sendData);
                        self.$message({
                            type: "success",
                            message: "更新成功"
                        });
                        self.closeDialog();
                        self.datas[index].status = data.status;
                    } catch (err) {
                        self.$message({
                            type: "error",
                            message: "更新失敗"
                        });
                        self.datas[index].status = data.status === 5 ? 0 : 5;
                    }
                } else {
                    self.datas[index].status = data.status === 5 ? 0 : 5;
                }
            } catch (err) {}
        },
        /**
         * 取得會員帳號列表
         * @param { type Object(物件) } sendData 需要過濾的資料參數以及排序規則
         * @param { type Boolean(true or false) } pageSize 判斷是否有切換一頁呈現幾筆
         */
        async getLists(sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await MemberListApi(sendData);
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
                    message: "取的會員列表失敗"
                });
            }
        },
        /**
         * 取得指定id專屬會員帳號列表
         * @param { type Object(物件) } sendData 需要過濾的資料參數以及排序規則
         * @param { type Boolean(true or false) } pageSize 判斷是否有切換一頁呈現幾筆
         */
        async getListsById(sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await MemberListByIdApi(sendData);
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
                    message: "取的會員列表失敗"
                });
            }
        }
    },
    watch: {
        "$route.params.operatorId": function (val) {
            let self = this;
            if (val !== undefined) {
                self.getListsById({
                    operatorId: self.$route.params.operatorId,
                    sort: ["member_id|DESC"]
                });
            } else {
                self.getLists({ sort: ["member_id|DESC"] });
            }
        }
    },
    created() {
        let self = this;
        if (self.$route.params.operatorId !== undefined) {
            self.getListsById({
                operatorId: self.$route.params.operatorId,
                sort: ["member_id|DESC"]
            });
        } else {
            self.getLists({ sort: ["member_id|DESC"] });
        }
        if (self.user.group.group_code !== "OPERATOR" && self.$route.params.operatorId === undefined) {
            self.operatorId = self.getOperatorId;
        } else {
            self.operatorId = self.$route.params.operatorId;
        }
    }
};
</script>
