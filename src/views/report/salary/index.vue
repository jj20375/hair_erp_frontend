<template>
    <div>
        <div class="row align-items-center">
            <div class="col-md-6">
                <label class="d-block"
                       for="">日期區間</label>
                <MyDatePicker ref="myDatePicker"
                              @onSelectDate="checkSelectDate" />
            </div>
            <div class="col-md-3">
                <label class="d-block">搜尋店家</label>
                <el-select v-model="searchOperator"
                           filterable
                           clearable
                           placeholder="請選擇">
                    <el-option v-for="(item,index) in operatorOptions"
                               :key="index"
                               :label="item.account"
                               :value="item.operator_id">
                        <span>{{ item.name }}({{ item.account }})</span>
                    </el-option>
                </el-select>
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
        <ReportSalary :searchOperator="searchOperator" :datas="datas" :loading="loading" />
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
// 導入lodash套件
import _ from "lodash";
import ReportSalary from "../../components/ReportPerformance.vue";
/**
 * ReportSalaryApi = 總業績api
 */
import { ReportSalaryApi } from "../../../api/reportApi";
// OperatorSelectListApi = 搜尋管理者api
import { OperatorSelectListApi } from "../../../api/operatorApi";
// 導入日期組建
import MyDatePicker from "../../components/MyDatePicker.vue";
// 導入日期套件需要用到的方法
import DatePickerMixin from "../../../mixins/DatePickerService";
// 導入搜尋條件判斷式
import { checkHaveSelectData } from "../../../service/anyService";
export default {
    mixins: [DatePickerMixin],
    components: {
        MyDatePicker,
        ReportSalary
    },
    computed: {
        ...mapState("userStore", ["user"]),
        // 取得每個登入身份使用者的管理者id
        ...mapGetters("userStore", ["getOperatorId"])
    },
    data() {
        return {
            loading: false,
            // 列表資料
            datas: [],
            // 搜尋管理者
            searchOperator: null,
            // 搜尋條件
            filterData: {},
            // 選擇管理者
            operatorOptions: [],
        };
    },
    methods: {
        // 搜尋條件
        filterSearch() {
            let self = this;
            if (!self.startTime && !self.endTime) {
                return self.$message({
                    type: "error",
                    message: "請選擇日期"
                });
            }
            // 判斷是否有值 有值就帶入搜尋條件
            checkHaveSelectData(["operator_info_order_id|DESC", self.searchOperator, self.startTime, self.endTime], ["sort", "operator_id", "whereHasDateStart|operatorOrder|order_date", "whereHasDateEnd|operatorOrder|order_date"], self.filterData);
            self.getReport(self.filterData);
        },
        /**
         * 取得可搜尋管理者
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getOperator(operatorId) {
            let self = this;
            try {
                let { data } = await OperatorSelectListApi(operatorId);
                self.operatorOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得管理者失敗"
                });
            }
        },
        /**
         * 取得薪資報表
         * @param { type String or Number(字串或數字) } searchData 搜尋資料
         */
        async getReport(searchData) {
            let self = this;
            self.datas = [];
            self.loading = true;
            try {
                let { data } = await ReportSalaryApi(searchData);
                self.datas = data.data;
                self.loading = false;
            } catch (err) {
                self.loading = false;
                self.$message({
                    type: "error",
                    message: "取得薪資報表失敗"
                });
            }
        },
    },
    created() {
        let self = this;
        self.getOperator(self.getOperatorId);
    }
};
</script>