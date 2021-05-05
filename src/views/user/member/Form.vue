<template>
    <el-dialog :title="`${submitText}會員`"
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
                          placeholder="請輸入帳號"
                          :disabled="checkEdit"></el-input>
            </el-form-item>
            <el-form-item label="密碼"
                          prop="password">
                <el-input type="password"
                          v-model="form.password"
                          autocomplete="off"></el-input>
                <span class="text-warning"
                      v-if="checkEdit">有需要更新再輸入</span>
            </el-form-item>
            <el-form-item label="請確認密碼"
                          prop="passwordConfirm">
                <el-input type="password"
                          v-model="form.passwordConfirm"
                          autocomplete="off"></el-input>
                <span class="text-warning"
                      v-if="checkEdit">有需要更新再輸入</span>
            </el-form-item>
            <el-form-item label="客製化編號">
                <el-input v-model="form.custom_id"
                          placeholder="客製化編號"></el-input>
            </el-form-item>
            <el-form-item label="名稱"
                          prop="name">
                <el-input v-model="form.name"
                          placeholder="請輸入名稱"></el-input>
            </el-form-item>
            <el-form-item label="暱稱">
                <el-input v-model="form.nickname"
                          placeholder="請輸入暱稱"></el-input>
            </el-form-item>
            <el-form-item label="手機">
                <el-input v-model="form.phone"
                          placeholder="請輸入手機號碼"></el-input>
            </el-form-item>
            <el-form-item label="生日">
                <el-date-picker v-model="form.birthday"
                                type="date"
                                placeholder="選擇日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="狀態"
                          prop="status">
                <el-select v-model="form.status"
                           placeholder="請選擇狀態">
                    <el-option v-for="item in statusOptions"
                               :key="item.value"
                               :label="item.name"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="備註">
                <el-input v-model="form.note"
                          type="textarea"
                          placeholder="備註說明"></el-input>
            </el-form-item>
            <div class="text-right">
                <el-button type="primary"
                           @click="onSubmit('form')">{{ submitText }}</el-button>
                <el-button @click="closeDialog()">取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
// 導入 日期格式套件
import moment from "moment";
// 判斷是否為 null 或空字串方法
import { isEmpty } from "../../../service/anyService";
/**
 * AddMemberApi = 新增會員api
 * UpdateMemberApi = 更新會員api
 * MemberDataApi = 取得會員資料api
 */
import {
    AddMemberApi,
    UpdateMemberApi,
    MemberDataApi,
} from "../../../api/memberApi";
export default {
    props: {
        // 外部組件 傳值開啟彈窗
        showDialog: {
            type: Boolean,
            default: false,
        },
        // 判斷是否為更新
        checkEdit: {
            type: Boolean,
            default: false,
        },
        // 取得表單資料使用帳號
        formAccount: {
            type: String,
        },
        // 管理者id:
        operatorId: {
            type: [Number, String],
        },
    },
    computed: {
        ...mapState("userStore", ["user"]),
        ...mapGetters("userStore", ["getOperatorId"]),
        // 用來判斷是要呈現更新還是新增的按鈕
        submitText() {
            let self = this;
            if (self.checkEdit) {
                return "更新";
            }
            return "新增";
        },
    },
    data() {
        // 判斷密碼確認是否輸入一樣
        return {
            // 表單資料
            form: {},
            // 選擇啟用狀態
            statusOptions: [
                { name: "啟用", value: 5 },
                { name: "禁止", value: 0 },
            ],
            // 驗證規則
            rules: {
                account: [
                    {
                        required: true,
                        message: "請輸入帳號",
                        trigger: "blur",
                    },
                ],
                name: [
                    {
                        required: true,
                        message: "請輸入名稱",
                        trigger: "blur",
                    },
                ],
                status: [
                    {
                        required: true,
                        message: "請選擇狀態",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    methods: {
        // 判斷密碼是否有一樣
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
            self.form = {};
            self.$emit("onCloseDialog", false);
            self.$refs["form"].resetFields();
            self.$refs["form"].clearValidate();
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
                // 如果非空值時 執行日期格式轉換(因為後端日期格式要求所以須轉換對應格式)
                if (self.form.birthday !== null) {
                    self.form.birthday = moment(self.form.birthday).format("YYYY/MM/DD");
                } else {
                    delete self.form.birthday;
                }
                // 判斷是否為null 或空值 如果是的話不傳送 note key
                if (isEmpty(self.form.note)) {
                    delete self.form.note;
                }
                // 判斷是更新的話 執行更新方法
                if (self.checkEdit) {
                    self.update(self.form);
                    return;
                }
                // 判斷如果網址上有管理者id 時抓取網址上的管理者id
                if(self.$route.params.operatorId !== undefined) {
                    self.form.operator_id = self.$route.params.operatorId;
                } else {
                    // 如果網址上沒有管理者id 則抓取登入者id
                    self.form.operator_id = self.getOperatorId;
                }
                self.add(self.form);
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗",
                });
            }
        },
        /**
         * 新增會員
         * @param { type Obejct(物件) } form 表單資料
         */
        async add(form) {
            let self = this;
            try {
                await AddMemberApi(form);
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
        /**
         * 更新會員
         * @param { type Obejct(物件) } form 表單資料
         */
        async update(form) {
            let self = this;
            form["operator_id"] = self.operatorId;
            try {
                await UpdateMemberApi(form);
                self.$message({
                    type: "success",
                    message: "更新成功",
                });
                // 重取列表資料
                self.refreshData();
                // 關閉彈窗
                self.closeDialog();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "更新失敗",
                });
            }
        },
        /**
         * 取得會員資料
         * @param { type String (字串) }account 會員帳號
         */
        async getData(account) {
            let self = this;
            try {
                let { data } = await MemberDataApi(account);
                console.log(data.data.user_member_info);
                self.form = {
                    member_id: data.data.member_id,
                    member_info_id: data.data.user_member_info.id,
                    user_id: data.data.user.user_id,
                    status: data.data.status,
                    account: data.data.account,
                    note: data.data.note,
                    name: data.data.name,
                    nickname: data.data.nickname,
                    birthday: data.data.birthday,
                    phone: data.data.phone,
                    custom_id: data.data.user_member_info.custom_id,
                };
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得資料失敗",
                });
            }
        },
        // 重取列表資料
        refreshData() {
            let self = this;
            self.$emit("onRefreshData");
        },
        // 打開彈窗觸發事件
        openDialog() {
            let self = this;
            if (self.checkEdit) {
                self.getData(self.formAccount);
                self.rules.password = [
                    {
                        required: false,
                        message: "請輸入密碼",
                        trigger: "blur",
                    },
                ];
                self.rules.passwordConfirm = [
                    {
                        required: false,
                        validator: self.formCheckPassRule,
                    },
                ];
            } else {
                self.rules.password = [
                    {
                        required: true,
                        message: "請輸入密碼",
                        trigger: "blur",
                    },
                ];
                self.rules.passwordConfirm = [
                    {
                        required: true,
                        validator: self.formCheckPassRule,
                    },
                ];
            }
        },
    },
};
</script>