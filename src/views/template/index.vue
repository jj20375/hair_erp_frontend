<template>
    <div>
        <button class="darkBtn borderRadius10 px-3 py-2"
                v-if="$route.meta.params.Create==1"
                @click="clickDialog()">
            新增樣板
        </button>
        <div class="row align-items-center">
            <div class="col-md-6">
                <label class="d-block"
                       for="">日期區間</label>
                <MyDatePicker ref="myDatePicker"
                              @onSelectDate="checkSelectDate" />
            </div>
            <div class="col-md-4">
                <label for="">樣板代碼</label>
                <el-input placeholder="請輸入樣板代碼"
                          v-model="searchCode"
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
                             label="樣板">
                <template v-slot="scope">
                    <div>名稱:<span class="ml-2">{{ scope.row.name }}</span></div>
                    <div class="hot-color">樣板代碼:<span class="ml-2">{{ scope.row.tmp_code }}</span></div>
                </template>
            </el-table-column>
            <el-table-column min-width="250"
                             label="樣板預覽圖">
                <template v-slot="scope">
                    <el-image v-if="scope.row.img_path !== null"
                              style="width:200px; display:block; margin: 0 auto;"
                              :src="`${$gcsImgUrl}/${scope.row.img_path}`"
                              :preview-src-list="[`${$gcsImgUrl}/${scope.row.img_path}`]">
                    </el-image>
                    <div v-else>沒有預覽圖</div>
                </template>
            </el-table-column>
            <el-table-column label="啟用狀態"
                             min-width="150">
                <template v-slot="scope">
                    <badge type="primary">
                        <el-switch style="display: block;"
                                   v-model="scope.row.active"
                                   :disabled="$route.meta.params.Update==0"
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
            <el-table-column label="共用狀態"
                             min-width="150">
                <template v-slot="scope">
                    <badge type="primary">
                        <el-switch style="display: block;"
                                   v-model="scope.row.public"
                                   :disabled="$route.meta.params.Update==0"
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
import { mapMutations } from "vuex";
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
// 取的所有樣板列表
import { TemplateListApi } from "../../api/templateApi";

export default {
    mixins: [DatePickerMixin],
    components: {
        Form,
        MyDatePicker,
        MyPagination
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
            searchCode: null,
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
    methods: {
        // 自定義索引
        indexMethod(val) {
            let self = this;
            return (self.currentPage - 1) * self.paginationData.perPage + val + 1;
        },
        // 搜尋條件
        filterSearch() {
            let self = this;
            // 判斷是否有值 有值就帶入搜尋條件
            checkHaveSelectData(["template_id|DESC", self.searchCode, self.startTime, self.endTime], ["sort", "tmp_code", "startDate", "endDate"], self.filterData);
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
            // 清空樣板代碼
            self.searchCode = null;
            // 清空開始時間
            self.startTime = null;
            // 清空結束時間
            self.endTime = null;
            // 清空日期資料
            self.dateValue = null;
            // 清空日期模組資料
            self.$refs.myDatePicker.clearSelectedDate();
            self.getLists({ sort: ["template_id|DESC"] });
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
            // 選擇到的樣板id
            self.formId = data.template_id;
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
                    sort: ["template_id|DESC"]
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
                let { data } = await TemplateListApi(sendData);
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
                    message: "取得樣板列表失敗"
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
    created() {
        let self = this;
        self.getLists({ sort: ["template_id|DESC"] });
    }
};
</script>
