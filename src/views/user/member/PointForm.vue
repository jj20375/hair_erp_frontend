<template>
    <el-dialog :title="`入金額度`"
               :visible.sync="showDialog"
               :close-on-click-modal="true"
               :show-close="true"
               :modal-append-to-body="true"
               :close-on-press-escape="true"
               :before-close="closeDialog"
               @open="openDialog"
               @close="closeDialog"
               :width="isMobile ? '100%' : '30%'"
               center>
        <template v-slot:title>
            <div>
                <h3 class="hotBorder borderBottomWidth2">新增點數</h3>
                <h3 class="hotBg text-white mb-0 py-2">剩餘點數:{{point}}</h3>
            </div>
        </template>
        <el-form :label-position="'left'"
                 :model="form"
                 status-icon
                 :rules="rules"
                 ref="form"
                 label-width="100px">
            <el-form-item label="點數"
                          prop="point">
                <el-input v-model.number="form.point"
                          type="number"
                          placeholder="請輸入點數"></el-input>
            </el-form-item>
            <el-form-item label="備註"
                          prop="remarks">
                <el-input v-model="form.remarks"
                          placeholder="請輸入點數"></el-input>
            </el-form-item>
            <div class="text-right">
                <el-button type="primary"
                           @click="onSubmit('form')">新增</el-button>
                <el-button @click="closeDialog()">取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import { mapState } from "vuex";
// 新增會員點數
import { AddMemberPointApi, MemberDataApi } from "../../../api/memberApi";
export default {
    props: {
        // 外部組件 傳值開啟彈窗
        showDialog: {
            type: Boolean,
            default: false,
        },
        // 取得表單資料使用帳號
        formAccount: {
            type: String,
        },
    },
    computed: {
        ...mapState("userStore", ["user"]),
    },
    data() {
        return {
            form: {},
            point: null,
            rules: {
                point: [
                    {
                        required: true,
                        message: "請輸入點數",
                        trigger: "blur",
                    },
                ],
                remarks: [
                    {
                        required: true,
                        message: "請輸入備註",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        // 關閉彈窗
        closeDialog() {
            let self = this;
            self.form = {};
            self.point = null;
            self.$emit("onCloseDialog", false);
            self.$refs["form"].resetFields();
            self.$refs["form"].clearValidate();
        },
        // 重取列表資料
        refreshData() {
            let self = this;
            self.$emit("onRefreshData");
        },
        /**
         * 取得會員資料
         * @param { type String (字串) }account 會員帳號
         */
        async getData(account) {
            let self = this;
            try {
                let { data } = await MemberDataApi(account);
                self.form = {
                    memberId: data.data.member_id,
                    userId: self.user.user_id,
                    operatorId: data.data.user_operator.operator_id,
                };
                if (data.data.user_member_info === null) {
                    self.form["member_info_id"] = 0;
                } else {
                    self.form["member_info_id"] = data.data.user_member_info.id;
                    self.point = data.data.user_member_info.point;
                }
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得資料失敗",
                });
            }
        },
        /**
         * 表單發送
         * @param { type String(字串) } formName 傳送表單名稱
         * @example ref="form"
         */
        async onSubmit(formName) {
            let self = this;
            // 判斷表單驗證成功了 才執行註冊或更新
            try {
                // 等待表單驗證是否成功 try catch 會自動判斷是 true 或 false 因次不用寫 if 判斷
                await self.$refs[formName].validate();
                self.add(self.form);
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗",
                });
            }
        },
        /**
         * 新增點數
         * @param { type Object } form 表單資料
         */
        async add(form) {
            let self = this;
            try {
                await AddMemberPointApi(form);
                self.$message({
                    type: "success",
                    message: "新增成功",
                });
                // 重取列表資料
                self.refreshData();
                // 關閉彈窗
                self.closeDialog();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "新增失敗",
                });
            }
        },
        // 打開彈窗觸發事件
        openDialog() {
            let self = this;
            self.getData(self.formAccount);
        },
    },
};
</script>
