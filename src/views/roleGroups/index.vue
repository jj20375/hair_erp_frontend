<template>
    <div>
        <button class="darkBtn borderRadius10 px-3 py-2"
                v-if="$route.meta.params.Create==1"
                @click="clickDialog()">
            新增群組
        </button>
        <div class="row align-items-center">
            <div class="col-md-6">
                <label class="d-block"
                       for="">日期區間</label>
                <MyDatePicker ref="myDatePicker"
                              @onSelectDate="checkSelectDate" />
            </div>
            <div class="col-md-4">
                <label for="">群組名稱</label>
                <el-input placeholder="请输入内容"
                          v-model="searchName"
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
            <el-table-column prop="groupName"
                             min-width="150"
                             label="群組">
                <template v-slot="scope">
                    <strong>群組名稱：{{ scope.row.group_name }}</strong>
                    <div class="font-weight-bold"
                         :class="roleColor(scope.row.group_code)">
                        身份:{{ scope.row.group_code | groupRole }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column min-width="150"
                             label="群組創建者"
                             v-if="user.group.group_code === 'SYSTEM'">
                <template v-slot="scope">
                    <div class="font-weight-bold red-color">帳號:<span class="ml-2">{{ scope.row.groupable.name }}</span></div>
                    <div class="font-weight-bold hot-color">名稱:<span class="ml-2">{{ scope.row.groupable.account }}</span></div>
                </template>
            </el-table-column>
            <el-table-column prop="isSub"
                             width="150"
                             label="子帳專用">
                <template v-slot="scope">
                    <div style="color:#FFF;width: 50px;padding:7px;border: 1px solid;text-align: center;border-radius: 7px;"
                         :class="scope.row.is_sub === 1 ? 'bg-danger' : 'bg-success'">
                        {{ scope.row.is_sub === 1 ? "是" : "否" }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="設定"
                             width="150">
                <template v-slot="scope">
                    <button v-if="$route.meta.params.Update==1"
                            class="hotBtn borderRadius10 px-3 py-2"
                            @click="goToRolesSetPage(scope.row.group_id, scope.row.group_code)">
                        設定
                    </button>
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
        <Form v-if="showDialog"
              :formId="formId"
              :checkEdit="checkEdit"
              :showDialog="showDialog"
              @onRefresh="resetData"
              @onCloseDialog="closeDialog" />
        <MyPagination :paginationData="paginationData"
                      :currentPage="currentPage"
                      @onGetDatas="paginationAjax" />
    </div>
</template>

<style></style>
<script>
import { mapState } from "vuex";
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
// 取的所有群組列表
import { GroupListApi } from "../../api/groupApi";

export default {
    mixins: [DatePickerMixin],
    components: {
        Form,
        MyDatePicker,
        MyPagination
    },
    computed: {
        ...mapState("userStore", ["user"])
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
            // 搜尋群組名稱
            searchName: null,
            // 分頁機制預設值
            paginationData: {
                perPage: 15,
                total: 0
            },
            // 預設頁數
            currentPage: 1,
            // 取得更新資料 id
            formId: null,
            loading: false
        };
    },
    filters: {
        // 群組身份顯示
        groupRole(val) {
            let roles = {
                SYSTEM: "系統",
                OPERATOR: "管理者",
                DESIGNER: "設計師",
                ASSISTANT: "助理",
                MEMBER: "會員"
            };
            return roles[val];
        }
    },
    methods: {
        // 自定義索引
        indexMethod(val) {
            let self = this;
            return (self.currentPage - 1) * self.paginationData.perPage + val + 1;
        },
        // 判斷群組身份 呈現字體顏色
        roleColor(val) {
            let roles = {
                SYSTEM: "hot-color",
                OPERATOR: "text-primary",
                DESIGNER: "red-color",
                ASSISTANT: "text-warning",
                MEMBER: "text-muted"
            };
            return roles[val];
        },
        // 搜尋條件
        filterSearch() {
            let self = this;
            // 判斷是否有值 有值就帶入搜尋條件
            checkHaveSelectData(["group_id|DESC", self.searchName, self.startTime, self.endTime], ["sort", "group_name", "startDate", "endDate"], self.filterData);
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
            // 清空群組名稱
            self.searchName = null;
            // 清空開始時間
            self.startTime = null;
            // 清空結束時間
            self.endTime = null;
            // 清空日期資料
            self.dateValue = null;
            // 清空日期模組資料
            self.$refs.myDatePicker.clearSelectedDate();
            self.getLists({ sort: ["group_id|DESC"] });
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
            // 選擇到的角色id
            self.formId = data.group_id;
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
                    sort: ["group_id|DESC"]
                };
            }
            // 當pageSize 為 true 時 將一頁呈現幾筆值 改為傳入參數值 false 時 傳入預設的一頁輸出幾筆的值
            sendData.perPage = pageSize ? val : self.paginationData.perPage;
            // 當pageSize 為 true 時 帶入第一頁分頁 false 時 則為傳入分頁頁數值
            sendData.page = pageSize ? 1 : val;
            self.getLists(sendData, pageSize);
        },
        // 取得所有群組列表
        async getLists(sendData, pageSize = false) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await GroupListApi(sendData);
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
                    message: "取得群組列表失敗"
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
        },
        /**
         * 跳轉設定權限頁面
         * @param { type String or Number (字串或數字) 群組表id } groupId
         * @param { type String (字串) 群組代碼 } groupCode
         */
        goToRolesSetPage(groupId, groupCode) {
            let self = this;
            // 跳轉權限設定頁面
            self.$router.push({ name: "system_roles_update", params: { id: groupId, groupCode: groupCode } });
        }
    },
    created() {
        let self = this;
        self.getLists({ sort: ["group_id|DESC"] });
    }
};
</script>
