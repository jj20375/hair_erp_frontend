<template>
    <div>
        <el-dialog :visible.sync="showDialog"
                   :close-on-click-modal="true"
                   :show-close="true"
                   :modal-append-to-body="true"
                   :close-on-press-escape="true"
                   :before-close="closeDialog"
                   @open="openDialog"
                   :width="isMobile ? '100%' : '50%'"
                   center>
            <el-form :label-position="'left'"
                     ref="form"
                     label-width="120px"
                     :model="form"
                     :rules="rules">
                <el-form-item label="員工身份"
                              prop="ableType">
                    <el-select v-model="form.ableType"
                               placeholder="請選擇身份">
                        <el-option v-for="item in ableTypeOptions"
                                   :key="item.value"
                                   :label="item.name"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="選擇員工"
                              v-if="form.ableType !== null && form.ableType === 'assistant'"
                              prop="account">
                    <el-select v-model="form.account"
                               placeholder="請選擇員工">
                        <el-option v-for="(item,index) in assistantOptions"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.account">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="選擇員工"
                              v-if="form.ableType !== null && form.ableType === 'subUser'"
                              prop="account">
                    <el-select v-model="form.account"
                               placeholder="請選擇員工">
                        <el-option v-for="(item,index) in userSubOptions"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.account">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="員工薪水"
                              prop="pay">
                    <el-input type="number"
                              v-model.number="form.pay"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"
                  class="dialog-footer">
                <el-button type="primary"
                           @click="onSubmit('form')">確定</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style lang="scss">
.zindex10000 {
    z-index: 10000;
}
</style>
<script>
import { mapState, mapGetters } from "vuex";
// 取得可選擇助理列表
import { AssistantSelectListApi } from "../../api/assistantApi";
// 取得可選擇子帳號列表
import { SubUserSelectListApi } from "../../api/subApi";
/**
 * AddSalaryApi = 新增薪水 api
 * UpdateSalaryApi = 更新薪水 api
 * SalaryDataApi = 取的薪水資料 api
 */
import { AddSalaryApi, UpdateSalaryApi, SalaryDataApi } from "../../api/salaryApi";
export default {
    props: {
        showDialog: {
            type: Boolean
        },
        // 取得更新資料傳送帳號參數
        formAccount: {
            type: String
        },
        // 判斷是否為更新
        checkEdit: {
            type: Boolean
        },
        // 管理者id
        operatorId: {
            type: [String, Number]
        }
    },
    computed: {
        ...mapState("userStore", ["user"]),
        // 取得每個登入身份使用者的管理者id
        ...mapGetters("userStore", ["getOperatorId"])
    },
    data() {
        return {
            form: {},
            // 選擇身份
            ableTypeOptions: [
                { name: "助理", value: "assistant" },
                { name: "其它", value: "subUser" }
            ],
            // 選擇助理
            assistantOptions: [],
            // 選擇子帳號
            userSubOptions: [],
            // 驗證規則
            rules: {
                account: [
                    {
                        required: true,
                        message: "請選擇員工",
                        trigger: "change"
                    }
                ],
                pay: [
                    {
                        required: true,
                        message: "請輸入員工薪水",
                        trigger: "blur"
                    },
                    {
                        type: "number",
                        message: "員工薪水為數字",
                        trigger: "blur"
                    }
                ],
                ableType: [
                    {
                        required: true,
                        message: "請選擇員工身份",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    methods: {
        closeDialog() {
            let self = this;
            self.form = {};
            self.$emit("onCloseDialog");
            self.$refs.form.resetFields();
        },
        /**
         * 表單發送
         * @param { type String(字串) } formName 傳送表單名稱
         * @example ref="form"
         */
        async onSubmit(formName) {
            let self = this;
            try {
                
                await self.$refs[formName].validate();
                if (self.checkEdit) {
                    self.update(self.form);
                } else {
                    self.form.operator_id  = self.operatorId;
                    self.add(self.form);
                }
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗"
                });
            }
        },
        // 新增薪水
        async add(form) {
            let self = this;
            try {
                await AddSalaryApi(form);
                self.$message({
                    type: "success",
                    message: "新增成功"
                });
                // 關閉彈窗
                self.closeDialog();
                // 重新取得資料
                self.refresh();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "新增失敗"
                });
            }
        },
        // 更新薪水
        async update(form) {
            let self = this;
            try {
                await UpdateSalaryApi(form);
                self.$message({
                    type: "success",
                    message: "更新成功"
                });
                // 關閉彈窗
                self.closeDialog();
                // 重新取得資料
                self.refresh();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "更新失敗"
                });
            }
        },
        // 重新取得資料
        refresh() {
            let self = this;
            self.$emit("onRefresh");
        },
        /**
         * 取得薪水單一資料
         * @param { type String (字串) } account 員工帳號
         */

        async getData(account) {
            let self = this;
            try {
                let { data } = await SalaryDataApi(account);
                let getData = data.data;
                switch (getData.salaryable_type) {
                    case "App\\Models\\User\\UserAssistant":
                        getData["ableType"] = "assistant";
                        break;
                    case "App\\Models\\User\\UserSub":
                        getData["ableType"] = "subUser";
                        break;
                    default:
                        break;
                }
                self.form = getData;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "請得詳細資料失敗"
                });
            }
        },
        /**
         * 取得可選擇助理列表
         * @param { type String or Number(字串或數字) } operatorId
         */
        async getAssistant(operatorId) {
            let self = this;
            try {
                let { data } = await AssistantSelectListApi(operatorId);
                self.assistantOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得助理失敗"
                });
            }
        },
        /**
         * 取得可選擇子帳號列表
         * @param { type String or Number(字串或數字) } operatorId
         */
        async getSubUser(operatorId) {
            let self = this;
            try {
                let { data } = await SubUserSelectListApi(operatorId);
                self.userSubOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得子帳號失敗"
                });
            }
        },
        openDialog() {
            let self = this;
            // 取得可選擇助理列表
            self.getAssistant(self.operatorId);
            // 取得可選擇子帳號列表
            self.getSubUser(self.operatorId);
            // 判斷是否更新
            if (self.checkEdit) {
                self.getData(self.formAccount);
            }
        }
    }
};
</script>
