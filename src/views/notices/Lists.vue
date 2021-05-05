<template>
    <div class="mt-2">
        <div class="row align-items-center mb-2">
            <div class="col-lg-5">
                <label>日期區間</label>
                <MyDatePicker ref="myDatePicker"
                              @onSelectDate="checkSelectDate" />
            </div>
            <div class="col-lg-3">
                <label class="d-block"
                       for="">通知型態</label>
                <el-select v-model="selectUnRead"
                           placeholder="選擇未讀或全部訊息"
                           class="w-100">
                    <el-option v-for="(item,index) in noticeOption"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="col-lg-4 col-12 mt-2 mb-2">
                <button class="secondBtn borderRadius10 px-3 py-2"
                        @click="filterSearch()">
                    <i class="fas fa-search"></i>搜尋
                </button>
                <button class="hotBtn-outline borderRadius10 ml-2 px-3 py-2"
                        @click="resetData()">
                    <i class="fas fa-redo-alt"></i>重置
                </button>
            </div>
        </div>
        <!-- <div class="row"
             v-if="selectUnRead">
            <div class="col-12">
                <el-button type="primary"
                           icon="fal fa-comment-check mr-1"
                           @click="readNoticeActive()"
                           plain>更新已讀 <i class="el-icon el-icon-arrow-right"></i></el-button>
                <el-button type="danger"
                           icon="fal fa-comment-check mr-1"
                           @click="readAllNoticeActive()"
                           plain>全部已讀</el-button>
            </div>
        </div> -->
        <el-table :data="datas"
                  @selection-change="selectNotice"
                  class="myTable w-100"
                  border>
            <!-- <el-table-column v-if="selectUnRead"
                             type="selection"
                             width="55">
            </el-table-column> -->
            <el-table-column type="expand"
                             label="◎"
                             width="100">
                <template v-slot="scope">
                    <div class="font-weight-bold dark-color grayBorder borderBottomWidth1 mb-2">標題:<span class="ml-2">{{ scope.row.title }}</span>
                    </div>
                    <div class="font-weight-bold second-color grayBorder borderBottomWidth1 mb-2">訊息:<span class="ml-2">{{ scope.row.content }}</span></div>
                    <div class="gray-color grayBorder borderBottomWidth1 mb-2">
                        日期:<span class="ml-2">{{ scope.row.created_at | formatDateTime }}</span>
                    </div>
                    <div>
                        <button v-if="user.group_data.groupCode === 'SYSTEM' && $route.meta.params.Update === 1"
                                @click="onEdit(scope.row)"
                                class="hotBtn-outline borderRadius10 px-3 py-2 "
                                type="primary">前往處理<i class="ml-1 far fa-arrow-alt-right"></i></button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="!isMobile"
                             label="#"
                             width="100">
                <template v-slot="scope">
                    <span>{{ scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="title"
                             min-width="200"
                             label="標題">
            </el-table-column>
            <el-table-column prop="msg"
                             min-width="250"
                             label="訊息">
            </el-table-column>
            <el-table-column prop="created_at"
                             min-width="200"
                             label="日期">
                <template v-slot="scope">
                    <span>{{ scope.row.created_at | formatDateTime }}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="showActionBtn" label="操作"
                             width="200">
                <template v-slot="scope">
                    <button @click="onEdit(scope.row)"
                            class="hotBtn-outline borderRadius10 px-3 py-2 "
                            type="primary">前往處理<i class="ml-1 far fa-arrow-alt-right"></i></button>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-md-left text-center">
            <MyPagination :paginationData="paginationData"
                          :currentPage="currentPage"
                          @onGetDatas="paginationAjax" />
        </div>
        <component :is="noticeType"
                   :showDialog="showDialog"
                   :noticeId="noticeId"
                   ref="form"
                   @onRefresh="refresh"
                   @onCloseDialog="closeDialog"></component>
    </div>
</template>
<script>
import { mapState } from "vuex";
// 導入日期組件
import MyDatePicker from "../components/MyDatePicker.vue";
// 導入日期套件方法
import DatePickerMixin from "../../mixins/DatePickerService";
// 導入分頁組件
import MyPagination from "../components/MyPagination.vue";
// 導入sweat alert 套件
import Swal from "sweetalert2";
// 將選到的通知更新為已讀 api
import { UpdateNoticeToReadedApi } from "../../api/noticeApi";
// 導入過濾搜尋條件機制方法
import { checkHaveSelectData } from "../../service/anyService";
// 時間套件
import moment from "moment";
// 導入 lodash 方法
import _ from "lodash";
import CommodityForm from "./commodity/Form.vue";
export default {
    mixins: [DatePickerMixin],
    components: {
        MyDatePicker,
        MyPagination,
        CommodityForm,
    },
    props: {
        // 通知清單資料
        datas: {
            type: Array,
        },
        // 分頁資料
        paginationData: {
            type: Object,
        },
        // 預設頁數
        currentPage: {
            type: [Number, String],
        },
        // 用來判斷通知類別
        noticeType: {
            type: String,
            default: null,
        },
    },
    computed: {
        ...mapState("userStore", ["user"]),
    },
    data() {
        return {
            // 搜尋過濾條件
            filterData: {},
            // 判斷進來的通知路由類別
            checkNoticeType: null,
            // 判斷目前是否為觀看未讀資料
            selectUnRead: true,
            // 全部或未讀訊息下拉選單資料
            noticeOption: [
                { label: "全部訊息", value: false },
                { label: "未讀訊息", value: true },
            ],
            // 選取到的通知資料
            readedNoticeLists: [],
            // 判斷是否要打開彈窗
            showDialog: false,
            // 取的通知詳情用 id
            noticeId: null,
            // 判斷是否顯示前往處理按鈕
            showActionBtn: true,
        };
    },
    methods: {
        /**
         * 點擊處理時需要打開彈窗
         * @param { type Object(物件) } data 選取到的當行資料
         */
        onEdit(data) {
            let self = this;
            self.showDialog = true;
            // 傳入需要取的 notice id
            self.noticeId = data.id;
            // 點擊更新時才觸發取得 通知詳細資料
            self.$refs.form.getNoticeDetail(data.id);
        },
        // 關閉彈窗
        closeDialog(val) {
            let self = this;
            self.showDialog = val;
        },
        // 搜尋過濾條件
        filterSearch() {
            let self = this;
            checkHaveSelectData(["created_at|DESC", self.startTime, self.endTime], ["sort", "startDateTime", "endDateTime"], self.filterData);
            // 搜尋完後將分頁改回第一頁
            self.filterData.page = 1;
            // 判斷是否選擇未讀或已讀訊息
            self.showActionBtn = self.selectUnRead;
            // 第一個參數為過濾條件 第二個參數為獲取 未讀的通知 或 全部通知
            self.$emit("onFilterSearch", self.filterData, self.selectUnRead);
        },
        // 重置資料
        resetData() {
            let self = this;
            // 預設選擇未讀通知列表
            self.selectUnRead = true;
            // 清空搜尋資料
            self.filterData = {};
            // 清空日期資料
            self.dateValue = null;
            // 清空起始日期
            self.startTime = null;
            // 清空結束日期
            self.endTime = null;
            // 清空選擇到的日期資料
            self.$refs.myDatePicker.clearSelectedDate();
            self.$emit("onRefresh");
        },
        refresh() {
            let self = this;
            self.$emit("onRefresh");
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
            self.$emit("onPaginationAjax", val, pageSize, self.filterData);
        },
        // 選取到的通知訊息
        selectNotice(val) {
            let self = this;
            self.readedNoticeLists = val;
        },
        // // 更新為已讀方法
        // readNoticeActive() {
        //     let self = this;
        //     Swal.fire({
        //         title: "請問是否確認已讀?",
        //         text: "已讀後將不會再顯示在即時通知上",
        //         icon: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#3085d6",
        //         cancelButtonColor: "#d33",
        //         confirmButtonText: "已讀!",
        //         cancelButtonText: "取消",
        //     }).then(result => {
        //         if (result.value) {
        //             let result = _.map(self.readedNoticeLists, "id");
        //             let setData = {
        //                 noteIds: result,
        //             };
        //             UpdateNoticeToReadedApi(setData)
        //                 .then(() => {
        //                     self.$message({
        //                         type: "success",
        //                         message: "更新已讀取成功",
        //                     });
        //                     self.resetData();
        //                 })
        //                 .catch(err => {
        //                     self.$message({
        //                         type: "error",
        //                         message: "更新已讀取失敗",
        //                     });
        //                 });
        //         }
        //     });
        // },
        // // 更新為全部已讀方法
        // readAllNoticeActive() {
        //     let self = this;
        //     Swal.fire({
        //         title: "請問是否確認全部已讀?",
        //         text: "已讀後將不會再顯示在即時通知上",
        //         icon: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#3085d6",
        //         cancelButtonColor: "#d33",
        //         confirmButtonText: "全部已讀!",
        //         cancelButtonText: "取消",
        //     }).then(result => {
        //         if (result.value) {
        //             self.$emit("onReadAllNoticeActive");
        //         }
        //     });
        // },
    },
    created() {
        let self = this;
        self.checkNoticeType = self.$route.name;
    },
};
</script>