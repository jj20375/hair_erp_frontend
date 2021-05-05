<template>
    <el-dialog :title="'新增管理者'"
               :visible.sync="showDialog"
               :close-on-click-modal="true"
               :show-close="true"
               :modal-append-to-body="true"
               :close-on-press-escape="true"
               :before-close="closeDialog"
               @open="openDialog"
               @close="closeDialog"
               :width="isMobile ? '100%' : '50%'"
               center>
        <el-form :label-position="'right'"
                 :model="form"
                 status-icon
                 :rules="rules"
                 ref="form"
                 label-width="100px">
            <el-form-item label="帳號"
                          prop="account">
                <el-input v-model="form.account"
                          placeholder="請輸入帳號"></el-input>
            </el-form-item>
            <el-form-item label="密碼"
                          prop="password">
                <el-input type="password"
                          v-model="form.password"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="請確認密碼"
                          prop="passwordConfirm">
                <el-input type="password"
                          v-model="form.passwordConfirm"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="名稱"
                          prop="name">
                <el-input v-model="form.name"
                          placeholder="請輸入名稱"></el-input>
            </el-form-item>
            <el-form-item label="群組"
                          prop="group_id">
                <el-select v-model="form.group_id"
                           placeholder="請選擇群組">
                    <el-option v-for="(item,index) in groupOptions"
                               :key="index"
                               :label="item.group_name"
                               :value="item.group_id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="狀態"
                          prop="status">
                <el-select v-model="form.status"
                           placeholder="請選擇群組">
                    <el-option v-for="item in statusOptions"
                               :key="item.value"
                               :label="item.name"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="備註">
                <el-input type="textarea"
                          v-model="form.remarks"
                          placeholder="備註說明"></el-input>
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
import { mapState, mapGetters } from "vuex";
/**
 * AddOperatorApi = 新增管理者
 */
import { AddOperatorApi } from "../../../api/operatorApi";
// 取得群組列表
import { GroupSelectListApi } from "../../../api/groupApi";
export default {
    props: {
        // 外部組件 傳值開啟彈窗
        showDialog: {
            type: Boolean,
            default: false
        },
        // 當前層級管理者 id
        currentOperatorId: {
            type: Number,
            required: true
        }
    },
    computed: {
        ...mapState("userStore", ["user"]),
        // 取得每個登入身份使用者的管理者id
        ...mapGetters("userStore", ["getOperatorId"])
    },
    data() {
        return {
            // 判斷是否要呈現彈窗
            isShow: false,
            // 表單資料
            form: {},
            // 可選擇群組
            groupOptions: [],
            // 下拉選單選取啟用狀態
            statusOptions: [
                { name: "啟用", value: 5 },
                { name: "禁止", value: 0 }
            ],
            // 驗證規則
            rules: {
                account: [
                    {
                        required: true,
                        message: "請輸入帳號",
                        trigger: "blur"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "請輸入名稱",
                        trigger: "blur"
                    }
                ],
                group_id: [
                    {
                        required: true,
                        message: "請選擇群組",
                        trigger: "change"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "請選擇狀態",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    methods: {
        // 判斷密碼確認是否輸入一樣
        formCheckPassRule(rule, value, callback) {
            let self = this;
            if (value === "") {
                callback(new Error("請再次輸入密碼"));
            } else if (value !== self.form.password) {
                callback(new Error("請確認兩次密碼輸入一致!"));
            } else {
                callback();
            }
        },
        // 關閉彈窗
        closeDialog() {
            let self = this;
            self.$emit("onCloseDialog", false);
        },
        /**
         * 表單發送
         * @param { type String(字串) } formName 傳送表單名稱
         * @example ref="form"
         */
        async onSubmit(formName) {
            let self = this;
            // 判斷表單驗證成功了 才執行註冊
            try {
                // 等待表單驗證是否成功 try catch 會自動判斷是 true 或 false 因次不用寫 if 判斷
                await self.$refs[formName].validate();
                self.form.parent_id = self.currentOperatorId;
                self.add(self.form);
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗"
                });
            }
        },
        /**
         * 新增店家
         * @param { type Object(物件) } form 表單資料
         */
        async add(form) {
            let self = this;
            try {
                let { data } = await AddOperatorApi(form);
                self.$message({
                    type: "success",
                    message: "註冊管理者成功"
                });
                self.closeDialog();
                self.refresh();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "註冊管理者失敗"
                });
            }
        },
        // 打開彈窗觸發事件
        openDialog() {
            let self = this;
            // 用來發送取的群組列表的管理者id
            let sendGroupOperatorId = null;
            sendGroupOperatorId = self.getOperatorId;
            // 取得可用群組
            self.getGroupLists("OPERATOR", sendGroupOperatorId);
            // 新增密碼表單驗證
            self.rules.password = {
                required: true,
                message: "請輸入密碼",
                trigger: "blur"
            };
            self.rules.passwordConfirm = {
                required: true,
                validator: self.formCheckPassRule
            };
        },
        /**
         * 取得群組列表
         * @param { type String(字串) } groupCode 群組代碼
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getGroupLists(groupCode, operatorId) {
            let self = this;
            try {
                let { data } = await GroupSelectListApi(groupCode, operatorId);
                self.groupOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得群組列表失敗"
                });
            }
        },
        // 重置店家資料
        refresh() {
            let self = this;
            self.$emit("onRefresh", self.currentOperatorId);
        }
    }
};
</script>